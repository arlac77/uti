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

  const uti = {
    getUTI(name) {
        return registry[name];
      },
      conformsTo(a, b) {
        const utiA = registry[a];
        if (!utiA) {
          return false;
        }
        /*const utiB = registry[b];
        if (!utiB) {
          return false;
        }*/
        //console.log(`${a} ${utiA} ${b}` /* ${JSON.stringify(utiA.conformsTo)}` */ );
        return utiA.conformsTo[b];
      }, loadDefinitions(fileName) {
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

              const conformsTo = {};

              if (u.conformsTo) {
                if(Array.isArray(u.conformsTo)) {
                  u.conformsTo.forEach(function(name) {
                    const aUTI = registry[name];
                    if (aUTI) {
                      conformsTo[name] = aUTI;
                    }
                    else {
                      //reject(`unknown uti: ${name}`);
                    }
                  });
                  }
                else {
                  const name = u.conformsTo;
                  conformsTo[name] = registry[name];
                }
              }

              properties.conformsTo = {
                value: conformsTo
              };

              const nu = Object.create(RootUTI, properties);

              /*if(u.name === 'public.image') console.log(`${JSON.stringify(nu)}`);*/

              registry[nu.name] = nu;
            }

            resolve(uti);
          });
        });
      }
  };

  const p = uti.loadDefinitions(path.join(__dirname, 'publicUTI.json'));

  if (options.definitionFileName) {
    return new Promise(function (resolve, reject) {
      return Promise.all([p, uti.loadDefinitions(options.definitionFileName)]).then(function () {
        resolve(uti);
      },function(error) {
        reject(error);
      });
    });
  }

  return p;
};
