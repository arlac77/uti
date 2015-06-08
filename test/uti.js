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
        done();
      }, function (error) {
        console.log(`${error}`);
        assert(false);
        done();
      });
    });
  });

  describe('addtitional UTIs', function () {
    it('should be present', function (done) {
      uti.initialize({
        definitionFile: path.join(__dirname, 'fixtures', 'uti.json')
      }).then(function (uti) {
        const myUTI = uti.getUTI('com.mydomain.sample');
        should.exist(myUTI);
        done();
      }, function (error) {
        console.log(`${error}`);
        assert(false);
        done();
      });
    });
  });

});
