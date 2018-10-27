import { join } from "path";
import { promises } from "fs";

/**
 * Object representing a UTI
 * @param {string} name
 * @param {string} conforms
 *
 * @property {string} name
 * @property {string} conforms
 */
class UTI {
  constructor(name, conforms) {
    Object.defineProperties(this, {
      name: {
        value: name
      },
      conforms: {
        value: conforms
      }
    });
  }

  /**
   * Check for conformity
   * @param {UTI} other
   * @return {boolean} true if other conforms to the receiver
   */
  conformsTo(other) {
    if (this === other || this.conforms.has(other)) {
      return true;
    }

    for (const u of this.conforms) {
      if (u.conformsTo(other)) {
        return true;
      }
    }
    return false;
  }

  toString() {
    return this.name;
  }

  /**
   * Deliver JSON representation of the UTI.
   * Sample result
   * ´´´json
   * {
   *   "name": "myUTI",
   *   "conformsTo": [ "uti1", "uti2"]
   * }
   * ´´´
   * @return {Object} json representation of the UTI
   */
  toJSON() {
    return {
      name: this.name,
      conforms: this.conforms
    };
  }
}

/**
 * Registry of UTIs
 * @property {Map<string,UTI>} registry
 * @property {Map<string,UTI>} utiByMimeType
 * @property {Map<string,UTI>} utiByFileNameExtension
 */
export class UTIController {
  constructor() {
    Object.defineProperties(this, {
      registry: {
        value: new Map()
      },
      utiByMimeType: {
        value: new Map()
      },
      utiByFileNameExtension: {
        value: new Map()
      }
    });
  }

  /**
   * Initialized the uti api.
   * @return {Promise} a promise that is fullfilled when the initialization is done
   */
  async initializeBuildin() {
    return this.loadDefinitionsFromFile(
      join(__dirname, "..", "publicUTI.json")
    );
  }

  /**
   * Load UTIs form a file.
   * @param {string} fileName file containing UTI definitions
   * @return {Promise} a promise that resolves after the UTIs have been registered.
   */
  async loadDefinitionsFromFile(fileName) {
    return this.loadDefinitions(
      await promises.readFile(fileName, {
        encoding: "utf-8"
      })
    );
  }

  /**
   * Loads additional uti defintions from a (json) string
   * @param {string} data
   */
  async loadDefinitions(data) {
    for (const u of JSON.parse(data)) {
      if (u.fileNameExtension !== undefined) {
        this.assignExtensions(
          u.name,
          Array.isArray(u.fileNameExtension)
            ? u.fileNameExtension
            : [u.fileNameExtension]
        );
      }

      if (u.mimeType !== undefined) {
        this.assignMimeTypes(
          u.name,
          Array.isArray(u.mimeType) ? u.mimeType : [u.mimeType]
        );
      }

      const conforms = new Set();

      if (u.conformsTo !== undefined) {
        const ct = Array.isArray(u.conformsTo) ? u.conformsTo : [u.conformsTo];

        ct.forEach(name => {
          const aUTI = this.getUTI(name);
          if (aUTI === undefined) {
            throw new Error(`Referenced UTI not known: ${name}`);
          } else {
            conforms.add(aUTI);
          }
        });
      }

      const nu = new UTI(u.name, conforms);

      this.registry.set(nu.name, nu);
    }
  }

  /**
   * Lookup a given UTI.
   * @param {string} name UTI
   * @return {string} UTI for the given name or undefined if UTI is not present.
   */
  getUTI(name) {
    return this.registry.get(name);
  }

  /**
   * Lookup a UTIs for a mime type.
   * @param {string} mimeType mime type to get UTIs for
   * @return {string} UTI for the given mime type or undefined if no UTI is registerd for the mime type
   */
  getUTIsForMimeType(mimeType) {
    return this.utiByMimeType.get(mimeType);
  }

  /**
   * Lookup a UTI for a file name.
   * First the file name extension is extracted.
   * Then a lookup in the reistered UTIs for file name extions is executed.
   * @param {string} fileName file to detect UTI for
   * @return {string} UTI for the given fileName or undefined if no UTI is registerd for the file names extension
   */
  getUTIsForFileName(fileName) {
    const m = fileName.match(/(\.[a-zA-Z_0-9]+)$/);
    return m ? this.utiByFileNameExtension.get(m[1]) : undefined;
  }

  /**
   * Check whenever two UTI are conformant.
   * If a conforms to b and b conforms to c then a also conforms to c.
   * @param {string} a first UTI
   * @param {string} b second UTI
   * @return {boolean} true if UTI a conforms to UTI b.
   */
  conformsTo(a, b) {
    const ua = this.registry.get(a);
    return ua === undefined ? false : ua.conformsTo(this.registry.get(b));
  }

  assignMimeTypes(name, mimTypes) {
    mimTypes.forEach(type => {
      const u = this.utiByMimeType.get(type);
      if (u === undefined) {
        this.utiByMimeType.set(type, [name]);
      } else {
        u.push(name);
      }
    });
  }

  assignExtensions(name, extensions) {
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
