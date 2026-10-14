import { tmpdir } from "node:os";
import { join } from "node:path";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { afterAll, assert, test } from "vite-plus/test";
import createDirectory from "../../src/extras/createDirectory.ts";

const directory = mkdtempSync(join(tmpdir(), "journalism-extras-"));
afterAll(() => rmSync(directory, { recursive: true, force: true }));

const outputPath = `${directory}/folder`;
const outputPathRecursive = `${directory}/folder/subfolder/subsubfolder`;
const outputPathFile = `${directory}/folder/differentSubfolder/text.csv`;
const outputPathWithoutFile = `${directory}/folder/differentSubfolder/`;
const outputPathHidden = `${directory}/folder/differentSubfolder/.hiddenFolder/`;

test("should create a folder that doesn't exist", () => {
  createDirectory(outputPath);
  assert.deepStrictEqual(existsSync(outputPath), true);
});
test("should not throw an error if the folder already exists", () => {
  createDirectory(outputPath);
  assert.deepStrictEqual(existsSync(outputPath), true);
});
test("should not throw an error if the path has / at the end", () => {
  createDirectory(outputPath + "/");
  assert.deepStrictEqual(existsSync(outputPath), true);
});
test("should create folders recursively", () => {
  createDirectory(outputPathRecursive);
  assert.deepStrictEqual(existsSync(outputPathRecursive), true);
});
test("should create folders recursively even if the path directs to a file that doesn't exist", () => {
  createDirectory(outputPathFile);
  const result = {
    file: existsSync(outputPathFile),
    folder: existsSync(outputPathWithoutFile),
  };
  assert.deepStrictEqual(result, { file: false, folder: true });
});
test("should create folders recursively even if the path contains hidden folders", () => {
  createDirectory(outputPathHidden);
  assert.deepStrictEqual(existsSync(outputPathHidden), true);
});
test("should do nothing if the path is just a file folders", () => {
  const filePath = `${directory}/data.csv`;
  createDirectory(filePath);
  assert.deepStrictEqual(existsSync(filePath), false);
});
