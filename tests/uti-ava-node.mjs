import test from "ava";
import { readFileSync } from "node:fs";
import { UTIController } from "uti";

test("from file should be present", t => {
    const ctl = new UTIController();
  
    ctl.register(
      JSON.parse(
        readFileSync(new URL("fixtures/uti.json", import.meta.url).pathname, {
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
            new URL("fixtures/missing_reference.json", import.meta.url).pathname,
            { encoding: "utf-8" }
          )
        )
      );
    } catch (err) {
      t.is(err.toString(), "Error: Referenced UTI not known: unknown.uti.other");
    }
  });
  