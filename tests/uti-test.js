import test from 'ava';

import {
  UTIController
}
from '../src/uti';

const path = require('path');

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

test('from file should be present', async t => {
  const ctl = new UTIController();
  await ctl.initializeBuildin();
  await ctl.loadDefinitionsFromFile(path.join(__dirname, '..', 'tests', 'fixtures', 'uti.json'));

  t.is(ctl.getUTI('public.json').name, 'public.json');
  t.is(ctl.getUTI('com.mydomain.sample').name, 'com.mydomain.sample');
});

test('from missing file should fail', async t => {
  const ctl = new UTIController();
  await ctl.initializeBuildin();
  try {
    await ctl.loadDefinitionsFromFile(path.join(__dirname, '..', 'tests', 'fixtures', 'missing_file.json'));
  } catch (err) {
    t.deepEqual(err.toString().match(/ENOENT/), ['ENOENT']);
  }
});

test('should fail with json syntax error', async t => {
  const ctl = new UTIController();
  await ctl.initializeBuildin();
  try {
    await ctl.loadDefinitionsFromFile(path.join(__dirname, '..', 'tests', 'fixtures', 'invalid.json'));
  } catch (err) {
    t.deepEqual(err.toString().match(/SyntaxError/), ['SyntaxError']);
  }
});

test('should fail with reference error', async t => {
  const ctl = new UTIController();
  await ctl.initializeBuildin();
  try {
    await ctl.loadDefinitionsFromFile(path.join(__dirname, '..', 'tests', 'fixtures', 'missing_reference.json'));
  } catch (err) {
    t.deepEqual(err.toString().match(/Referenced/), ['Referenced']);
  }
});

test('conformsTo', async t => {
  const ctl = new UTIController();
  await ctl.initializeBuildin();

  t.isTrue(ctl.conformsTo('public.image', 'public.data'));
});

/*
    describe('conformsTo', () => {
      it('positive', done => {
        initialize().then(() => {
          try {
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
*/
