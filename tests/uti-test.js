import test from 'ava';

import {
  UTI
}
from '../src/uti';

const path = require('path');

test('buildin uti', async t => {
  new UTI
  initialize().then(() => {
    const u1 = getUTI('public.json');
    should.exist(u1);
    assert.equal(u1.toJSON().name, 'public.json');
    done();
  }, done);


  t.deepEqual(scheme.name, 'file');
});


/*
describe('uti', () => {
  describe('buildin UTIs', () => {
    it('should be present', done => {
      initialize().then(() => {
        const u1 = getUTI('public.json');
        should.exist(u1);
        assert.equal(u1.toJSON().name, 'public.json');
        done();
      }, done);
    });

    describe('getUTIsForFileName', () => {
      it('simple', done => {
        initialize().then(() => {
          assert.equal(getUTIsForFileName('a.txt')[0], 'public.plain-text');
          assert.isUndefined(getUTIsForFileName('a'));
          done();
        }, done);
      });
    });

    describe('getUTIsMimeType', () => {
      it('simple', done => {
        initialize().then(() => {
          assert.equal(getUTIsForMimeType('text/plain')[0], 'public.plain-text');
          done();
        }, done);
      });
    });

    describe('conformsTo', () => {
      it('positive', done => {
        initialize().then(() => {
          try {
            assert.isTrue(conformsTo('public.image', 'public.data'));
            assert.isTrue(conformsTo('public.image', 'public.content'));
            assert.isTrue(conformsTo('public.plain-text', 'public.data'));
            assert.isTrue(conformsTo('public.tar-archive', 'public.data'));
            assert.isTrue(conformsTo('public.volume', 'public.folder'));
            assert.isTrue(conformsTo('public.volume', 'public.directory'));
            assert.isTrue(conformsTo('public.volume', 'public.item'));
            done();
          } catch (e) {
            done(e);
          }
        }, done);
      });
      it('negative', done => {
        initialize().then(() => {
          try {
            assert.isFalse(conformsTo('undefined.uti', 'public.xml'));
            assert.isFalse(conformsTo('public.image', 'public.xml'));
            done();
          } catch (e) {
            done(e);
          }
        }, done);
      });
    });
  });
});

describe('load additional UTIs', () => {
  describe('from json', () => {
    it('should be present', done => {
      initialize().then(() => {
        try {
          loadDefinitions(
            `[{
            "name": "com.mydomain.sample2",
            "conformsTo": "public.json",
            "fileNameExtension": ".myext"
          }]`
          );
          const myUTI = getUTI('com.mydomain.sample2');
          should.exist(myUTI, `is present ${myUTI}`);
        } catch (e) {
          done(e);
        }
        done();
      }, done);
    });
  });

  describe('from a file', () => {
    it('should be present', done => {
      initialize({
        definitionFileName: path.join(__dirname, 'fixtures', 'uti.json')
      }).then(function () {
        const json = getUTI('public.json');
        should.exist(json);
        const myUTI = getUTI('com.mydomain.sample');
        should.exist(myUTI, `is present ${myUTI}`);
        done();
      }, done);
    });

    it('chained request should work', done => {
      initialize({
          definitionFileName: path.join(__dirname, 'fixtures', 'uti.json')
        })
        .then(() =>
          loadDefinitionsFromFile(path.join(__dirname, 'fixtures', 'uti2.json'))
        )
        .then(() => {
          try {
            const json = getUTI('public.json');
            should.exist(json);

            const myUTI = getUTI('com.mydomain.sample2');
            should.exist(myUTI, 'com.mydomain.sample2');
            done();
          } catch (e) {
            done(e);
          }
        }, done);
    });
  });
});

describe('loading errors', () => {
  it('should fail on missing file', done => {
    initialize({
      definitionFileName: path.join(__dirname, 'fixtures', 'missing_file.json')
    }).then(() =>
      done(new Error('should have failed with missing file')), (error) => {
        assert(error.toString().match(/ENOENT/));
        done();
      });
  });

  it('should fail with json syntax error', done => {
    initialize({
      definitionFileName: path.join(__dirname, 'fixtures', 'invalid.json')
    }).then(() =>
      done(new Error('should have failed with SyntaxError')), error => {
        assert(error.toString().match(/SyntaxError/));
        done();
      });
  });

  it('should fail with reference error', done => {
    initialize({
      definitionFileName: path.join(__dirname, 'fixtures', 'missing_reference.json')
    }).then(() =>
      done(new Error('should have failed with reference error')), error => {
        assert(error.toString().match(/Referenced/));
        done();
      });
  });
});

*/
