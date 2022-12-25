"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Replacer_1 = require("../src/Replacer");
const TagMap_1 = require("../src/TagMap");
const path_1 = __importDefault(require("path"));
describe("Scraping", () => {
    test("Able to scrape the content", () => {
        const lines = `
    # Example Markdown Heading
    <!--{"tags":["Graham Norton"]}-->
    Some text`;
        const tagMap = new TagMap_1.TagMap();
        tagMap.scrape(lines, "C:/test.md");
        expect(tagMap.has("Graham Norton")).toBe(true);
    });
});
describe("Replacing", () => {
    const root = __dirname;
    const folder = path_1.default.join(root, "..", "example");
    const filepath = path_1.default.join(folder, "test this.md");
    const otherFilepath = path_1.default.join(folder, "other.md");
    const tags = new TagMap_1.TagMap();
    tags.add("Graham Norton", otherFilepath);
    const replacer = new Replacer_1.Replacer(tags);
    const tests = [
        {
            from: "Graham Norton",
            to: `[Graham Norton](../other.md)`,
        },
        {
            from: " Graham Norton ",
            to: ` [Graham Norton](../other.md) `,
        },
        {
            from: "Graham Norton is a great guy",
            to: `[Graham Norton](../other.md) is a great guy`,
        },
        {
            from: "graham norton is a great guy",
            to: `[graham norton](../other.md) is a great guy`,
        },
        {
            from: "Is Graham Norton a great guy?",
            to: `Is [Graham Norton](../other.md) a great guy?`,
        },
        {
            from: "# Graham Norton",
            to: "# Graham Norton",
        },
        {
            from: "##### Graham Norton",
            to: "##### Graham Norton",
        },
        {
            from: "Is [Graham Norton](../example/mark.md) a great guy?",
            to: "Is [Graham Norton](../example/mark.md) a great guy?",
        },
    ];
    tests.forEach((t) => {
        test(`Able to replace '${t.from}' with '${t.to}'`, () => {
            const result = replacer.replace(t.from, filepath);
            expect(result).toBe(t.to);
        });
    });
});
