import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, assert, test } from "vite-plus/test";
import reencode from "../../src/extras/reencode.ts";

const outputDirectory = await mkdtemp(join(tmpdir(), "journalism-extras-"));
afterAll(() => rm(outputDirectory, { recursive: true, force: true }));

test("should reencode from utf-8 to windows-1252", async () => {
  const inputPath = "test/data/data.csv";
  const outputPath = `${outputDirectory}/data_windows-1252.csv`;

  await reencode(inputPath, outputPath, "utf-8", "windows-1252");

  // Verify output file was created
  const fileInfo = await stat(outputPath);
  assert.isDefined(fileInfo);

  // Read and verify content
  const originalContent = await readFile(inputPath, "utf8");
  const outputBytes = await readFile(outputPath);
  const decoder = new TextDecoder("windows-1252");
  const decodedContent = decoder.decode(outputBytes);

  assert.deepStrictEqual(decodedContent, originalContent);
});

test("should reencode from windows-1252 to utf-8", async () => {
  const inputPath = `${outputDirectory}/data_windows-1252.csv`;
  const outputPath = `${outputDirectory}/data_utf-8.csv`;

  await reencode("test/data/data.csv", inputPath, "utf-8", "windows-1252");
  await reencode(inputPath, outputPath, "windows-1252", "utf-8");

  // Verify output file was created
  const fileInfo = await stat(outputPath);
  assert.isDefined(fileInfo);

  // Read and verify content matches original
  const originalContent = await readFile("test/data/data.csv", "utf8");
  const outputContent = await readFile(outputPath, "utf8");

  assert.deepStrictEqual(outputContent, originalContent);
});

test("should add BOM when encoding to utf-8 with addBOM option", async () => {
  const inputPath = "test/data/data.csv";
  const outputPath = `${outputDirectory}/data_with_bom.csv`;

  await reencode(inputPath, outputPath, "utf-8", "utf-8", { addBOM: true });

  // Read raw bytes and check for BOM
  const outputBytes = await readFile(outputPath);
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);

  assert.deepStrictEqual(outputBytes[0], bom[0]);
  assert.deepStrictEqual(outputBytes[1], bom[1]);
  assert.deepStrictEqual(outputBytes[2], bom[2]);

  // Verify content is still correct (excluding BOM)
  const decoder = new TextDecoder("utf-8");
  const content = decoder.decode(outputBytes);
  const originalContent = await readFile(inputPath, "utf8");

  // Remove BOM from comparison
  assert.deepStrictEqual(content.replace(/^\uFEFF/, ""), originalContent);
});

test("should preserve multibyte characters split across chunks", async () => {
  const directory = await mkdtemp(join(tmpdir(), "journalism-extras-"));
  const inputPath = `${directory}/input.txt`;
  const outputPath = `${directory}/output.txt`;

  try {
    const content = "éclair 🍰";
    await writeFile(inputPath, content);
    await reencode(inputPath, outputPath, "utf-8", "utf-8", {
      bufferSize: 1 / 1024,
    });

    assert.deepStrictEqual(await readFile(outputPath, "utf8"), content);
  } finally {
    await rm(directory, { recursive: true });
  }
});

test("should encode native legacy encodings", async () => {
  const directory = await mkdtemp(join(tmpdir(), "journalism-extras-"));
  const inputPath = `${directory}/input.txt`;

  const cases = [
    ["windows-1252", "Québec – €"],
    ["iso-8859-2", "Zażółć"],
    ["koi8-r", "Привет"],
    ["gb2312", "你好"],
    ["big5", "你好"],
    ["shift_jis", "こんにちは"],
    ["euc-jp", "こんにちは"],
    ["euc-kr", "안녕하세요"],
    ["gb18030", "你好 😀"],
  ] as const;

  try {
    for (const [encoding, content] of cases) {
      const outputPath = `${directory}/${encoding}.txt`;
      await writeFile(inputPath, content);
      await reencode(inputPath, outputPath, "utf-8", encoding);

      const output = await readFile(outputPath);
      assert.deepStrictEqual(new TextDecoder(encoding).decode(output), content);
    }
  } finally {
    await rm(directory, { recursive: true });
  }
});
