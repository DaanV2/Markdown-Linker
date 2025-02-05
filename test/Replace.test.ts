import { Replacer } from "../src/replacer";
import { TagMap } from "../src/tag-map";
import path from "path";

describe("Scraping", () => {
  test("Able to scrape the content", () => {
    const lines = `
    # Example Markdown Heading
    <!--{"tags":["Graham Norton"]}-->
    Some text`;

    const tagMap = new TagMap();
    tagMap.scrape(lines, "C:/test.md");

    expect(tagMap.has("Graham Norton")).toBe(true);
  });
});

describe("Replacing", () => {
  const root = __dirname;
  const folder = path.join(root, "..", "example");
  const filepath = path.join(folder, "test this.md");
  const otherFilepath = path.join(folder, "other.md");

  const tags = new TagMap();
  tags.add("Graham Norton", otherFilepath);
  const replacer = new Replacer(tags);

  const tests: { from: string; to: string }[] = [
    {
      from: "Graham Norton",
      to: `[Graham Norton](other.md)`,
    },
    {
      from: " Graham Norton ",
      to: ` [Graham Norton](other.md) `,
    },
    {
      from: "Graham Norton is a great guy",
      to: `[Graham Norton](other.md) is a great guy`,
    },
    {
      from: "graham norton is a great guy",
      to: `[graham norton](other.md) is a great guy`,
    },
    {
      from: "Is Graham Norton a great guy?",
      to: `Is [Graham Norton](other.md) a great guy?`,
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
    {
      from: "Is [Guy Graham Norton](../example/mark.md) a great guy?",
      to: "Is [Guy Graham Norton](../example/mark.md) a great guy?",
    },
  ];

  tests.forEach((t) => {
    test(`Able to replace '${t.from}' with '${t.to}'`, () => {
      const result = replacer.replace(t.from, filepath);

      expect(result).toBe(t.to);
    });
  });
});
