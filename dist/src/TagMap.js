"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagMap = void 0;
const fast_glob_1 = __importDefault(require("fast-glob"));
const Document_1 = require("./Document");
const MarkdownTags_1 = require("./MarkdownTags");
class TagMap {
    constructor() {
        this._data = [];
    }
    get count() {
        return this._data.length;
    }
    add(tags, uri, search) {
        if (!Array.isArray(tags))
            tags = [tags];
        tags.forEach((tag) => {
            this._data.push({
                tag: tag,
                url: uri,
                search: new RegExp(search || `(^|([^#]|^)[\\s,.!?])(${tag})($|[\\s,.!?])`, "gmi"),
                tagSearch: new RegExp(tag, "gmi"),
            });
        });
    }
    has(tag) {
        return this._data.some((item) => item.tag === tag);
    }
    forEach(callbackfn, thisArg) {
        return this._data.forEach(callbackfn, thisArg !== null && thisArg !== void 0 ? thisArg : this);
    }
    scrapeDoc(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = yield (0, Document_1.LoadDocument)(doc);
                return this.scrape(content, doc);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    scrape(content, doc) {
        const match = content.match(/<!--{.*}-->/gim);
        if (match) {
            for (const item of match) {
                const data = item.replace(/<!--|-->/gim, "");
                if (data.startsWith("{") && data.endsWith("}")) {
                    const json = JSON.parse(data);
                    if (MarkdownTags_1.MarkdownTags.is(json)) {
                        this.add(json.tags, doc);
                    }
                }
            }
        }
    }
    LoadMap(filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Loading map", filepath);
                const content = yield (0, Document_1.LoadDocument)(filepath);
                const json = JSON.parse(content);
                //Convert array of tags to a map
                if (Array.isArray(json)) {
                    json.forEach((item) => {
                        if (SerializedTagMap.is(item)) {
                            this.add(item.tag, item.url, item.search);
                        }
                    });
                }
            }
            catch (err) {
                console.log("Error loading map", err);
            }
        });
    }
    LoadMaps(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = fast_glob_1.default.sync(["**/.tags/*.json"], { cwd: dir, absolute: true });
            for (const file of files) {
                yield this.LoadMap(file);
            }
        });
    }
}
exports.TagMap = TagMap;
var SerializedTagMap;
(function (SerializedTagMap) {
    function is(value) {
        return typeof value === "object" && typeof value.tag === "string";
    }
    SerializedTagMap.is = is;
})(SerializedTagMap || (SerializedTagMap = {}));
