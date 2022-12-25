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
const TagMap_1 = require("./TagMap");
const fast_glob_1 = __importDefault(require("fast-glob"));
const path_1 = __importDefault(require("path"));
const Replacer_1 = require("./Replacer");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = path_1.default.join(__dirname, "../../");
        const tagMap = new TagMap_1.TagMap();
        yield tagMap.LoadMaps(cwd);
        console.info("Gathering files");
        const files = fast_glob_1.default.sync(["**/*.md"], { cwd, absolute: true }).filter(shouldFilter);
        console.info(`Found ${files.length}x files`);
        console.info("Scraping files");
        yield Promise.all(files.map((file) => tagMap.scrapeDoc(file)));
        console.info("Tag count:", tagMap.count);
        const replacer = new Replacer_1.Replacer(tagMap);
        console.info("Replacing tags");
        yield replacer.replaceDocuments(files);
    });
}
main()
    .then(() => console.log("done"))
    .catch((err) => console.error(err));
function shouldFilter(filepath) {
    if (filepath.includes("node_modules"))
        return false;
    if (filepath.includes(".tags"))
        return false;
    return true;
}
