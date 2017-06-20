import test from 'ava';

import {
  UTIController
}
from '../src/uti';

test('buildin uti', async t => {
  const ctl = new UTIController();
  await ctl.initializeBuildin();

  const u1 = ctl.getUTI('public.json');

  t.is(u1.name, 'public.json');
});

test('getUTIsForFileName', async t => {
  const ctl = new UTIController();
  await ctl.initializeBuildin();

  t.is(ctl.getUTIsForFileName('a'), undefined);

  const us = ctl.getUTIsForFileName('a.txt');
  t.is(us[0], 'public.plain-text');
});

test('getUTIsForMimeType', async t => {
  const ctl = new UTIController();
  await ctl.initializeBuildin();

  const us = ctl.getUTIsForMimeType('text/plain');

  console.log(us);
  t.is(us[0], 'public.plain-text');
});

test('additinal UTIs', async t => {
  const ctl = new UTIController();
  await ctl.initializeBuildin();

  await ctl.loadDefinitions(
    `[{
      "name": "com.mydomain.sample2",
      "conformsTo": "public.json",
      "fileNameExtension": ".myext"
    }]`
  );
  const u1 = ctl.getUTI('com.mydomain.sample2');

  t.is(u1.name, 'com.mydomain.sample2');
});

/*
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
