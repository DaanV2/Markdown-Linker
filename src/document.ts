import * as fs from "fs";

export async function loadDocument(doc: string): Promise<string> {
  return fs.promises.readFile(doc, "utf8");
}

export async function saveDocument(doc: string, content: string): Promise<void> {
  return fs.promises.writeFile(doc, content, "utf8");
}
