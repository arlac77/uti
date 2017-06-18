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

export class UTIController {
  constructor() {
    Object.defineProperty(this, 'registry', {
      value: new Map()
    });
    Object.defineProperty(this, 'utiByMimeType', {
      value: new Map()
    });
    Object.defineProperty(this, 'utiByFileNameExtension', {
      value: new Map()
    });
  }

  /**
   * Initialized the uti api.
   * @param options {object} options.definitionFileName is given then additional UTIs will be loaded from the given file name
   * @return {Promise} a promise that is fullfilled when the initialization is done
   */
  async initializeBuildin() {
    return this.loadDefinitionsFromFile(path.join(__dirname, '..', 'publicUTI.json'));
  }

  /**
   * Load UTIs form a file.
   * @param fileName {string} file containing UTI definitions
   * @return {Promise} a promise that resolves after the UTIs have been registered.
   */
  async loadDefinitionsFromFile(fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, {
        encoding: 'utf-8'
      }, (error, data) => {
        if (error) {
          reject(error);
          return;
        }
        try {
          resolve(this.loadDefinitions(data));
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  /**
   * Loads additionnal uti defintions from a (json) string
   * @param {String} data
   */
  async loadDefinitions(data) {
    for (const u of JSON.parse(data)) {
      const properties = {
        name: {
          value: u.name
        }
      };

      if (u.fileNameExtension !== undefined) {
        this.assignExtensions(Array.isArray(u.fileNameExtension) ? u.fileNameExtension : [u.fileNameExtension],
          u.name);
      }

      if (u.mimeType !== undefined) {
        this.assignMimeTypes(Array.isArray(u.mimeType) ? u.mimeType : [u.mimeType],
          u.name);
      }

      const conformsTo = {};

      if (u.conformsTo !== undefined) {
        const ct = Array.isArray(u.conformsTo) ? u.conformsTo : [u.conformsTo];

        ct.forEach(name => {
          const aUTI = this.getUTI(name);
          if (aUTI === undefined) {
            throw new Error(`Referenced UTI not known: ${name}`);
          } else {
            conformsTo[name] = aUTI;
          }
        });
      }

      properties.conformsTo = {
        value: conformsTo
      };

      const nu = Object.create(RootUTI, properties);

      this.registry.set(nu.name, nu);
    }
  }

  /**
   * Lookup a given UTI.
   * @param name {string} UTI
   * @return {string} UTI for the given name or undefined if UTI is not present.
   */
  getUTI(name) {
    return this.registry.get(name);
  }

  /**
   * Lookup a UTIs for a mime type.
   * @param mimeType {string} mime type to get UTIs for
   * @return {string}UTI for the given mime type or undefined if no UTI is registerd for the mime type
   */
  getUTIsForMimeType(mimeType) {
    return this.utiByMimeType.get(mimeType);
  }

  /*
   * Lookup a UTI for a file name.
   * First the file name extension is extracted.
   * Then a lookup in the reistered UTIs for file name extions is executed.
   * @param fileName {string} file to detect UTI for
   * @return {string} UTI for the given fileName or undefined if no UTI is registerd for the file names extension
   */
  getUTIsForFileName(fileName) {
    const m = fileName.match(/(\.[a-zA-Z_0-9]+)$/);
    return m ? this.utiByFileNameExtension.get(m[1]) : undefined;
  }

  /**
   * Check whenever two UTI are conformant.
   * If a conforms to b and b conforms to c then a also conforms to c.
   * @param a {string} first UTI
   * @param b {string} second UTI
   * @return {boolean} true if UTI a conforms to UTI b.
   */
  conformsTo(a, b) {
    const ra = this.registry.get(a);
    return ra === undefined ? false : _conformsTo(ra, this.registry.get(b));
  }

  assignMimeTypes(mimTypes, name) {
    mimTypes.forEach(type => {
      const u = this.utiByMimeType.get(type);
      if (u === undefined) {
        this.utiByMimeType.set(type, [name]);
      } else {
        u.push(name);
      }
    });
  }

  assignExtensions(extensions, name) {
    extensions.forEach(ext => {
      const e = this.utiByFileNameExtension.get(ext);
      if (e === undefined) {
        this.utiByFileNameExtension.set(ext, [name]);
      } else {
        e.push(name);
      }
    });
  }
}

function _conformsTo(a, b) {
  for (const u of a.conformsTo) {
    if (u === b) {
      return true;
    }

    if (_conformsTo(u, b)) {
      return true;
    }
  }
  return false;
}
