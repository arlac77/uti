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

            const u = JSON.parse(data);

            for (let i in u) {
              const conformsTo = new Set(Array.isArray(u.conformsTo) ? u.conformsTo : [u.conformsTo]);

              const nu = Object.create(RootUTI, {
                name: {
                  value: i
                },
                conformsTo: {
                  value: conformsTo
                }
              });

              //console.log(i);
              registry[i] = nu;
            }

            resolve(uti);
          });
        });
      }
  };

  const p = uti.loadDefinitions(path.join(__dirname, 'publicUTI.json'));

  if (options.definitionFile) {
    return p.then(uti.loadDefinitions(options.definitionFileName));
  }

  return p;
};
