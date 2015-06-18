/* jslint node: true, esnext: true */

"use strict";

const fs = require("fs");
const path = require("path");

const RootUTI = {
  toString() {
      return this.name;
    },
    toJSON() {
      return {
        name: this.name,
        conformsTo: this.conformsTo
      };
    }
};

exports.initialize = function (options) {
  if (!options) { 
    options = {};
  }

  const registry = {};
  const utiByFileNameExtension = {};

  function assignExtensions(extensions, name) {
    extensions.forEach(function (ext) {
      if (utiByFileNameExtension[ext]) {
        utiByFileNameExtension[ext].push(name);
      } else {
        //console.log(`${ext} : ${name}`);

        utiByFileNameExtension[ext] = [name];
      }
    });
  }

  /*
    function conformsTo(a, b) {
      console.log(`${a} <> ${b}`);

      const r = _conformsTo(a, b);

      console.log(`${a} <> ${b} -> ${r}`);
      return r;
    }
  */

  function conformsTo(a, b) {
    for (let i in a.conformsTo) {
      const u = a.conformsTo[i];

      if (u === b) {
        return true;
      }

      if (conformsTo(u, b)) {
        return true;
      }
    }
    return false;
  }

  const uti = {
    getUTI(name) {
        return registry[name];
      },
      getUTIsforFileName(fileName) {
        const m = fileName.match(/(\.[a-zA-Z_0-9]+)$/);

        //console.log(`${fileName} -> ${m[1]}`);
        if (m) {
          return utiByFileNameExtension[m[1]];
        }
        return undefined;
      },
      conformsTo(a, b) {
        a = registry[a];
        if (!a) {
          return false;
        }

        return conformsTo(a, registry[b]);
      },
      loadDefinitions(fileName) {
        return new Promise(function (resolve, reject) {
          fs.readFile(fileName, {
            encoding: "utf8"
          }, function (error, data) {
            if (error) {
              reject(error);
              return;
            }

            for (let u of JSON.parse(data)) {
              const properties = {
                name: {
                  value: u.name
                }
              };

              if (u.fileNameExtension) {
                assignExtensions(Array.isArray(u.fileNameExtension) ? u.fileNameExtension : [u.fileNameExtension],
                  u.name);
              }

              const conformsTo = {};

              if (u.conformsTo) {
                if (Array.isArray(u.conformsTo)) {
                  u.conformsTo.forEach(function (name) {
                    const aUTI = registry[name];
                    if (aUTI) {
                      conformsTo[name] = aUTI;
                    } else {
                      //reject(`unknown uti: ${name}`);
                    }
                  });
                } else {
                  const name = u.conformsTo;
                  conformsTo[name] = registry[name];
                }
              }

              properties.conformsTo = {
                value: conformsTo
              };

              const nu = Object.create(RootUTI, properties);

              registry[nu.name] = nu;
            }

            resolve(uti);
          });
        });
      }
  };

  const fileNames = [path.join(__dirname, 'publicUTI.json')];

  if (options.definitionFileName) {
    fileNames.push(options.definitionFileName);
  }

  return new Promise(function (resolve, reject) {
    Promise.all(fileNames.map(function (f) {
      return uti.loadDefinitions(f);
    })).then(function () {
      resolve(uti);
    }, reject);
  });
};
