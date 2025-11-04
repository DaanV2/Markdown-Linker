import { Replacer } from "../src/replacer";
import { TagMap } from "../src/tag-map";
import path from "path";

describe("Fragment Links", () => {
  const root = __dirname;
  const folder = path.join(root, "..", "example");
  const filepath = path.join(folder, "test.md");

  const tags = new TagMap();
  tags.add("example", path.join(folder, "example.md"));
  const replacer = new Replacer(tags);

  test("Should not replace text in fragment link", () => {
    const input = "[example](#some-header)";
    const result = replacer.replace(input, filepath);
    expect(result).toBe("[example](#some-header)");
  });

  test("Should not replace text in fragment link with spaces", () => {
    const input = "[example](#some header)";
    const result = replacer.replace(input, filepath);
    expect(result).toBe("[example](#some header)");
  });

  test("Should replace standalone word", () => {
    const input = "example is a word";
    const result = replacer.replace(input, filepath);
    expect(result).toContain("[example](");
  });

  test("Should not replace text in regular link", () => {
    const input = "[example](other.md)";
    const result = replacer.replace(input, filepath);
    expect(result).toBe("[example](other.md)");
  });
});
