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
        const json = uti.getUTI('public.json');
        should.exist(json);
        //console.log(`${uti.conformsTo('public.image', 'public.data')}`);
        assert(uti.conformsTo('public.image', 'public.data'));
        assert(uti.conformsTo('public.image', 'public.content'));
        done();
      }, function (error) {
        console.log(`${error}`);
        assert(false);
        done();
      });
    });
  });

  describe('additional UTIs', function () {
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

  describe('additional UTIs', function () {
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
  });

});
