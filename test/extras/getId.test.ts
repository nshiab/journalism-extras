import { assert, test } from "vite-plus/test";
import getId from "../../src/extras/getId.ts";

test("should create 100 000 unique ids", () => {
  const ids: string[] = [];
  for (let i = 0; i < 100_000; i++) {
    ids.push(getId());
  }

  console.log("First 5 ids:", ids.slice(0, 5));
  assert.deepStrictEqual(new Set(ids).size, 100_000);
});
test("should create 100 000 unique ids with a length of 10", () => {
  const ids: string[] = [];
  for (let i = 0; i < 100_000; i++) {
    ids.push(getId(10));
  }

  console.log("First 5 ids:", ids.slice(0, 5));
  assert.deepStrictEqual(new Set(ids).size === 100_000 && ids[0].length === 10, true);
});
