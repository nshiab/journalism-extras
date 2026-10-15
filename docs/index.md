**Journalism Extras v1.0.12**

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

Requires **Node.js 24.21.0 or later**. Use `import`
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
