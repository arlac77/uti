/* jslint node: true, esnext: true */

"use strict";

const promisify = require("promisify-node");
const fs = promisify("fs");
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

  function _conformsTo(a, b) {
    for (let i in a.conformsTo) {
      const u = a.conformsTo[i];

      if (u === b) {
        return true;
      }

      if (_conformsTo(u, b)) {
        return true;
      }
    }
    return false;
  }

  exports.conformsTo = function (a, b) {
    a = registry[a];
    if (!a) {
      return false;
    }

    return _conformsTo(a, registry[b]);
  };

  exports.getUTI = function (name) {
    return registry[name];
  };

  exports.getUTIsForFileName = function (fileName) {
    const m = fileName.match(/(\.[a-zA-Z_0-9]+)$/);

    if (m) {
      return utiByFileNameExtension[m[1]];
    }
    return undefined;
  };

  exports.loadDefinitionsFromFile = function (fileName) {
    return fs.readFile(fileName, {
      encoding: "utf-8"
    }).then(function (data) {
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
    });
  };

/*
    let p = exports.loadDefinitionsFromFile(path.join(__dirname, 'publicUTI.json'));

    if (options.definitionFileName) {
      p = p.then(exports.loadDefinitionsFromFile(options.definitionFileName));
    }

    return p;
*/

  const fileNames = [path.join(__dirname, 'publicUTI.json')];

  if (options.definitionFileName) {
    fileNames.push(options.definitionFileName);
  }

  return new Promise(function (resolve, reject) {
    return Promise.all(fileNames.map(function (f) {
      return exports.loadDefinitionsFromFile(f);
    })).then(function () {
      resolve(exports);
    }, reject);
  });
};
