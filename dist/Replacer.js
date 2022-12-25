import path from "path";
import { LoadDocument, SaveDocument } from "./Document";
export class Replacer {
    constructor(tags, cwd) {
        this.cwd = cwd;
        this.tags = [];
        tags.forEach((doc, tag) => {
            this.tags.push({
                tag,
                doc,
                search: new RegExp(`[\n\r\t ,.!?](${tag})[$\t \r\n,.!?]`, "gim"),
            });
        });
    }
    replace(text, currentDoc) {
        this.tags.forEach((item) => {
            text = text.replace(item.search, (match) => {
                const url = path.relative(item.doc, currentDoc).replace(/\\/gim, "/");
                const newText = `[${match}](${url})`;
                return newText;
            });
        });
        return text;
    }
    async replaceDocuments(files) {
        for (const file of files) {
            const content = await LoadDocument(file);
            const newContent = this.replace(content, file);
            if (content !== newContent) {
                console.info("Saving", file);
                await SaveDocument(file, newContent);
            }
        }
    }
}
