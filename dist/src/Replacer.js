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
exports.Replacer = void 0;
const path_1 = __importDefault(require("path"));
const Document_1 = require("./Document");
class Replacer {
    constructor(tags) {
        this.tags = tags;
    }
    replace(text, currentDoc) {
        this.tags.forEach((item) => {
            if (item.url === currentDoc)
                return;
            const dir = path_1.default.resolve(currentDoc, "..");
            text = text.replace(item.search, (match, ...args) => {
                let { tag, url, tagSearch } = item;
                if (!url.startsWith("http")) {
                    url = path_1.default.relative(dir, url).replace(/\\/gim, "/");
                    url = encodeURI(url);
                }
                const newText = `[${tag}](${url})`;
                return match.replace(tagSearch, newText);
            });
        });
        return text;
    }
    replaceDocuments(files) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const file of files) {
                const content = yield (0, Document_1.LoadDocument)(file);
                const newContent = this.replace(content, file);
                if (content !== newContent) {
                    console.info("Saving", file);
                    yield (0, Document_1.SaveDocument)(file, newContent);
                }
            }
        });
    }
}
exports.Replacer = Replacer;
