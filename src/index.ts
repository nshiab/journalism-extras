/**
 * Filesystem, encoding, timing, and ID utilities for journalism projects.
 *
 * Install with `npm install @nshiab/journalism-extras`.
 * Requires Node.js 24.21.0 or later and ES modules.
 *
 * @example
 * ```ts
 * import { getId } from "@nshiab/journalism-extras";
 *
 * const id = getId(10);
 * console.log(id); // e.g., "a1B2c3D4e5"
 * ```
 *
 * @module
 */

import unzip from "./extras/unzip.ts";
import zip from "./extras/zip.ts";
import createDirectory from "./extras/createDirectory.ts";
import removeDirectory from "./extras/removeDirectory.ts";
import getId from "./extras/getId.ts";
import sleep from "./extras/sleep.ts";
import DurationTracker from "./extras/DurationTracker.ts";
import reencode from "./extras/reencode.ts";

export { createDirectory, DurationTracker, getId, reencode, removeDirectory, sleep, unzip, zip };
