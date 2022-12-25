import * as fs from "fs";
export async function LoadDocument(doc) {
    return await fs.promises.readFile(doc, "utf8");
}
export async function SaveDocument(doc, content) {
    await fs.promises.writeFile(doc, content, "utf8");
}
