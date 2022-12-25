import { LoadDocument } from "./Document";
export class TagMap {
    constructor() {
        this._data = new Map();
    }
    get count() {
        return this._data.size;
    }
    get(key) {
        return this._data.get(key);
    }
    has(key) {
        return this._data.has(key);
    }
    set(tags, uri) {
        if (!Array.isArray(tags))
            tags = [tags];
        tags.forEach((tag) => {
            this._data.set(tag, uri);
        });
    }
    forEach(callbackfn, thisArg) {
        return this._data.forEach(callbackfn, thisArg !== null && thisArg !== void 0 ? thisArg : this);
    }
    async scrape(doc) {
        const content = await LoadDocument(doc);
        const match = content.match(/<!--{.*}-->/gim);
        if (match) {
            for (const item of match) {
                const json = JSON.parse(item.replace(/<!--|-->|{|}/g, ""));
                this.set(json.tags, json.uri);
            }
        }
    }
}
