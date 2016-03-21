/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  path = require('path'),
  uti = require('../index.js');

describe('uti', () => {
  describe('buildin UTIs', () => {
    it('should be present', done => {
      uti.initialize().then(() => {
        const u1 = uti.getUTI('public.json');
        should.exist(u1);
        assert.equal(u1.toJSON().name, 'public.json');
        done();
      }, done);
    });

    describe('getUTIsForFileName', () => {
      it('simple', done => {
        uti.initialize().then(() => {
          assert.equal(uti.getUTIsForFileName('a.txt')[0], 'public.plain-text');
          assert.isUndefined(uti.getUTIsForFileName('a'));
          done();
        }, done);
      });
    });

    describe('getUTIsMimeType', () => {
      it('simple', done => {
        uti.initialize().then(() => {
          assert.equal(uti.getUTIsForMimeType('text/plain')[0], 'public.plain-text');
          done();
        }, done);
      });
    });

    describe('conformsTo', () => {
      it('positive', done => {
        uti.initialize().then(() => {
          try {
            assert.isTrue(uti.conformsTo('public.image', 'public.data'));
            assert.isTrue(uti.conformsTo('public.image', 'public.content'));
            assert.isTrue(uti.conformsTo('public.plain-text', 'public.data'));
            assert.isTrue(uti.conformsTo('public.tar-archive', 'public.data'));
            assert.isTrue(uti.conformsTo('public.volume', 'public.folder'));
            assert.isTrue(uti.conformsTo('public.volume', 'public.directory'));
            assert.isTrue(uti.conformsTo('public.volume', 'public.item'));
            done();
          } catch (e) {
            done(e);
          }
        }, done);
      });
      it('negative', done => {
        uti.initialize().then(() => {
          try {
            assert.isFalse(uti.conformsTo('undefined.uti', 'public.xml'));
            assert.isFalse(uti.conformsTo('public.image', 'public.xml'));
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
      uti.initialize().then(() => {
        try {
          uti.loadDefinitions(
            `[{
            "name": "com.mydomain.sample2",
            "conformsTo": "public.json",
            "fileNameExtension": ".myext"
          }]`
          );
          const myUTI = uti.getUTI('com.mydomain.sample2');
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
      uti.initialize({
        definitionFileName: path.join(__dirname, 'fixtures', 'uti.json')
      }).then(function () {
        const json = uti.getUTI('public.json');
        should.exist(json);
        const myUTI = uti.getUTI('com.mydomain.sample');
        should.exist(myUTI, `is present ${myUTI}`);
        done();
      }, done);
    });

    it('chained request should work', done => {
      uti.initialize({
          definitionFileName: path.join(__dirname, 'fixtures', 'uti.json')
        })
        .then(() =>
          uti.loadDefinitionsFromFile(path.join(__dirname, 'fixtures', 'uti2.json'))
        )
        .then(() => {
          try {
            const json = uti.getUTI('public.json');
            should.exist(json);

            const myUTI = uti.getUTI('com.mydomain.sample2');
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
    uti.initialize({
      definitionFileName: path.join(__dirname, 'fixtures', 'missing_file.json')
    }).then(() =>
      done(new Error('should have failed with missing file')), (error) => {
        assert(error.toString().match(/ENOENT/));
        done();
      });
  });

  it('should fail with json syntax error', done => {
    uti.initialize({
      definitionFileName: path.join(__dirname, 'fixtures', 'invalid.json')
    }).then(() =>
      done(new Error('should have failed with SyntaxError')), error => {
        assert(error.toString().match(/SyntaxError/));
        done();
      });
  });

  it('should fail with reference error', done => {
    uti.initialize({
      definitionFileName: path.join(__dirname, 'fixtures', 'missing_reference.json')
    }).then(() =>
      done(new Error('should have failed with reference error')), error => {
        assert(error.toString().match(/Referenced/));
        done();
      });
  });
});
