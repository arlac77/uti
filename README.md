[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://secure.travis-ci.org/arlac77/uti.png)](http://travis-ci.org/arlac77/uti)
[![codecov.io](http://codecov.io/github/arlac77/uti/coverage.svg?branch=master)](http://codecov.io/github/arlac77/uti?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/uti/badge.svg)](https://snyk.io/test/github/arlac77/uti)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm](https://img.shields.io/npm/v/uti.svg)](https://www.npmjs.com/package/uti)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/uti.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/uti)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![minified size](https://badgen.net/bundlephobia/min/uti)](https://bundlephobia.com/result?p=uti)
[![downloads](http://img.shields.io/npm/dm/uti.svg?style=flat-square)](https://npmjs.org/package/uti)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/uti.svg?style=flat-square)](https://github.com/arlac77/uti/issues)

# uti

## Uniform Type Identifier

Please see "ars technica" article for a description about the principles of UTIs [(http://arstechnica.com/apple/2005/04/macosx-10-4/11/)].

For a list of known UTIs please see \[(<http://www.escape.gr/manuals/qdrop/UTI.html>)]

# example

## myuti.js

<!-- skip-example -->

```javascript
import { UTIController } from "uti";

const uc = new UTIController();
const doesConformTo = uc.conformsTo("public.image", "public.data");
console.log("doesConformTo: " + doesConformTo);

console.log(uc.getUTIsForFileName("a.txt")[0]);
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
    -   [register](#register)
        -   [Parameters](#parameters-2)
    -   [getUTI](#getuti)
        -   [Parameters](#parameters-3)
    -   [getUTIsForMimeType](#getutisformimetype)
        -   [Parameters](#parameters-4)
    -   [getUTIsForFileName](#getutisforfilename)
        -   [Parameters](#parameters-5)
    -   [conformsTo](#conformsto-1)
        -   [Parameters](#parameters-6)
    -   [fileNameConformsTo](#filenameconformsto)
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

Check for conformity

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

### register

registers additional types

#### Parameters

-   `types` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** 

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

### fileNameConformsTo

Lookup a UTI for a file name and check conformance

#### Parameters

-   `fileName` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** file to detect UTI for
-   `uti` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** to check conformance egainst

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** ture if utils for file name are conformant

# install

With [npm](http://npmjs.org) do:

```shell
npm install uti
```

# license

BSD-2-Clause
