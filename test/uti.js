/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai');
chai.use(require("chai-as-promised"));
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const path = require('path');
const uti = require('../index.js');

describe('uti', function () {

  describe('buildin UTIs', function () {
    it('should be present', function (done) {
      uti.initialize().then(function () {
        const u1 = uti.getUTI('public.json');
        should.exist(u1);
        assert.equal(u1.toJSON().name, 'public.json');
        done();
      }, done);
    });

    describe('getUTIsForFileName', function () {
      it('simple', function (done) {
        uti.initialize().then(function () {
          assert.equal(uti.getUTIsForFileName('a.txt')[0], 'public.plain-text');
          assert.isUndefined(uti.getUTIsForFileName('a'));
          done();
        }, done);
      });
    });

    describe('getUTIsMimeType', function () {
      it('simple', function (done) {
        uti.initialize().then(function () {
          assert.equal(uti.getUTIsForMimeType('text/plain')[0], 'public.plain-text');
          done();
        }, done);
      });
    });

    describe('conformsTo', function () {
      it('positive', function (done) {
        uti.initialize().then(function () {
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
      it('negative', function (done) {
        uti.initialize().then(function () {
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

  describe('load additional UTIs', function () {
    it('should be present', function (done) {
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

    it('chained request should work', function (done) {
      uti.initialize({
          definitionFileName: path.join(__dirname, 'fixtures', 'uti.json')
        })
        .then(function () {
          return uti.loadDefinitionsFromFile(path.join(__dirname, 'fixtures', 'uti2.json'));
        })
        .then(function () {
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

  describe('loading errors', function () {
    it('should fail on missing file', function (done) {
      uti.initialize({
        definitionFileName: path.join(__dirname, 'fixtures', 'missing_file.json')
      }).then(function () {
        done(new Error('should have failed with missing file'));
      }, function (error) {
        assert(error.toString().match(/ENOENT/));
        done();
      });
    });

    it('should fail with json syntax error', function (done) {
      uti.initialize({
        definitionFileName: path.join(__dirname, 'fixtures', 'invalid.json')
      }).then(function () {
        done(new Error('should have failed with SyntaxError'));
      }, function (error) {
        assert(error.toString().match(/SyntaxError/));
        done();
      });
    });

    it('should fail with reference error', function (done) {
      uti.initialize({
        definitionFileName: path.join(__dirname, 'fixtures', 'missing_reference.json')
      }).then(function () {
        done(new Error('should have failed with reference error'));
      }, function (error) {
        assert(error.toString().match(/Referenced/));
        done();
      });
    });
  });
});
