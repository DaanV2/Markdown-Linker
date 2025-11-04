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

  test("Should replace standalone word with reference-style link", () => {
    const input = "example is a word";
    const result = replacer.replace(input, filepath);
    // The tool converts to reference-style links
    expect(result).toContain("[example]");
    expect(result).toContain("[example]: example.md");
  });

  test("Should convert regular link to reference-style", () => {
    const input = "[example](other.md)";
    const result = replacer.replace(input, filepath);
    // Regular links are converted to reference-style
    expect(result).toContain("[example]");
    expect(result).toContain("[example]: other.md");
  });

  test("Should not replace text in multiple fragment links", () => {
    const input = "See [example](#header-1) and [example](#header-2) for details";
    const result = replacer.replace(input, filepath);
    expect(result).toContain("[example](#header-1)");
    expect(result).toContain("[example](#header-2)");
  });

  test("Should handle mixed fragment and regular links", () => {
    const input = "[example](#fragment) and [example](file.md)";
    const result = replacer.replace(input, filepath);
    // Fragment link should remain inline
    expect(result).toContain("[example](#fragment)");
    // Regular link should be converted to reference-style
    expect(result).toContain("[example]: file.md");
  });
});
