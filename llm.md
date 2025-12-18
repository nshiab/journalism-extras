# The Journalism library

To install the library with Deno, use:

```bash
deno add jsr:@nshiab/journalism-extras
```

To install the library with Node.js, use:

```bash
npx jsr add @nshiab/journalism-extras
```

To import a function, use:

```ts
import { functionName } from "@nshiab/journalism-extras";
```

## createDirectory

Recursively creates a directory structure. This function is useful for ensuring
that a path exists before writing a file to it.

The function will not throw an error if the directory already exists. It can
also accept a full file path, in which case it will create all the parent
directories, ignoring the filename portion.

### Signature

```typescript
function createDirectory(path: string): void;
```

### Parameters

- **`path`**: The path of the directory to create. This can be a path to a
  directory or a full path to a file.

### Examples

```ts
// Create a simple directory
createDirectory("./output/data");
// This will create the 'output' and 'data' folders if they don't exist.
```

````ts
// Create a directory from a file path
createDirectory("./output/data/my-file.json");
// This will create the './output/data' directory structure. The 'my-file.json' part is ignored.
``` @category Other



## class DurationTracker

A utility class for tracking the progress and estimating the remaining time of iterative processes. It calculates the average duration of completed iterations and uses this to project the time left for the remaining tasks. This is particularly useful for long-running operations where users need feedback on progress.

The tracker provides methods to mark the start of an iteration and to log the estimated remaining time. The log message can be customized with a prefix and suffix.

### Constructor

Creates an instance of DurationTracker.

#### Parameters

* **`length`**: The total number of iterations.
* **`options`**: Optional settings for the tracker.

### Methods

#### `start`

Starts the timer for the current iteration.

##### Signature
```typescript
start(): void;
````

##### Examples

```ts
const totalItems = 100;
const tracker = new DurationTracker(totalItems);
for (let i = 0; i < totalItems; i++) {
  tracker.start(); // Mark the start of each iteration
  // Simulate some work
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
  tracker.log();
}
```

#### `log`

Logs the estimated remaining time based on the average duration of previous
iterations.

##### Signature

```typescript
log(): void;
```

##### Examples

```ts
const totalItems = 100;
const tracker = new DurationTracker(totalItems);
for (let i = 0; i < totalItems; i++) {
  tracker.start();
  // Simulate some work
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
  tracker.log(); // Log the estimated remaining time for each iteration
}
```

### Examples

```ts
// Basic usage: Tracking a loop with 100 iterations.
const totalItems = 100;
const tracker = new DurationTracker(totalItems, {
  prefix: "Processing... Estimated time remaining: ",
  suffix: " until completion.",
});

for (let i = 0; i < totalItems; i++) {
  tracker.start();
  // Simulate some work
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
  tracker.log();
}
console.log("Processing complete!");
```

## getId

Generates a unique ID string composed of letters and numbers, without spaces or
special characters. By default, the ID has a length of 6 characters. While handy
for general use, it is not cryptographically secure, meaning it should not be
used for security-sensitive applications where true randomness and
unpredictability are required.

The function ensures uniqueness by keeping track of previously generated IDs
within the current session. If a collision occurs (which is highly unlikely for
reasonable lengths), it will attempt to generate a new ID. For very small
`length` values, repeated collisions might trigger a warning to suggest
increasing the length to maintain uniqueness.

### Signature

```typescript
function getId(length?: number): string;
```

### Parameters

- **`length`**: - The desired length of the generated ID. Defaults to 6.

### Returns

A unique string ID.

### Examples

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

## removeDirectory

Removes a directory and all its contents recursively.

**Caution**: Use this function with care, as it permanently deletes files and
directories without sending them to the recycle bin or trash. Ensure that the
`path` provided is correct to avoid accidental data loss.

### Signature

```typescript
function removeDirectory(path: string): void;
```

### Parameters

- **`path`**: - The absolute or relative path to the directory to be removed.

### Returns

`void`

### Examples

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

## sleep

Pauses the execution of an asynchronous function for a specified duration. This
utility is useful for introducing delays in workflows, throttling requests, or
simulating real-world latencies.

It can also adjust the pause duration by subtracting any time already elapsed
since a given start point, ensuring more precise delays. This is particularly
useful for respecting API rate limits, ensuring that the total time spent
between requests meets a minimum threshold without over-waiting if the preceding
operations took some time. If the elapsed time is greater than or equal to `ms`,
the function will resolve immediately without pausing.

### Signature

```typescript
function sleep(
  ms: number,
  options?: { start?: Date; log?: boolean },
): Promise<void>;
```

### Parameters

- **`ms`**: - The number of milliseconds to pause execution for. This is the
  target duration of the sleep.
- **`options`**: - Optional parameters to customize the sleep behavior.
- **`options.start`**: - A `Date` object representing a starting timestamp. If
  provided, the function will subtract the time elapsed since this `start` time
  from the `ms` duration. This is particularly useful for respecting API rate
  limits.
- **`options.log`**: - If `true`, the function will log messages to the console
  indicating the sleep duration or if no sleep was needed. Defaults to `false`.

### Returns

A Promise that resolves after the specified (or adjusted) duration has passed.

### Examples

```ts
// Pause execution for 1 second.
await sleep(1000);
console.log("1 second has passed.");
```

```ts
// Pause execution for 1 second, but subtract any time already elapsed since `start`.
const start = new Date();
// Simulate a task that takes some time (e.g., 200ms)
await new Promise((resolve) => setTimeout(resolve, 200));
await sleep(1000, { start }); // This will pause for approximately 800ms
console.log("Execution resumed after approximately 1 second from start.");
```

```ts
// If the elapsed time already exceeds the requested sleep duration, no actual sleep occurs.
const startTime = new Date();
// Simulate a long-running task (e.g., 150ms)
await new Promise((resolve) => setTimeout(resolve, 150));
await sleep(100, { start: startTime, log: true });
// Expected console output: "No need to sleep, already took 150 ms." (or similar)
```

```ts
// Pause execution for 2 seconds and log the sleep duration.
await sleep(2000, { log: true });
// Expected console output: "Sleeping for 2 sec, 0 ms..." (or similar)
```

## unzip

Unzips a given zipped file to a specified output directory. This function
provides a convenient way to extract compressed archives, commonly used for
distributing data or software. It offers an option to delete the original zipped
file after successful extraction, which is useful for cleanup operations.

### Signature

```typescript
function unzip(
  zippedFile: string,
  output: string,
  options?: { deleteZippedFile?: boolean },
): void;
```

### Parameters

- **`zippedFile`**: - The absolute or relative path to the zipped file (`.zip`)
  to be extracted.
- **`output`**: - The absolute or relative path to the directory where the
  contents of the zipped file will be extracted. If the directory does not
  exist, it will be created.
- **`options`**: - Optional settings for the unzip operation.
- **`options.deleteZippedFile`**: - If `true`, the original zipped file will be
  deleted from the filesystem after its contents have been successfully
  extracted. Defaults to `false`.

### Returns

`void`

### Examples

```ts
// Unzip a file to a specified output directory.
unzip("path/to/file.zip", "path/to/output");
console.log("File unzipped successfully.");
```

```ts
// Unzip a file and then delete the original zipped file.
unzip("path/to/another-file.zip", "path/to/another-output", {
  deleteZippedFile: true,
});
console.log("File unzipped and original zipped file deleted.");
```

## zip

Compresses one or more files or an entire folder into a single zip archive. This
function is useful for bundling multiple assets, preparing data for transfer, or
creating backups.

You can specify individual files to be added to the archive, or provide a path
to a directory, in which case all its contents will be compressed. The function
automatically creates the necessary directory structure for the output zip file
if it doesn't already exist.

### Signature

```typescript
function zip(files: string | string[], zipFile: string): void;
```

### Parameters

- **`files`**: - A string representing the path to a folder, or an array of
  strings representing paths to individual files. These are the items to be
  included in the zip archive.
- **`zipFile`**: - The absolute or relative path, including the filename and
  `.zip` extension, where the created zip archive will be saved (e.g.,
  `"./archives/my-data.zip"`).

### Returns

`void`

### Examples

```ts
// Compressing multiple files into a zip archive.
zip(["file1.txt", "file2.txt"], "archive.zip");
console.log("Files zipped successfully.");

// Compressing a folder into a zip archive.
zip("path/to/folder", "folder-archive.zip");
console.log("Folder zipped successfully.");
```
