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

/**
 * Initialized the uti api.
 * @param options {object} options.definitionFileName is given then additional UTIs will be loaded from the given file name
 * @return a promise that is fullfilled if the initialization is done
 */
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

  /**
   * Check whenever two UTI are conformant.
   * If a conforms to b and b conforms to c then a also conforms to c.
   * @param a {string} first UTI
   * @param a {string} second UTI
   * @return true if UTI a conforms to UTI b.
   */
  exports.conformsTo = function (a, b) {
    a = registry[a];
    if (!a) {
      return false;
    }

    return _conformsTo(a, registry[b]);
  };

/*
  TODO find a better name
  exports.allConformingTo = function *(a) {
    a = registry[a];
    if (!a) {
      return;
    }

    for (let i in a.conformsTo) {
      yield i;

      const u = a.conformsTo[i];
    }
  };
*/

  /**
   * Lookup a given UTI.
   * @param name {string} UTI
   * @return UTI for the given name or undefined if UTI is not present.
   */
  exports.getUTI = function (name) {
    return registry[name];
  };

  /**
   * Lookup a UTI for a file name.
   * First the file name extension is extracted.
   * Then a lookup in the reistered UTIs for file name extions is executed.
   * @param fileName {string} file to thetect UTI for
   * @return UTI for the given fileName or undefined if no UTI is registerd for the file names extension
   */
  exports.getUTIsForFileName = function (fileName) {
    const m = fileName.match(/(\.[a-zA-Z_0-9]+)$/);

    if (m) {
      return utiByFileNameExtension[m[1]];
    }
    return undefined;
  };

  /**
   * Load additional UTIs form a file.
   * @param fileName {string} file containing UTI definitions
   * @return a promise that resolves after the UTIs have been registered.
   */
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

  return Promise.all(fileNames.map(function (f) {
    return exports.loadDefinitionsFromFile(f); }));
};
