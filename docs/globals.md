[**Journalism Extras v1.0.15**](index.md)

***

# Journalism Extras v1.0.15

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

- [DurationTracker](classes/DurationTracker.md)
- [createDirectory](functions/createDirectory.md)
- [getId](functions/getId.md)
- [reencode](functions/reencode.md)
- [removeDirectory](functions/removeDirectory.md)
- [sleep](functions/sleep.md)
- [unzip](functions/unzip.md)
- [zip](functions/zip.md)
