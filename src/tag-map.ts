import { loadDocument } from "./document";
import { MarkdownTags, SerializedTagMap } from "./markdown-tags";
import { ReplaceItem } from "./replace-item";
import * as core from "@actions/core";
import FastGlob from "fast-glob";

export class TagMap {
  private _data: ReplaceItem[];

  constructor() {
    this._data = [];
  }

  public get count() {
    return this._data.length;
  }

  public add(tags: string | Array<string>, uri: string, search?: string): this {
    if (!Array.isArray(tags)) tags = [tags];

    tags.forEach((tag) => {
      this._data.push({
        tag: tag,
        url: uri,
        search: new RegExp(search || `(?:^|(?:[^#]|^)[\\s,.!?])(${tag})(?:$|[\\s,.!?])`, "gmi"),
        tagSearch: new RegExp(tag, "gmi"),
      });
    });

    return this;
  }

  public rewriteLinks(content: string): string {
    const linkDefinitions: Record<string, string> = {};
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    
    // Collect existing link definitions
    const existingLinkDefs = content.match(/^\[([^\]]+)\]:\s*(.+)$/gm) || [];
    existingLinkDefs.forEach((def) => {
      const parts = def.match(/^\[([^\]]+)\]:\s*(.+)$/);
      if (parts) {
        linkDefinitions[parts[1].toLowerCase()] = parts[2];
      }
    });
  
    // Rewrite inline links to reference links
    content = content.replace(linkRegex, (_fullMatch, text, url) => {
      let ref = Object.keys(linkDefinitions).find((key) => linkDefinitions[key] === url);
      if (!ref) {
        ref = `${text}`;
        linkDefinitions[ref] = url;
      }
      return `[${text}]`;
    });
  
    // Append updated link definitions to the bottom
    const linkDefs = Object.entries(linkDefinitions)
      .map(([key, url]) => `[${key}]: ${url}`)
      .join("\n");
  
    return `${content}\n\n${linkDefs}`;
  }

  public has(tag: string): boolean {
    return this._data.some((item) => item.tag === tag);
  }

  public forEach(callbackfn: (item: ReplaceItem) => void, thisArg?: any) {
    return this._data.forEach(callbackfn, thisArg ?? this);
  }

  public async scrapeDoc(doc: string): Promise<void> {
    try {
      const content = await loadDocument(doc);
      return this.scrape(content, doc);
    } catch (err) {
      console.warn(`Error scraping ${doc}`, err);
      core.notice(`Error scraping ${doc}\n${err}`, { file: doc });
    }
  }

  public scrape(content: string, doc: string) {
    const match = content.match(/<!--{.*}-->/gim);

    if (match) {
      for (const item of match) {
        const data = item.replace(/<!--|-->/gim, "");

        if (data.startsWith("{") && data.endsWith("}")) {
          const json = JSON.parse(data);

          if (MarkdownTags.is(json)) {
            this.add(json.tags, doc);
          }
        }
      }
    }
  }

  public async loadMap(filepath: string): Promise<void> {
    try {
      console.log("Loading map", filepath);
      const content = await loadDocument(filepath);
      const json = JSON.parse(content);

      //Convert array of tags to a map
      if (Array.isArray(json)) {
        json.forEach((item) => {
          if (SerializedTagMap.is(item)) {
            this.add(item.tag, item.url, item.search);
          }
        });
      }
    } catch (err) {
      console.warn("Error loading tag map", err);
      core.notice(`Error loading tag map ${filepath}\n${err}`, { file: filepath });
    }
  }

  public async loadMaps(dir: string): Promise<void> {
    const files = FastGlob.sync(["**/.tags/*.json"], { cwd: dir, absolute: true });

    return Promise.all(files.map((file) => this.loadMap(file))).then(() => {});
  }
}
