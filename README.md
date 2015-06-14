
[![Build Status](https://secure.travis-ci.org/arlac77/uti.png)](http://travis-ci.org/arlac77/uti)

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


# install

With [npm](http://npmjs.org) do:

```
npm install uti
```
# license

BSD-2-Clause

Fro a list of known UTIs please see [(http://www.escape.gr/manuals/qdrop/UTI.html)]
