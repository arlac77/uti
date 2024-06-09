import types from "./well-known-utis.mjs";

/**
 * Object representing a UTI.
 * @param {string} name
 * @param {Set<UTI>} conforms
 *
 * @property {string} name
 * @property {Set<UTI>} conforms
 */
class UTI {
  /**
   * Object representing a UTI.
   * @param {string} name
   * @param {Set<UTI>} conforms
   *
   * @property {string} name
   * @property {Set<UTI>} conforms
   */
  constructor(name, conforms) {
    this.name = name;
    this.conforms = conforms;
  }

  /**
   * Check for conformity.
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

  /**
   * name of the UTI.
   * @returns {string}
   */
  toString() {
    return this.name;
  }

  /**
   * Deliver JSON representation of the UTI.
   * Sample result
   * ```json
   * {
   *   "name": "myUTI",
   *   "conformsTo": [ "uti1", "uti2"]
   * }
   * ```
   * @return {{name:string, conforms: string[]}} json representation of the UTI
   */
  toJSON() {
    return {
      name: this.name,
      conforms: [...this.conforms].map(u => u.name)
    };
  }
}

/**
 * Registry of UTIs.
 * @property {Map<string,UTI>} registry
 * @property {Map<string,UTI>} utiByMimeType
 * @property {Map<string,UTI>} utiByFileNameExtension
 */
export class UTIController {
  /** @type {Map<string,UTI>} */ registry = new Map();
  /** @type {Map<string,string[]>} */ utiByMimeType = new Map();
  /** @type {Map<string,string[]>} */ utiByFileNameExtension = new Map();

  constructor() {
    this.register(types);
  }

  /**
   * Registers additional types.
   * @param {UTI[]} types
   */
  register(types) {
    for (const u of types) {
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
   * @return {UTI|undefined} UTI for the given name or undefined if UTI is not present.
   */
  getUTI(name) {
    return this.registry.get(name);
  }

  /**
   * Lookup a UTIs for a mime type.
   * @param {string} mimeType mime type to get UTIs for
   * @return {string[]} UTIs for the given mime type
   */
  getUTIsForMimeType(mimeType) {
    return this.utiByMimeType.get(mimeType) || [];
  }

  /**
   * Lookup a UTI for a file name.
   * First the file name extension is extracted.
   * Then a lookup in the registered UTIs for file name extension is executed.
   * @param {string} fileName file to detect UTI for
   * @return {string[]} UTIs for the given fileName
   */
  getUTIsForFileName(fileName) {
    const m = fileName.match(/(\.[\.a-zA-Z_0-9]+)$/);

    if (m) {
      for (
        let extension = m[1];
        extension.length > 0;
        extension = extension.replace(/^\.[a-zA-Z_0-9]+/, "")
      ) {
        const utis = this.utiByFileNameExtension.get(extension);
        if (utis) {
          return utis;
        }
      }
    }

    return [];
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

  /**
   * Lookup a UTI for a file name and check conformance.
   * @param {string} fileName file to detect UTI for
   * @param {string} uti to check conformance against
   * @return {boolean} true if utils for file name are conformant
   */
  fileNameConformsTo(fileName, uti) {
    const utis = this.getUTIsForFileName(fileName);
    if (utis !== undefined) {
      for (const u of utis) {
        if (this.conformsTo(u, uti)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Assign mime types to a UTI
   * @param {string} uti
   * @param {string[]} mimeTypes
   */
  assignMimeTypes(uti, mimeTypes) {
    mimeTypes.forEach(type => {
      const u = this.utiByMimeType.get(type);
      if (u === undefined) {
        this.utiByMimeType.set(type, [uti]);
      } else {
        u.push(uti);
      }
    });
  }

  /**
   * Assign mime types to a UTI
   * @param {string} uti
   * @param {string[]} extensions
   */
  assignExtensions(uti, extensions) {
    extensions.forEach(ext => {
      const e = this.utiByFileNameExtension.get(ext);
      if (e === undefined) {
        this.utiByFileNameExtension.set(ext, [uti]);
      } else {
        e.push(uti);
      }
    });
  }
}
