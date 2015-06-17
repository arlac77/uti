
[![Build Status](https://secure.travis-ci.org/arlac77/uti.png)](http://travis-ci.org/arlac77/uti)
[![Coverage Status](https://coveralls.io/repos/arlac77/uti/badge.svg)](https://coveralls.io/r/arlac77/uti)

Uniform Type Identifier
-----------------------


# example

## myuti.js

```js
var uti = require('uti');

uti.initialize().then(function(uti) {
  doesConformTo = uti.conformsTo('public.image', 'public.data')
  console.log('doesConformTo: ' + doesConformTo);
})
```

Output

```
true
```

# methods

```js
var uti = require('uti');
```

## initialize(options)
returns a promise that fullfilles to the api providing object
if options.definitionFileName is given then additional UTIs will be loaded from the given file name

## conformsTo(a,b)
returns true if UTI a conforms to UTI b

## getUTIsforFileName(aFileName)

returns array of UTIs matching a file name (based on its extension)

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

Fro a list of known UTIs please see [(http://www.escape.gr/manuals/qdrop/UTI.html)]
