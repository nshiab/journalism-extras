import { assertEquals } from "jsr:@std/assert";
import prettyDuration from "../../src/extras/prettyDuration.ts";

Deno.test("should preserve prettyDuration formatting", () => {
  assertEquals(prettyDuration(0, { end: 999 }), "999 ms");
  assertEquals(prettyDuration(0, { end: 61_001 }), "1 min, 1 sec, 1 ms");
  assertEquals(
    prettyDuration(0, {
      end: 3_661_001,
      prefix: "Elapsed: ",
      suffix: ".",
    }),
    "Elapsed: 1 h, 1 min, 1 sec, 1 ms.",
  );
});
