/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai');
chai.use(require("chai-as-promised"));
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

let path = require('path');
let uti = require('../index.js');

describe('uti', function () {

  describe('buildin UTIs', function () {
    it('should be present', function (done) {
      uti.initialize().then(function (uti) {
        const u1 = uti.getUTI('public.json');
        should.exist(u1);
        assert(u1.toJSON().name === 'public.json');
        done();
      }, function (error) {
        console.log(`${error}`);
        assert(false);
        done();
      });
    });

    describe('getUTIsforFileName', function () {
      it('simple', function (done) {
        uti.initialize().then(function (uti) {
          assert(uti.getUTIsforFileName('a.txt')[0] === 'public.plain-text');
          assert(uti.getUTIsforFileName('a') === undefined);
          done();
        });
      });
    });

    describe('conformsTo', function () {
      it('positive', function (done) {
        uti.initialize().then(function (uti) {
          assert(uti.conformsTo('public.image', 'public.data'));
          assert(uti.conformsTo('public.image', 'public.content'));
          assert(uti.conformsTo('public.plain-text', 'public.data'));
          assert(uti.conformsTo('public.tar-archive', 'public.data'));
          assert(uti.conformsTo('public.volume', 'public.folder'));
          assert(uti.conformsTo('public.volume', 'public.directory'));
          assert(uti.conformsTo('public.volume', 'public.item'));
          done();
        });
      });
      it('negative', function (done) {
        uti.initialize().then(function (uti) {
          assert(!uti.conformsTo('undefined.uti', 'public.xml'));
          assert(!uti.conformsTo('public.image', 'public.xml'));
          done();
        });
      });

    });

  });

  describe('load additional UTIs', function () {
    it('should be present', function (done) {
      uti.initialize({
        definitionFileName: path.join(__dirname, 'fixtures', 'uti.json')
      }).then(function (uti) {
        const json = uti.getUTI('public.json');
        should.exist(json);
        const myUTI = uti.getUTI('com.mydomain.sample');
        should.exist(myUTI, `is present ${myUTI}`);
        done();
      }, function (error) {
        console.log(`${error}`);
        assert(false);
        done();
      });
    });
  });

  describe('loading errors', function () {
    it('should fail on missing file', function (done) {
      uti.initialize({
        definitionFileName: path.join(__dirname, 'fixtures', 'missing_file.json')
      }).then(function (uti) {
        assert(false);
        done();
      }, function (error) {
        assert(error.toString().match(/ENOENT/));
        done();
      });

    });
    it('should fail with json syntax error', function (done) {
      uti.initialize({
        definitionFileName: path.join(__dirname, 'fixtures', 'invalid.json')
      }).then(function (uti) {
        assert(false);
        done();
      }, function (error) {
        assert(error.toString().match(/SyntaxError/));
        done();
      });
    });

  });

});
