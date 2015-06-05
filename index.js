/* jslint node: true, esnext: true */

"use strict";
const fs = require("fs");
const path = require("path");


exports = function () {

  const registry = {};

  const uti = {
    conformesTo(a, b) {
      return false;
    }
  };

  fs.createReadStream(path.join(__dirname, 'publicUTI.json'), {
    encoding: "utf8"
  }, function (error, data) {
    const u = JSON.parse(data);

    for (let i in u) {
      registry[i] = {};
    }
  });

  return new Promise();
};
