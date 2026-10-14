import { afterAll, assert, test } from "vite-plus/test";
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import AdmZip from "adm-zip";
import unzip from "../../src/extras/unzip.ts";

const directory = mkdtempSync(join(tmpdir(), "journalism-extras-"));
afterAll(() => rmSync(directory, { recursive: true, force: true }));

function assertExtracted(output: string) {
  const archive = new AdmZip("test/data/test.zip");
  for (const entry of archive.getEntries()) {
    const path = join(output, entry.entryName);
    assert.isTrue(existsSync(path));
    if (!entry.isDirectory) assert.deepStrictEqual(readFileSync(path), entry.getData());
  }
}

test("should unzip and put files in a folder", () => {
  const output = `${directory}/extracted`;
  unzip("test/data/test.zip", output);
  assertExtracted(output);
  assert.isTrue(existsSync("test/data/test.zip"));
});

test("should unzip, put files in a folder and remove original file", () => {
  const copy = `${directory}/testCopy.zip`;
  const output = `${directory}/extracted-and-deleted`;
  copyFileSync("test/data/test.zip", copy);
  unzip(copy, output, { deleteZippedFile: true });
  assertExtracted(output);
  assert.isFalse(existsSync(copy));
});
