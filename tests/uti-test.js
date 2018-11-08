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

  const us = ctl.getUTIsForFileName("a.txt");
  t.is(us[0], "public.plain-text");
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
  t.is(ctl.conformsTo("public.image", "public.data"), true);
  t.is(ctl.conformsTo("public.image", "public.content"), true);
  t.is(ctl.conformsTo("public.plain-text", "public.data"), true);
  t.is(ctl.conformsTo("public.image", "public.data"), true);
  t.is(ctl.conformsTo("public.tar-archive", "public.data"), true);
  t.is(ctl.conformsTo("public.volume", "public.folder"), true);
  t.is(ctl.conformsTo("public.volume", "public.directory"), true);
  t.is(ctl.conformsTo("public.volume", "public.item"), true);
});

test("conformsTo negative", t => {
  const ctl = new UTIController();
  t.is(ctl.conformsTo("undefined.uti", "public.xml"), false);
  t.is(ctl.conformsTo("public.image", "public.xml"), false);
});
