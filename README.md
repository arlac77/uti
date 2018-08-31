[![npm](https://img.shields.io/npm/v/uti.svg)](https://www.npmjs.com/package/uti)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# uti

## Uniform Type Identifier

Please see "ars technica" article for a description about the principles of UTIs [(http://arstechnica.com/apple/2005/04/macosx-10-4/11/)].

For a list of known UTIs please see \[(<http://www.escape.gr/manuals/qdrop/UTI.html>)]

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

```txt
    true
    public.plain-text
```

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [UTI](#uti)
    -   [Parameters](#parameters)
    -   [Properties](#properties)
    -   [conformsTo](#conformsto)
        -   [Parameters](#parameters-1)
    -   [toJSON](#tojson)
-   [UTIController](#uticontroller)
    -   [Properties](#properties-1)
    -   [initializeBuildin](#initializebuildin)
    -   [loadDefinitionsFromFile](#loaddefinitionsfromfile)
        -   [Parameters](#parameters-2)
    -   [loadDefinitions](#loaddefinitions)
        -   [Parameters](#parameters-3)
    -   [getUTI](#getuti)
        -   [Parameters](#parameters-4)
    -   [getUTIsForMimeType](#getutisformimetype)
        -   [Parameters](#parameters-5)
    -   [getUTIsForFileName](#getutisforfilename)
        -   [Parameters](#parameters-6)
    -   [conformsTo](#conformsto-1)
        -   [Parameters](#parameters-7)

## UTI

Object representing a UTI

### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `conforms` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### Properties

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `conforms` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### conformsTo

Check if for conformity

#### Parameters

-   `other` **[UTI](#uti)** 

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if other conforms to the receiver

### toJSON

Deliver JSON representation of the UTI.
Sample result
´´´json
{
  "name": "myUTI",
  "conformsTo": [ "uti1", "uti2"]
}
´´´

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** json representation of the UTI

## UTIController

Registry of UTIs

### Properties

-   `registry` **[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [UTI](#uti)>** 
-   `utiByMimeType` **[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [UTI](#uti)>** 
-   `utiByFileNameExtension` **[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [UTI](#uti)>** 

### initializeBuildin

Initialized the uti api.

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise that is fullfilled when the initialization is done

### loadDefinitionsFromFile

Load UTIs form a file.

#### Parameters

-   `fileName` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** file containing UTI definitions

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise that resolves after the UTIs have been registered.

### loadDefinitions

Loads additional uti defintions from a (json) string

#### Parameters

-   `data` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### getUTI

Lookup a given UTI.

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** UTI

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** UTI for the given name or undefined if UTI is not present.

### getUTIsForMimeType

Lookup a UTIs for a mime type.

#### Parameters

-   `mimeType` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** mime type to get UTIs for

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** UTI for the given mime type or undefined if no UTI is registerd for the mime type

### getUTIsForFileName

Lookup a UTI for a file name.
First the file name extension is extracted.
Then a lookup in the reistered UTIs for file name extions is executed.

#### Parameters

-   `fileName` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** file to detect UTI for

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** UTI for the given fileName or undefined if no UTI is registerd for the file names extension

### conformsTo

Check whenever two UTI are conformant.
If a conforms to b and b conforms to c then a also conforms to c.

#### Parameters

-   `a` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** first UTI
-   `b` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** second UTI

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if UTI a conforms to UTI b.

# install

With [npm](http://npmjs.org) do:

```shell
npm install uti
```

# license

BSD-2-Clause
