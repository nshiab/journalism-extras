import { assert, test } from "vite-plus/test";
import prettyDuration from "../../src/extras/prettyDuration.ts";

test("should preserve prettyDuration formatting", () => {
  assert.deepStrictEqual(prettyDuration(0, { end: 999 }), "999 ms");
  assert.deepStrictEqual(prettyDuration(0, { end: 61_001 }), "1 min, 1 sec, 1 ms");
  assert.deepStrictEqual(
    prettyDuration(0, {
      end: 3_661_001,
      prefix: "Elapsed: ",
      suffix: ".",
    }),
    "Elapsed: 1 h, 1 min, 1 sec, 1 ms.",
  );
});
