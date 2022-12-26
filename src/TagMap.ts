import { loadDocument } from "./Document";
import { MarkdownTags, SerializedTagMap } from "./MarkdownTags";
import { ReplaceItem } from "./ReplaceItem";
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
