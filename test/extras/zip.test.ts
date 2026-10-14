import { afterAll, assert, test } from "vite-plus/test";
import AdmZip from "adm-zip";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import zip from "../../src/extras/zip.ts";

const directory = mkdtempSync(join(tmpdir(), "journalism-extras-"));
afterAll(() => rmSync(directory, { recursive: true, force: true }));

test("should zip multiple files together", () => {
  const output = `${directory}/data.zip`;
  zip(["test/data/data.csv", "test/data/data.json"], output);
  const archive = new AdmZip(output);
  assert.deepStrictEqual(
    archive
      .getEntries()
      .map((entry) => entry.entryName)
      .sort(),
    ["data.csv", "data.json"],
  );
  for (const entry of archive.getEntries()) {
    assert.deepStrictEqual(entry.getData(), readFileSync(`test/data/${entry.entryName}`));
  }
});

test("should zip an entire folder together", () => {
  const output = `${directory}/dataFolder.zip`;
  zip("test/data/", output);
  const archive = new AdmZip(output);
  assert.deepStrictEqual(
    archive
      .getEntries()
      .map((entry) => entry.entryName)
      .sort(),
    ["data.csv", "data.json", "test.zip"],
  );
  for (const entry of archive.getEntries()) {
    assert.deepStrictEqual(entry.getData(), readFileSync(`test/data/${entry.entryName}`));
  }
});

test("should zip an entire folder together and create the path if it doesn't exist", () => {
  const output = `${directory}/zipFolder/dataFolder.zip`;
  zip("test/data/", output);
  const archive = new AdmZip(output);
  assert.deepStrictEqual(
    archive
      .getEntries()
      .map((entry) => entry.entryName)
      .sort(),
    ["data.csv", "data.json", "test.zip"],
  );
});
