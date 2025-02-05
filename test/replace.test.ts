import { Replacer } from "../src/replacer";
import { TagMap } from "../src/tag-map";
import path from "path";

describe("Scraping", () => {
  test("Able to scrape the content", () => {
    const lines = `
    # Example Markdown Heading
    <!--{"tags":["Frodo baggings"]}-->
    Some text`;

    const tagMap = new TagMap();
    tagMap.scrape(lines, "C:/test.md");

    expect(tagMap.has("Frodo baggings")).toBe(true);
  });
});

describe("Replacing", () => {
  const root = __dirname;
  const folder = path.join(root, "..", "example");
  const filepath = path.join(folder, "test this.md");
  const otherFilepath = path.join(folder, "other.md");

  const tags = new TagMap();
  tags.add("Frodo baggings", otherFilepath);
  const replacer = new Replacer(tags);

  const tests: { from: string; to: string }[] = [
    {
      from: "Frodo baggings",
      to: `[Frodo baggings](other.md)`,
    },
    {
      from: " Frodo baggings ",
      to: ` [Frodo baggings](other.md) `,
    },
    {
      from: "Frodo baggings is a great guy",
      to: `[Frodo baggings](other.md) is a great guy`,
    },
    {
      from: "Frodo baggings is a great guy",
      to: `[Frodo baggings](other.md) is a great guy`,
    },
    {
      from: "Is Frodo baggings a great guy?",
      to: `Is [Frodo baggings](other.md) a great guy?`,
    },
    {
      from: "# Frodo baggings",
      to: "# Frodo baggings",
    },
    {
      from: "##### Frodo baggings",
      to: "##### Frodo baggings",
    },
    {
      from: "Is [Frodo baggings](../example/mark.md) a great guy?",
      to: "Is [Frodo baggings](../example/mark.md) a great guy?",
    },
    {
      from: "Is [Guy Frodo baggings](../example/mark.md) a great guy?",
      to: "Is [Guy Frodo baggings](../example/mark.md) a great guy?",
    },
  ];

  tests.forEach((t) => {
    test(`Able to replace '${t.from}' with '${t.to}'`, () => {
      const result = replacer.replace(t.from, filepath);

      expect(result).toMatchSnapshot();
    });
  });
});
