/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai');
chai.use(require("chai-as-promised"));
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

let uti = require('../index.js');

describe('uti', function () {

  describe('buildin utis', function () {
    it('should be present', function (done) {
      uti.initialize().then(function (uti) {
        const json = uti.getUTI('public.json');
        should.exist(json);
        done();
      },function(error) {
        console.log(`${error}`);
        assert(false);
        done();
        });
    });
  });

});
