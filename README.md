# uti
[![Build Status](https://secure.travis-ci.org/arlac77/uti.png)](http://travis-ci.org/arlac77/uti)
[![Coverage Status](https://coveralls.io/repos/arlac77/uti/badge.svg)](https://coveralls.io/r/arlac77/uti)
[![Dependency Status](https://david-dm.org/arlac77/uti.svg)](https://david-dm.org/arlac77/uti)
[![devDependency Status](https://david-dm.org/arlac77/uti/dev-status.svg)](https://david-dm.org/arlac77/uti#info=devDependencies)

Uniform Type Identifier
-----------------------
For a list of known UTIs please see [(http://www.escape.gr/manuals/qdrop/UTI.html)]


# example

## myuti.js

```js
var uti = require('uti');

uti.initialize().then(function() {
  doesConformTo = uti.conformsTo('public.image', 'public.data')
  console.log('doesConformTo: ' + doesConformTo);

  console.log(uti.getUTIsForFileName('a.txt')[0]);
})
```

Output

```
true
public.plain-text
```

# methods

```js
var uti = require('uti');
```

## initialize(options)
Returns a promise that is fullfilled if the initialization is done.
If options.definitionFileName is given then additional UTIs will be loaded from the given file name

## conformsTo(a,b)
Returns true if UTI a conforms to UTI b
This is transitive: If a conforms to b and b conforms to c then a also conforms to c.

## getUTIsForFileName(aFileName)
Returns array of UTIs matching a file name (based on its extension)

## loadDefinitionsFromFile(aDefinitionFileName)
Loads additional UTIs form the given file name and returns promise

## getUTI(name)
Returns the UTI for the given name.
Returns undefined if no such UTI is known.

# json structure
```json
[
{ "name" : "org.mydomain.type1", "conformsTo" : ["public.image","public.xml"], "fileNameExtension": ".type1" },
{ "name" : "org.mydomain.type2", "conformsTo" : "public.image" }
]
```

# install

With [npm](http://npmjs.org) do:

```
npm install uti
```

# license

BSD-2-Clause
