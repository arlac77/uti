/* jslint node: true, esnext: true */

"use strict";

const fs = require("fs");
const path = require("path");

const RootUTI = {
  toString() {
      return this.name;
    },

    /**
     * Deliver JSON representation of the UTI.
     * Sample result
     * {
     *   "name": "myUTI",
     *   "conformsTo": [ "uti1", "uti2"]
     * }
     * @return json representation of the UTI
     */
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
  const utiByMimeType = {};

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

  function assignMimeTypes(mimTypes, name) {
    mimTypes.forEach(function (type) {
      if (utiByMimeType[type]) {
        utiByMimeType[type].push(name);
      } else {
        utiByMimeType[type] = [name];
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
   * @param fileName {string} file to detect UTI for
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
   * Lookup a UTIs for a mime type.
   * @param mimeType {string} mime type to get UTIs for
   * @return UTI for the given mime type or undefined if no UTI is registerd for the mime type
   */
  exports.getUTIsForMimeType = function (mimeType) {
    return utiByMimeType[mimeType];
  };

  /**
   * Load additional UTIs form a file.
   * @param fileName {string} file containing UTI definitions
   * @return a promise that resolves after the UTIs have been registered.
   */
  exports.loadDefinitionsFromFile = function (fileName) {

    // not using promisify-node any longer since it has some side-effects into the plain fs module
    return new Promise(function (resolve, reject) {
      fs.readFile(fileName, {
        encoding: "utf-8"
      }, function (error, data) {
        if (error) {
          reject(error);
          return;
        }
        try {
          resolve(registerUTIs(data));
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  function registerUTIs(data) {
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

      if (u.mimeType) {
        assignMimeTypes(Array.isArray(u.mimeType) ? u.mimeType : [u.mimeType],
          u.name);
      }

      const conformsTo = {};

      if (u.conformsTo) {
        const ct = Array.isArray(u.conformsTo) ? u.conformsTo : [u.conformsTo];

        ct.forEach(function (name) {
          const aUTI = registry[name];
          if (aUTI) {
            conformsTo[name] = aUTI;
          } else {
            throw new Error(`Referenced UTI not known: ${name}`);
          }
        });
      }

      properties.conformsTo = {
        value: conformsTo
      };

      const nu = Object.create(RootUTI, properties);

      registry[nu.name] = nu;
    }
  };

  /*
    const array = [exports.loadDefinitionsFromFile(path.join(__dirname, 'publicUTI.json'))];
    if (options.definitionFileName) {
      array.push(exports.loadDefinitionsFromFile(options.definitionFileName));
    }

    function processArray(array, fn) {
      return array.reduce(function (p, item) {
        return p.then(fn);
      }, Promise.resolve());
    }

    return processArray(array, function () {
      console.log('done loading');
    });
  */

  /*
    const p = exports.loadDefinitionsFromFile(path.join(__dirname, 'publicUTI.json'));

    if (options.definitionFileName) {
      return p.then(exports.loadDefinitionsFromFile(options.definitionFileName));
    }

    return p;
  */

  const fileNames = [path.join(__dirname, 'publicUTI.json')];

  if (options.definitionFileName) {
    fileNames.push(options.definitionFileName);
  }

  return Promise.all(fileNames.map(function (f) {
    return exports.loadDefinitionsFromFile(f);
  }));

};
