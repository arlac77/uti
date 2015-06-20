### 0.0.0-semantically-released (2015-06-20)


#### Bug Fixes

* handle exceptions during loadDefinitions() ([69ed1aa4](git+https://github.com/arlac77/uti/commit/69ed1aa44ff3458b14366a3ddc34975189e93ccd))
* conformsTo transitive looks good ([f5c9cf27](git+https://github.com/arlac77/uti/commit/f5c9cf277a2697e73def321e1d8d8977fe3b76c9))


#### Features

* transitive conformsTo() - but only one level is working ([7a315f85](git+https://github.com/arlac77/uti/commit/7a315f857ed6e6c1e139d6f92acb6c8122f57f31))
* **initilize:** adopting some mode promise best bractices ([a26471bb](git+https://github.com/arlac77/uti/commit/a26471bb9b2e29371bdabf91f1ff76d7741a9e38))
* **release:** make use of semantic-release ([333996f6](git+https://github.com/arlac77/uti/commit/333996f614ed4d4f4e167826c1e66446efe01590))


#### Breaking Changes

* the promise returned from intialize() does not deliver the api object.

const uti = require('uti');

uti.initialize().then(function() {
  // use the module uti handle here
  const myUTI= uti.getUTI('public.text');
});

 ([56255a99](git+https://github.com/arlac77/uti/commit/56255a99b431c182db10a797ebc3a3fcedf76c83))

