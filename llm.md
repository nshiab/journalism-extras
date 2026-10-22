**Journalism Extras v1.0.14**

***

# The Journalism Library (extras)

Useful TypeScript functions for journalism projects that do not fit in the other
journalism modules.
Part of the [journalism library](https://github.com/nshiab/journalism).

The library is maintained by [Nael Shiab](https://naelshiab.com/), computational
journalist and senior data producer for [CBC News](https://www.cbc.ca/news).

> [!TIP]
> To learn how to use this library and more, check out
> [Code Like a Journalist](https://www.code-like-a-journalist.com/), a free and
> open-source data analysis and data visualization course in TypeScript. You
> might also find
> [simple-data-analysis](https://github.com/nshiab/simple-data-analysis) useful.

## Installation

Use `import`
and set `"type": "module"` in your project's `package.json`.

```sh
npm install @nshiab/journalism-extras
```

```ts
import { createDirectory } from "@nshiab/journalism-extras";

createDirectory("./output/data");
```

For browser projects, use the `/web` entry point:

```ts
import { getId } from "@nshiab/journalism-extras/web";

console.log(getId(10)); // e.g., "a1B2c3D4e5"
```

To start a data project with folders, configuration and documentation for AI
agents, run:

```sh
npx @nshiab/setup-data-project
```

## Documentation

- [Documentation](https://nshiab.github.io/journalism-extras/)
- [llms.txt — Documentation index for AI agents](https://nshiab.github.io/journalism-extras/llms.txt)
- [llm.md — Complete Markdown reference](https://nshiab.github.io/journalism-extras/llm.md),
  for AI assistants or offline reading
- [npm package](https://www.npmjs.com/package/@nshiab/journalism-extras)

See
[CONTRIBUTING.md](https://github.com/nshiab/journalism-extras/blob/main/CONTRIBUTING.md)
for development commands.

Filesystem, encoding, timing, and ID utilities for journalism projects.

Install with `npm install @nshiab/journalism-extras`.
Requires Node.js 24.21.0 or later and ES modules.

## Example

```ts
import { getId } from "@nshiab/journalism-extras";

const id = getId(10);
console.log(id); // e.g., "a1B2c3D4e5"
```

## Extras

### DurationTracker

Defined in: [DurationTracker.ts:31](https://github.com/nshiab/journalism-extras/blob/v1.0.14/src/extras/DurationTracker.ts#L31)

A utility class for tracking the progress and estimating the remaining time of iterative processes. It calculates the average duration of completed iterations and uses this to project the time left for the remaining tasks. This is particularly useful for long-running operations where users need feedback on progress.

The tracker provides methods to mark the start of an iteration and to log the estimated remaining time. The log message can be customized with a prefix and suffix.

#### Example

```ts
// Basic usage: Tracking a loop with 100 iterations.
const totalItems = 100;
const tracker = new DurationTracker(totalItems, {
  prefix: "Processing... Estimated time remaining: ",
  suffix: " until completion."
});

for (let i = 0; i < totalItems; i++) {
  tracker.start();
  // Simulate some work
  await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
  tracker.log();
}
console.log("Processing complete!");
```

#### Param

**length**

The total number of iterations or items to process. This is used to calculate the remaining items.

#### Param

**options**

Optional settings for the tracker.

#### Param

**options.prefix**

A string to prepend to the logged remaining time message. Defaults to an empty string.

#### Param

**options.suffix**

A string to append to the logged remaining time message. Defaults to an empty string.

#### Constructors

##### Constructor

> **new DurationTracker**(`length`, `options?`): [`DurationTracker`](#durationtracker)

Defined in: [DurationTracker.ts:50](https://github.com/nshiab/journalism-extras/blob/v1.0.14/src/extras/DurationTracker.ts#L50)

Creates an instance of DurationTracker.

###### Parameters

###### length

`number`

The total number of iterations.

###### options?

Optional settings for the tracker.

###### prefix?

`string`

###### suffix?

`string`

###### Returns

[`DurationTracker`](#durationtracker)

#### Properties

##### length

> **length**: `number`

Defined in: [DurationTracker.ts:39](https://github.com/nshiab/journalism-extras/blob/v1.0.14/src/extras/DurationTracker.ts#L39)

The total number of iterations.

##### prefix

> **prefix**: `string`

Defined in: [DurationTracker.ts:41](https://github.com/nshiab/journalism-extras/blob/v1.0.14/src/extras/DurationTracker.ts#L41)

Optional prefix for the log message.

##### suffix

> **suffix**: `string`

Defined in: [DurationTracker.ts:43](https://github.com/nshiab/journalism-extras/blob/v1.0.14/src/extras/DurationTracker.ts#L43)

Option suffix for the log message.

#### Methods

##### log()

> **log**(): `void`

Defined in: [DurationTracker.ts:93](https://github.com/nshiab/journalism-extras/blob/v1.0.14/src/extras/DurationTracker.ts#L93)

Logs the estimated remaining time based on the average duration of previous iterations.

###### Returns

`void`

###### Example

```ts
const totalItems = 100;
const tracker = new DurationTracker(totalItems);
for (let i = 0; i < totalItems; i++) {
  tracker.start();
  // Simulate some work
  await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
  tracker.log(); // Log the estimated remaining time for each iteration
}
```

##### start()

> **start**(): `void`

Defined in: [DurationTracker.ts:74](https://github.com/nshiab/journalism-extras/blob/v1.0.14/src/extras/DurationTracker.ts#L74)

Starts the timer for the current iteration.

###### Returns

`void`

###### Example

```ts
const totalItems = 100;
const tracker = new DurationTracker(totalItems);
for (let i = 0; i < totalItems; i++) {
  tracker.start(); // Mark the start of each iteration
  // Simulate some work
  await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
  tracker.log();
}
```

***

### createDirectory()

> **createDirectory**(`path`): `void`

Defined in: [createDirectory.ts:25](https://github.com/nshiab/journalism-extras/blob/v1.0.14/src/extras/createDirectory.ts#L25)

Recursively creates a directory structure. This function is useful for ensuring that a path exists before writing a file to it.

The function will not throw an error if the directory already exists. It can also accept a full file path, in which case it will create all the parent directories, ignoring the filename portion.

#### Parameters

##### path

`string`

The path of the directory to create. This can be a path to a directory or a full path to a file.

#### Returns

`void`

#### Examples

```ts
// Create a simple directory
createDirectory("./output/data");
// This will create the 'output' and 'data' folders if they don't exist.
```

```ts
// Create a directory from a file path
createDirectory("./output/data/my-file.json");
// This will create the './output/data' directory structure. The 'my-file.json' part is ignored.
```

***

### getId()

> **getId**(`length?`): `string`

Defined in: [getId.ts:26](https://github.com/nshiab/journalism-extras/blob/v1.0.14/src/extras/getId.ts#L26)

Generates a unique ID string composed of letters and numbers, without spaces or special characters. By default, the ID has a length of 6 characters. While handy for general use, it is not cryptographically secure, meaning it should not be used for security-sensitive applications where true randomness and unpredictability are required.

The function ensures uniqueness by keeping track of previously generated IDs within the current session. If a collision occurs (which is highly unlikely for reasonable lengths), it will attempt to generate a new ID. For very small `length` values, repeated collisions might trigger a warning to suggest increasing the length to maintain uniqueness.

#### Parameters

##### length?

`number` = `6`

The desired length of the generated ID. Defaults to 6.

#### Returns

`string`

A unique string ID.

#### Examples

```ts
// Generate a default length ID (6 characters).
const id = getId();
console.log(id); // e.g., 'a1B2c3'
```

```ts
// Generate an ID with a specified length (e.g., 10 characters).
const customId = getId(10);
console.log(customId); // e.g., 'a1B2c3D4e5'
```

***

### reencode()

> **reencode**(`inputFilePath`, `outputFilePath`, `fromEncoding`, `toEncoding`, `options?`): `Promise`\<`void`\>

Defined in: [reencode.ts:36](https://github.com/nshiab/journalism-extras/blob/v1.0.14/src/extras/reencode.ts#L36)

Converts a file from one character encoding to another. This function is particularly optimized for handling large files.

Character encoding is crucial for ensuring that text data is displayed correctly across different systems and applications. This function helps resolve issues related to garbled text when files are created or read with different encoding standards.

#### Parameters

##### inputFilePath

`string`

The absolute path to the input file that needs to be re-encoded.

##### outputFilePath

`string`

The absolute path where the converted file will be saved.

##### fromEncoding

`string`

The character encoding of the input file (e.g., 'windows-1252', 'latin1', 'ISO-8859-1').

##### toEncoding

`string`

The desired character encoding for the output file (e.g., 'utf-8').

##### options?

Optional configuration settings for the re-encoding process.

###### addBOM?

`boolean`

If `true`, a Byte Order Mark (BOM) will be added to the output file if the `toEncoding` is UTF-8. A BOM can help some applications correctly identify the UTF-8 encoding. Defaults to `false`.

###### bufferSize?

`number`

The size of the read buffer in kilobytes (KB). A larger buffer can improve performance for very large files but consumes more memory. Defaults to `256` KB.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when the file has been successfully re-encoded and saved.

#### Examples

```ts
// Convert a CSV file from Windows-1252 to UTF-8 encoding.
await reencode('input.csv', 'output.csv', 'windows-1252', 'utf-8');
console.log("File re-encoded successfully.");
```

```ts
// Re-encode a large file with a larger buffer size and add a UTF-8 Byte Order Mark (BOM).
await reencode('large_input.csv', 'large_output.csv', 'latin1', 'utf-8', {
  bufferSize: 1024, // 1MB buffer
  addBOM: true,
});
console.log("Large file re-encoded with custom buffer and BOM.");
```

***

### removeDirectory()

> **removeDirectory**(`path`): `void`

Defined in: [removeDirectory.ts:25](https://github.com/nshiab/journalism-extras/blob/v1.0.14/src/extras/removeDirectory.ts#L25)

Removes a directory and all its contents recursively.

**Caution**: Use this function with care, as it permanently deletes files and directories without sending them to the recycle bin or trash. Ensure that the `path` provided is correct to avoid accidental data loss.

#### Parameters

##### path

`string`

The absolute or relative path to the directory to be removed.

#### Returns

`void`

`void`

#### Examples

```ts
// Removes the directory and all its contents recursively.
removeDirectory("./data/temp");
console.log("Directory removed successfully.");
```

```ts
// Attempting to remove a directory that does not exist will not throw an error due to `force: true`.
removeDirectory("./non-existent-folder");
console.log("Attempted to remove non-existent folder (no error thrown).");
```

***

### sleep()

> **sleep**(`ms`, `options?`): `Promise`\<`void`\>

Defined in: [sleep.ts:46](https://github.com/nshiab/journalism-extras/blob/v1.0.14/src/extras/sleep.ts#L46)

Pauses the execution of an asynchronous function for a specified duration. This utility is useful for introducing delays in workflows, throttling requests, or simulating real-world latencies.

It can also adjust the pause duration by subtracting any time already elapsed since a given start point, ensuring more precise delays. This is particularly useful for respecting API rate limits, ensuring that the total time spent between requests meets a minimum threshold without over-waiting if the preceding operations took some time. If the elapsed time is greater than or equal to `ms`, the function will resolve immediately without pausing.

#### Parameters

##### ms

`number`

The number of milliseconds to pause execution for. This is the target duration of the sleep.

##### options?

Optional parameters to customize the sleep behavior.

###### log?

`boolean`

If `true`, the function will log messages to the console indicating the sleep duration or if no sleep was needed. Defaults to `false`.

###### start?

`Date`

A `Date` object representing a starting timestamp. If provided, the function will subtract the time elapsed since this `start` time from the `ms` duration. This is particularly useful for respecting API rate limits.

#### Returns

`Promise`\<`void`\>

A Promise that resolves after the specified (or adjusted) duration has passed.

#### Examples

```ts
// Pause execution for 1 second.
await sleep(1000);
console.log("1 second has passed.");
```

```ts
// Pause execution for 1 second, but subtract any time already elapsed since `start`.
const start = new Date();
// Simulate a task that takes some time (e.g., 200ms)
await new Promise(resolve => setTimeout(resolve, 200));
await sleep(1000, { start }); // This will pause for approximately 800ms
console.log("Execution resumed after approximately 1 second from start.");
```

```ts
// If the elapsed time already exceeds the requested sleep duration, no actual sleep occurs.
const startTime = new Date();
// Simulate a long-running task (e.g., 150ms)
await new Promise(resolve => setTimeout(resolve, 150));
await sleep(100, { start: startTime, log: true });
// Expected console output: "No need to sleep, already took 150 ms." (or similar)
```

```ts
// Pause execution for 2 seconds and log the sleep duration.
await sleep(2000, { log: true });
// Expected console output: "Sleeping for 2 sec, 0 ms..." (or similar)
```

***

### unzip()

> **unzip**(`zippedFile`, `output`, `options?`): `void`

Defined in: [unzip.ts:26](https://github.com/nshiab/journalism-extras/blob/v1.0.14/src/extras/unzip.ts#L26)

Unzips a given zipped file to a specified output directory. This function provides a convenient way to extract compressed archives, commonly used for distributing data or software. It offers an option to delete the original zipped file after successful extraction, which is useful for cleanup operations.

#### Parameters

##### zippedFile

`string`

The absolute or relative path to the zipped file (`.zip`) to be extracted.

##### output

`string`

The absolute or relative path to the directory where the contents of the zipped file will be extracted. If the directory does not exist, it will be created.

##### options?

Optional settings for the unzip operation.

###### deleteZippedFile?

`boolean`

If `true`, the original zipped file will be deleted from the filesystem after its contents have been successfully extracted. Defaults to `false`.

#### Returns

`void`

`void`

#### Examples

```ts
// Unzip a file to a specified output directory.
unzip('path/to/file.zip', 'path/to/output');
console.log("File unzipped successfully.");
```

```ts
// Unzip a file and then delete the original zipped file.
unzip('path/to/another-file.zip', 'path/to/another-output', { deleteZippedFile: true });
console.log("File unzipped and original zipped file deleted.");
```

***

### zip()

> **zip**(`files`, `zipFile`): `void`

Defined in: [zip.ts:24](https://github.com/nshiab/journalism-extras/blob/v1.0.14/src/extras/zip.ts#L24)

Compresses one or more files or an entire folder into a single zip archive. This function is useful for bundling multiple assets, preparing data for transfer, or creating backups.

You can specify individual files to be added to the archive, or provide a path to a directory, in which case all its contents will be compressed. The function automatically creates the necessary directory structure for the output zip file if it doesn't already exist.

#### Parameters

##### files

`string` \| `string`[]

A string representing the path to a folder, or an array of strings representing paths to individual files. These are the items to be included in the zip archive.

##### zipFile

`string`

The absolute or relative path, including the filename and `.zip` extension, where the created zip archive will be saved (e.g., `"./archives/my-data.zip"`).

#### Returns

`void`

`void`

#### Example

```ts
// Compressing multiple files into a zip archive.
zip(['file1.txt', 'file2.txt'], 'archive.zip');
console.log("Files zipped successfully.");

// Compressing a folder into a zip archive.
zip('path/to/folder', 'folder-archive.zip');
console.log("Folder zipped successfully.");
```
