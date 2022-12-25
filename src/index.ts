import { TagMap } from "./TagMap";
import FastGlob from "fast-glob";
import path from "path";
import { Replacer } from "./Replacer";

async function main() {
  const cwd = path.join(__dirname, "../../");
  const tagMap = new TagMap();

  // Loading maps
  console.info("====//\tLoadings maps\t//====");
  await tagMap.LoadMaps(cwd);

  // Gathering files
  console.info("====//\tGathering files\t//====");
  const files = FastGlob.sync(["**/*.md"], { cwd, absolute: true, ignore: ["node_modules", ".tags"] });
  console.info(`Found ${files.length} markdown files`);

  // Scraping files
  console.info("====//\tScraping files\t//====");
  await Promise.all(files.map((file) => tagMap.scrapeDoc(file)));
  console.info("Tag count:", tagMap.count);

  // Replacing tags
  const replacer = new Replacer(tagMap);
  console.info("====//\tReplacing tags\t//====");
  await replacer.replaceDocuments(files);
}

main()
  .then(() => console.log("done"))
  .catch((err) => console.error(err));

function shouldFilter(filepath: string): boolean {
  if (filepath.includes("node_modules")) return false;
  if (filepath.includes(".tags")) return false;

  return true;
}
