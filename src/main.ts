import { sync } from "fast-glob";
import { GitHub } from './github';
import { Replacer } from "./replacer";
import { TagMap } from "./tag-map";

export interface Settings {
  folder: string;
  ignores: string[];
}

export async function main(settings: Settings) {
  const cwd = settings.folder;
  const tagMap = new TagMap();

  // Loading maps
  await GitHub.group("Loading maps", async () => {
    return tagMap.loadMaps(cwd);
  });

  // Gathering files
  const files = await GitHub.group("Gathering files", async () => {
    const ignores = ["node_modules", ".tags", ...settings.ignores];
    return sync(["**/*.md"], { cwd, absolute: true, ignore: ignores });
  });

  // Scraping files
  await GitHub.group("Scraping files", async () => {
    return Promise.all(files.map((file) => tagMap.scrapeDoc(file)));
  });
  GitHub.debug(`Tag count: ${tagMap.count}`);

  // Replacing tags
  await GitHub.group("Replacing tags", async () => {
    const replacer = new Replacer(tagMap);
    return replacer.replaceDocuments(files);
  });
}
