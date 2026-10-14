import { tmpdir } from "node:os";
import { join } from "node:path";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { afterAll, assert, test } from "vite-plus/test";
import createDirectory from "../../src/extras/createDirectory.ts";
import removeDirectory from "../../src/extras/removeDirectory.ts";

const directory = mkdtempSync(join(tmpdir(), "journalism-extras-"));
afterAll(() => rmSync(directory, { recursive: true, force: true }));

const outputPath = `${directory}/folderToRemove`;
const outputPathRecursive = `${directory}/folderToRemove/subfolder/subsubfolder`;
const outputPathHidden = `${directory}/folderToRemove/differentSubfolder/.hiddenFolder/`;

test("should remove a folder that exists", () => {
  // First create the folder
  createDirectory(outputPath);
  assert.deepStrictEqual(existsSync(outputPath), true);

  // Then remove it
  removeDirectory(outputPath);
  assert.deepStrictEqual(existsSync(outputPath), false);
});

test("should not throw an error if the folder doesn't exist", () => {
  // Ensure folder doesn't exist first
  removeDirectory(outputPath);
  assert.deepStrictEqual(existsSync(outputPath), false);

  // Try to remove again - should not throw
  removeDirectory(outputPath);
  assert.deepStrictEqual(existsSync(outputPath), false);
});

test("should not throw an error if the path has / at the end", () => {
  // Create and then remove with trailing slash
  createDirectory(outputPath);
  removeDirectory(outputPath + "/");
  assert.deepStrictEqual(existsSync(outputPath), false);
});

test("should remove folders recursively", () => {
  // Create nested folders
  createDirectory(outputPathRecursive);
  assert.deepStrictEqual(existsSync(outputPathRecursive), true);

  // Remove from the top level
  removeDirectory(outputPath);
  assert.deepStrictEqual(existsSync(outputPath), false);
  assert.deepStrictEqual(existsSync(outputPathRecursive), false);
});

test("should remove folders recursively even if the path contains hidden folders", () => {
  // Create hidden folder structure
  createDirectory(outputPathHidden);
  assert.deepStrictEqual(existsSync(outputPathHidden), true);

  // Remove it
  removeDirectory(outputPath);
  assert.deepStrictEqual(existsSync(outputPathHidden), false);
  assert.deepStrictEqual(existsSync(outputPath), false);
});

test("should not throw an error when trying to remove a non-existent file", () => {
  // This should not throw an error due to force: true
  removeDirectory(`${directory}/nonexistent.csv`);
  // No assertion needed - just ensuring no error is thrown
});
