import FastGlob from "fast-glob";
import { LoadDocument } from "./Document";
import { MarkdownTags } from "./MarkdownTags";
import { ReplaceItem } from "./ReplaceItem";

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
      const content = await LoadDocument(doc);
      return this.scrape(content, doc);
    } catch (err) {
      console.error(err);
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

  public async LoadMap(filepath: string): Promise<void> {
    try {
      console.log("Loading map", filepath);
      const content = await LoadDocument(filepath);
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
      console.log("Error loading map", err);
    }
  }

  public async LoadMaps(dir: string): Promise<void> {
    const files = FastGlob.sync(["**/.tags/*.json"], { cwd: dir, absolute: true });

    for (const file of files) {
      await this.LoadMap(file);
    }
  }
}

interface SerializedTagMap {
  tag: string;
  url: string;
  search?: string;
}

namespace SerializedTagMap {
  export function is(value: any): value is SerializedTagMap {
    return typeof value === "object" && typeof value.tag === "string";
  }
}
