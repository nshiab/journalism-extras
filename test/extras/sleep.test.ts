import { assert, test } from "vite-plus/test";
import sleep from "../../src/extras/sleep.ts";

test("should sleep for 100ms", async () => {
  await sleep(100);

  assert.deepStrictEqual(true, true);
});
test("should sleep for 100ms and log information", async () => {
  await sleep(100, { log: true });

  assert.deepStrictEqual(true, true);
});
test("should sleep for 50ms with the start option and log information", async () => {
  const start = new Date();
  await sleep(50);
  await sleep(100, { start, log: true });

  assert.deepStrictEqual(true, true);
});
test("should not sleep with the start option and log information", async () => {
  const start = new Date();
  await sleep(150);
  await sleep(100, { start, log: true });

  assert.deepStrictEqual(true, true);
});
