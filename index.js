/* jslint node: true, esnext: true */

"use strict";

const fs = require("fs");
const path = require("path");

const RootUTI = {
  toString() {
      return this.name
    },
    toJSON() {
      return {
        name: this.name
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
        const utiB = registry[b];
        if (!utiB) {
          return false;
        }
        //console.log(`${a} ${utiA} ${b} ${utiB}`);
        return utiA.conformsTo.has(b);
      }, loadDefinitions(fileName) {
        //console.log(`load ${fileName}`);
        return new Promise(function (resolve, reject) {
          fs.readFile(fileName, {
            encoding: "utf8"
          }, function (error, data) {
            if (error) {
              reject(error);
              return;
            }

            for (let u of JSON.parse(data)) {
              //console.log(`${JSON.stringify(u)}`);
              const properties = {
                name: {
                  value: u.name
                }
              };

              if (u.conformsTo) {
                const c = Array.isArray(u.conformsTo) ? u.conformsTo : [u.conformsTo];
                const conformsTo = new Set(c.map(function (e) {
                  const u = registry[e];
                  //console.log(`conformsTo: ${i} ${u}`);
                  if (u) return u;
                  reject(`unknown uti: ${e}`);
                  return undefined;
                }));
                properties.conformsTo = {
                  vlaue: conformsTo
                };
              } else {
                properties.conformsTo = {
                  value: new Set()
                };
              }

              const nu = Object.create(RootUTI, properties);

              registry[nu.name] = nu;

              //console.log(`${JSON.stringify(nu)}`);
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
      });
    });
  }

  return p;
};
