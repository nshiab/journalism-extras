/**
 * Browser-compatible timing and ID utilities for journalism projects.
 *
 * Install with `npm install @nshiab/journalism-extras`.
 *
 * @example
 * ```ts
 * import { getId } from "@nshiab/journalism-extras/web";
 *
 * const id = getId(10);
 * console.log(id); // e.g., "a1B2c3D4e5"
 * ```
 *
 * @module
 */

import getId from "./extras/getId.ts";
import sleep from "./extras/sleep.ts";
import DurationTracker from "./extras/DurationTracker.ts";

export { DurationTracker, getId, sleep };
