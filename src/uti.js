/* jslint node: true, esnext: true */

'use strict';

const fs = require('fs'),
  path = require('path');

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

const registry = {};
const utiByFileNameExtension = {};
const utiByMimeType = {};

function assignExtensions(extensions, name) {
  extensions.forEach(ext => {
    if (utiByFileNameExtension[ext]) {
      utiByFileNameExtension[ext].push(name);
    } else {
      //console.log(`${ext} : ${name}`);

      utiByFileNameExtension[ext] = [name];
    }
  });
}

function assignMimeTypes(mimTypes, name) {
  mimTypes.forEach(type => {
    if (utiByMimeType[type]) {
      utiByMimeType[type].push(name);
    } else {
      utiByMimeType[type] = [name];
    }
  });
}

function _conformsTo(a, b) {
  for (const i in a.conformsTo) {
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
 * @param b {string} second UTI
 * @return {boolean} true if UTI a conforms to UTI b.
 */
function conformsTo(a, b) {
  a = registry[a];
  if (!a) {
    return false;
  }

  return _conformsTo(a, registry[b]);
}

/**
 * Lookup a given UTI.
 * @param name {string} UTI
 * @return {string} UTI for the given name or undefined if UTI is not present.
 */
function getUTI(name) {
  return registry[name];
}

/**
 * Lookup a UTIs for a mime type.
 * @param mimeType {string} mime type to get UTIs for
 * @return {string} UTI for the given mime type or undefined if no UTI is registerd for the mime type
 */
function getUTIsForMimeType(mimeType) {
  return utiByMimeType[mimeType];
}

/*
 * Lookup a UTI for a file name.
 * First the file name extension is extracted.
 * Then a lookup in the reistered UTIs for file name extions is executed.
 * @param fileName {string} file to detect UTI for
 * @return {string} UTI for the given fileName or undefined if no UTI is registerd for the file names extension
 */
function getUTIsForFileName(fileName) {
  const m = fileName.match(/(\.[a-zA-Z_0-9]+)$/);

  if (m) {
    return utiByFileNameExtension[m[1]];
  }
  return undefined;
}

/**
 * Loads additionnal uti defintions from a (json) string
 * @param {String} data
 */
function loadDefinitions(data) {
  for (const u of JSON.parse(data)) {
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

      ct.forEach(name => {
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

  return 'ok';
}

/**
 * Load additional UTIs form a file.
 * @param fileName {string} file containing UTI definitions
 * @return {Promise} a promise that resolves after the UTIs have been registered.
 */
function loadDefinitionsFromFile(fileName) {
  // not using promisify-node any longer since it has some side-effects into the plain fs module
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, {
      encoding: 'utf-8'
    }, (error, data) => {
      if (error) {
        reject(error);
        return;
      }
      try {
        resolve(loadDefinitions(data));
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Initialized the uti api.
 * @param options {object} options.definitionFileName is given then additional UTIs will be loaded from the given file name
 * @return {Promise} a promise that is fullfilled when the initialization is done
 */
function initialize(options = {}) {

  const loadPromise = loadDefinitionsFromFile(path.join(__dirname, 'publicUTI.json'));

  if (options.definitionFileName) {
    return loadPromise.then(resolved => loadDefinitionsFromFile(options.definitionFileName));
  }

  return loadPromise;
}

export {
  initialize,
  conformsTo,
  getUTI,
  getUTIsForFileName,
  getUTIsForMimeType,
  loadDefinitionsFromFile,
  loadDefinitions
};
