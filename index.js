/* jslint node: true, esnext: true */

"use strict";

const fs = require("fs");
const path = require("path");

exports.initialize = function () {

  const registry = {};

  const uti = {
    getUTI(name) {
      return registry[name];
    },
    conformesTo(a, b) {
      const utiA = registry[a];
      if(!utiA) { return false; }
      return utiA.conformsTo[b];
    }, loadDefinitions(fileName) {
      return new Promise(function (resolve, reject) {
        console.log(`load: ${fileName}`);
        fs.createReadStream(fileName, {
          encoding: "utf8"
        }, function (error, data) {
          console.log(`${error} ${data}`);
          if(error) { reject(error); return; }

          const u = JSON.parse(data);

          for (let i in u) {
            const nu = { conformsTo: { }};
            registry[i] = nu;
          }

          resolve(uti);
        });
      });
    }
  };

  return uti.loadDefinitions(path.join(__dirname, 'publicUTI.json'));
};
