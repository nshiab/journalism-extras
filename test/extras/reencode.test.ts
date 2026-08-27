import { assertEquals, assertExists } from "jsr:@std/assert";
import reencode from "../../src/extras/reencode.ts";

Deno.test("should reencode from utf-8 to windows-1252", async () => {
  const inputPath = "test/data/data.csv";
  const outputPath = "test/output/data_windows-1252.csv";

  await reencode(inputPath, outputPath, "utf-8", "windows-1252");

  // Verify output file was created
  const fileInfo = await Deno.stat(outputPath);
  assertExists(fileInfo);

  // Read and verify content
  const originalContent = await Deno.readTextFile(inputPath);
  const outputBytes = await Deno.readFile(outputPath);
  const decoder = new TextDecoder("windows-1252");
  const decodedContent = decoder.decode(outputBytes);

  assertEquals(decodedContent, originalContent);
});

Deno.test("should reencode from windows-1252 to utf-8", async () => {
  const inputPath = "test/output/data_windows-1252.csv";
  const outputPath = "test/output/data_utf-8.csv";

  await reencode(inputPath, outputPath, "windows-1252", "utf-8");

  // Verify output file was created
  const fileInfo = await Deno.stat(outputPath);
  assertExists(fileInfo);

  // Read and verify content matches original
  const originalContent = await Deno.readTextFile("test/data/data.csv");
  const outputContent = await Deno.readTextFile(outputPath);

  assertEquals(outputContent, originalContent);
});

Deno.test("should add BOM when encoding to utf-8 with addBOM option", async () => {
  const inputPath = "test/data/data.csv";
  const outputPath = "test/output/data_with_bom.csv";

  await reencode(inputPath, outputPath, "utf-8", "utf-8", { addBOM: true });

  // Read raw bytes and check for BOM
  const outputBytes = await Deno.readFile(outputPath);
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);

  assertEquals(outputBytes[0], bom[0]);
  assertEquals(outputBytes[1], bom[1]);
  assertEquals(outputBytes[2], bom[2]);

  // Verify content is still correct (excluding BOM)
  const decoder = new TextDecoder("utf-8");
  const content = decoder.decode(outputBytes);
  const originalContent = await Deno.readTextFile(inputPath);

  // Remove BOM from comparison
  assertEquals(content.replace(/^\uFEFF/, ""), originalContent);
});

Deno.test("should preserve multibyte characters split across chunks", async () => {
  const directory = await Deno.makeTempDir();
  const inputPath = `${directory}/input.txt`;
  const outputPath = `${directory}/output.txt`;

  try {
    const content = "éclair 🍰";
    await Deno.writeTextFile(inputPath, content);
    await reencode(inputPath, outputPath, "utf-8", "utf-8", {
      bufferSize: 1 / 1024,
    });

    assertEquals(await Deno.readTextFile(outputPath), content);
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});

Deno.test("should encode native legacy encodings", async () => {
  const directory = await Deno.makeTempDir();
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
      await Deno.writeTextFile(inputPath, content);
      await reencode(inputPath, outputPath, "utf-8", encoding);

      const output = await Deno.readFile(outputPath);
      assertEquals(new TextDecoder(encoding).decode(output), content);
    }
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});
