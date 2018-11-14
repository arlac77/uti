import test from "ava";
import { join } from "path";
import { readFileSync } from "fs";
import { UTIController } from "../src/uti";

test("buildin uti", t => {
  const ctl = new UTIController();
  const u1 = ctl.getUTI("public.json");

  t.is(u1.name, "public.json");
});

test("getUTIsForFileName", t => {
  const ctl = new UTIController();

  t.is(ctl.getUTIsForFileName("a"), undefined);
  t.deepEqual(ctl.getUTIsForFileName("a.txt"), ["public.plain-text"]);
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

test("from file should be present", t => {
  const ctl = new UTIController();

  ctl.register(
    JSON.parse(
      readFileSync(join(__dirname, "..", "tests", "fixtures", "uti.json"), {
        encoding: "utf-8"
      })
    )
  );

  t.is(ctl.getUTI("public.json").name, "public.json");
  t.is(ctl.getUTI("com.mydomain.sample").name, "com.mydomain.sample");
});

test("should fail with reference error", t => {
  const ctl = new UTIController();

  try {
    ctl.register(
      JSON.parse(
        readFileSync(
          join(__dirname, "..", "tests", "fixtures", "missing_reference.json"),
          { encoding: "utf-8" }
        )
      )
    );
  } catch (err) {
    t.is(err.toString(), "Error: Referenced UTI not known: unknown.uti.other");
  }
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

  t.true(ctl.fileNameConformsTo("a.cpio","public.archive"));
  t.true(ctl.fileNameConformsTo("a.rpm","public.archive"));
  t.true(ctl.fileNameConformsTo("a.rar","public.archive"));
  t.true(ctl.fileNameConformsTo("a.tar","public.archive"));
  t.true(ctl.fileNameConformsTo("a.tar.gz","public.archive"));
  t.true(ctl.fileNameConformsTo("a.tgz","public.archive"));
  t.true(ctl.fileNameConformsTo("a.zip","public.archive"));
  t.true(ctl.fileNameConformsTo("a.jar","public.archive"));
  t.true(ctl.fileNameConformsTo("a.war","public.archive"));
  t.true(ctl.fileNameConformsTo("a.ear","public.archive"));
  t.true(ctl.fileNameConformsTo("a.jks","public.archive"));
  t.false(ctl.fileNameConformsTo("a.zap","public.archive"));
  t.false(ctl.fileNameConformsTo("a","public.archive"));
});
