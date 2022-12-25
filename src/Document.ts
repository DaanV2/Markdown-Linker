import * as fs from "fs";

export async function LoadDocument(doc: string): Promise<string> {
  return fs.promises.readFile(doc, "utf8");
}

export async function SaveDocument(doc: string, content: string): Promise<void> {
  return fs.promises.writeFile(doc, content, "utf8");
}
