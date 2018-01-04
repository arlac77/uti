[![npm](https://img.shields.io/npm/v/uti.svg)](https://www.npmjs.com/package/uti)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


# uti

## Uniform Type Identifier

Please see "ars technica" article for a description about the principles of UTIs [(http://arstechnica.com/apple/2005/04/macosx-10-4/11/)].

For a list of known UTIs please see [(http://www.escape.gr/manuals/qdrop/UTI.html)\]

# example

## myuti.js

```javascript
const { UTIController } = require('uti');

const uc = new UTIController();
uc.initializeBuildin().then(() => {
  const doesConformTo = uc.conformsTo('public.image', 'public.data');
  console.log('doesConformTo: ' + doesConformTo);

  console.log(uc.getUTIsForFileName('a.txt')[0]);
});
```

Output

```
true
public.plain-text
```

# API

# methods

```js
var uti = require('uti');
```

## initialize(options)

Returns a promise that is fulfilled if the initialization is done. If options.definitionFileName is given then additional UTIs will be loaded from the given file name

## conformsTo(a,b)

Returns true if UTI a conforms to UTI b This is transitive: If a conforms to b and b conforms to c then a also conforms to c.

## getUTIsForFileName(aFileName)

Returns array of UTIs matching a file name (based on its extension)

## loadDefinitionsFromFile(aDefinitionFileName)

Loads additional UTIs form the given file name and returns promise

## getUTI(name)

Returns the UTI for the given name. Returns undefined if no such UTI is known.

# json structure used by loadDefinitionsFromFile()

```json
[
  {
    "name": "org.mydomain.type1",
    "conformsTo": ["public.image", "public.xml"],
    "fileNameExtension": ".type1"
  },
  {
    "name": "org.mydomain.type2",
    "conformsTo": "public.image",
    "fileNameExtension": [".type2", ".type3"]
  }
]
```

jsdoc can be found [here](http://arlac77.github.io/modules/uti/doc/).

# install

With [npm](http://npmjs.org) do:

```shell
npm install uti
```

# license

BSD-2-Clause
