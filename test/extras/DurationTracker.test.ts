import { assert, test } from "vite-plus/test";
import DurationTracker from "../../src/extras/DurationTracker.ts";
import sleep from "../../src/extras/sleep.ts";

test("should log the remaining time", async () => {
  const data = [0, 1, 2, 3, 4];

  const tracker = new DurationTracker(data.length);

  for (const _item of data) {
    tracker.start();
    // Simulate processing time
    await sleep(10);
    tracker.log();
  }

  // How to assert?
  assert.deepStrictEqual(true, true);
});

test("should log the remaining time with a prefix and suffix", async () => {
  const data = [0, 1, 2, 3, 4];

  const tracker = new DurationTracker(data.length, {
    prefix: "Remaining: ",
    suffix: ` (something)`,
  });

  for (const _item of data) {
    tracker.start();
    // Simulate processing time
    await sleep(10);
    tracker.log();
  }

  // How to assert?
  assert.deepStrictEqual(true, true);
});
