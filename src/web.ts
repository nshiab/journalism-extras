/**
 * @module
 *
 * The Journalism library (extras functions) - Web entry point
 *
 * To install the library with Deno, use:
 * ```bash
 * deno add jsr:@nshiab/journalism-extras
 * ```
 *
 * To install the library with Node.js, use:
 * ```bash
 * npm i @nshiab/journalism-extras
 * ```
 *
 * To import a function from the web entry point, use:
 * ```ts
 * import { functionName } from "@nshiab/journalism-extras/web";
 * ```
 */

import getId from "./extras/getId.ts";
import sleep from "./extras/sleep.ts";
import DurationTracker from "./extras/DurationTracker.ts";

export { DurationTracker, getId, sleep };
