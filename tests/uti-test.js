import test from 'ava';
import { join } from 'path';
import { UTIController } from '../src/uti';

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
  await ctl.loadDefinitionsFromFile(
    join(__dirname, '..', 'tests', 'fixtures', 'uti.json')
  );

  t.is(ctl.getUTI('public.json').name, 'public.json');
  t.is(ctl.getUTI('com.mydomain.sample').name, 'com.mydomain.sample');
});

test('from missing file should fail', async t => {
  const ctl = new UTIController();
  await ctl.initializeBuildin();
  try {
    await ctl.loadDefinitionsFromFile(
      join(__dirname, '..', 'tests', 'fixtures', 'missing_file.json')
    );
  } catch (err) {
    t.is(
      err.toString(),
      `Error: ENOENT: no such file or directory, open '${join(
        __dirname,
        '..',
        'tests',
        'fixtures',
        'missing_file.json'
      )}'`
    );
  }
});

test('should fail with json syntax error', async t => {
  const ctl = new UTIController();
  await ctl.initializeBuildin();
  try {
    await ctl.loadDefinitionsFromFile(
      join(__dirname, '..', 'tests', 'fixtures', 'invalid.json')
    );
  } catch (err) {
    t.is(
      err.toString(),
      'SyntaxError: Unexpected token } in JSON at position 100'
    );
  }
});

test('should fail with reference error', async t => {
  const ctl = new UTIController();
  await ctl.initializeBuildin();

  try {
    await ctl.loadDefinitionsFromFile(
      join(__dirname, '..', 'tests', 'fixtures', 'missing_reference.json')
    );
  } catch (err) {
    t.is(err.toString(), 'Error: Referenced UTI not known: unknown.uti.other');
  }
});

test('conformsTo positive', async t => {
  const ctl = new UTIController();
  await ctl.initializeBuildin();
  t.is(ctl.conformsTo('public.image', 'public.data'), true);
  t.is(ctl.conformsTo('public.image', 'public.content'), true);
  t.is(ctl.conformsTo('public.plain-text', 'public.data'), true);
  t.is(ctl.conformsTo('public.image', 'public.data'), true);
  t.is(ctl.conformsTo('public.tar-archive', 'public.data'), true);
  t.is(ctl.conformsTo('public.volume', 'public.folder'), true);
  t.is(ctl.conformsTo('public.volume', 'public.directory'), true);
  t.is(ctl.conformsTo('public.volume', 'public.item'), true);
});

test('conformsTo negative', async t => {
  const ctl = new UTIController();
  await ctl.initializeBuildin();
  t.is(ctl.conformsTo('undefined.uti', 'public.xml'), false);
  t.is(ctl.conformsTo('public.image', 'public.xml'), false);
});
