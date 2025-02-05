import { isInLink } from "./markdown";
import { loadDocument, saveDocument } from "./document";
import { TagMap } from "./tag-map";
import path from "path";

export class Replacer {
  private tags: TagMap;

  constructor(tags: TagMap) {
    this.tags = tags;
  }

  public async replaceDocuments(files: string[]): Promise<void> {
    await Promise.all(files.map((file) => this.replaceDocument(file)));
  }

  public async replaceDocument(file: string): Promise<void> {
    const content = await loadDocument(file);
    const newContent = this.replace(content, file);

    if (content !== newContent) {
      console.info("Saving", file);
      return saveDocument(file, newContent);
    }
  }

  public replace(text: string, currentDoc: string): string {
    const lines = text.split(/\n/);
    const max = lines.length;

    this.tags.forEach((item) => {
      let { tag, url, tagSearch, search } = item;
      if (url === currentDoc) return;
      const dir = path.resolve(currentDoc, "..");

      if (!url.startsWith("http")) {
        url = path.relative(dir, url).replace(/\\/gim, "/");
        url = encodeURI(url);
      }

      for (let i = 0; i < max; i++) {
        let line = lines[i];

        // Skip headers
        if (line.startsWith("#")) continue;
        //If its pure html, skip it
        if (line.match(/<[^>]*>/gim)) continue;
        // Skip code blocks
        if (line.startsWith("```")) {
          //Find end of code block
          line = lines[++i];
          while (i < max && !line.startsWith("```")) {
            i++;
            line = lines[i];
          }
          continue;
        }

        lines[i] = line.replace(search, (match: string, tag, offset, original) => {
          if (isInLink(original, offset)) return match;
          const newText = `[${tag}](${url})`;

          return match.replace(tagSearch, newText);
        });
      }
    });

    return lines.join("\n");
  }
}
