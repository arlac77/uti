import test from "ava";
import { UTIController } from "uti";

test("buildin uti", t => {
  const ctl = new UTIController();
  const u1 = ctl.getUTI("public.json");

  t.is(u1.name, "public.json");
  t.is(`${u1}`, "public.json");
  t.deepEqual(u1.toJSON(), { conforms: ["public.text"], name: "public.json" });
});

test("getUTIsForFileName", t => {
  const ctl = new UTIController();

  t.deepEqual(ctl.getUTIsForFileName("a"), []);
  t.deepEqual(ctl.getUTIsForFileName("a.txt"), ["public.plain-text"]);
  t.deepEqual(ctl.getUTIsForFileName("a.js.map"), ["public.sourcemap"]);
  t.deepEqual(ctl.getUTIsForFileName("a-1.2.3.js.map"), ["public.sourcemap"]);
});

test("getUTIsForMimeType", t => {
  const ctl = new UTIController();
  const us = ctl.getUTIsForMimeType("text/plain");

  t.is(us[0], "public.plain-text");
});

test("additinal UTIs", t => {
  const ctl = new UTIController();

  ctl.register([
    {
      name: "com.mydomain.sample2",
      conformsTo: "public.json",
      fileNameExtension: ".myext"
    }
  ]);
  const u1 = ctl.getUTI("com.mydomain.sample2");

  t.is(u1.name, "com.mydomain.sample2");
});

test("conformsTo positive", t => {
  const ctl = new UTIController();
  t.true(ctl.conformsTo("public.image", "public.data"));
  t.true(ctl.conformsTo("public.image", "public.content"));
  t.true(ctl.conformsTo("public.plain-text", "public.data"));
  t.true(ctl.conformsTo("public.image", "public.data"));
  t.true(ctl.conformsTo("public.tar-archive", "public.data"));
  t.true(ctl.conformsTo("public.volume", "public.folder"));
  t.true(ctl.conformsTo("public.volume", "public.directory"));
  t.true(ctl.conformsTo("public.volume", "public.item"));
});

test("conformsTo negative", t => {
  const ctl = new UTIController();
  t.false(ctl.conformsTo("undefined.uti", "public.xml"));
  t.false(ctl.conformsTo("public.image", "public.xml"));
});

test("fileNameConformsTo public.archive", t => {
  const ctl = new UTIController();

  t.true(ctl.fileNameConformsTo("a.cpio", "public.archive"));
  t.true(ctl.fileNameConformsTo("a.rpm", "public.archive"));
  t.true(ctl.fileNameConformsTo("a.rar", "public.archive"));
  t.true(ctl.fileNameConformsTo("a.tar", "public.archive"));
  t.true(ctl.fileNameConformsTo("a.tar.gz", "public.archive"));
  t.true(ctl.fileNameConformsTo("a.tgz", "public.archive"));
  t.true(ctl.fileNameConformsTo("a.zip", "public.archive"));
  t.true(ctl.fileNameConformsTo("a.jar", "public.archive"));
  t.true(ctl.fileNameConformsTo("a.war", "public.archive"));
  t.true(ctl.fileNameConformsTo("a.ear", "public.archive"));
  t.true(ctl.fileNameConformsTo("a.jks", "public.archive"));
  t.false(ctl.fileNameConformsTo("a.zap", "public.archive"));
  t.false(ctl.fileNameConformsTo("a", "public.archive"));
});

test("fileNameConformsTo public.archive with URL like name", t => {
  const ctl = new UTIController();

  t.true(
    ctl.fileNameConformsTo(
      "http://central.maven.org/maven2/log4j/log4j/1.2.7/log4j-1.2.7.jar",
      "public.archive"
    )
  );
});

test("fileNameConformsTo public.archive glob pattern", t => {
  const ctl = new UTIController();

  t.true(ctl.fileNameConformsTo("**/log4j-*.tar.gz", "public.archive"));
  t.false(ctl.fileNameConformsTo("**/log4j-*.tar.gz", "public.image"));
});
