import { Replacer } from "./replacer";
import { TagMap } from "./tag-map";
import FastGlob from "fast-glob";
import * as core from "@actions/core";

export interface Settings {
  folder: string;
  ignores: string[];
}

export async function main(settings: Settings) {
  const cwd = settings.folder;
  const tagMap = new TagMap();

  // Loading maps
  await core.group("Loading maps", async () => {
    return tagMap.loadMaps(cwd);
  });

  // Gathering files
  const files = await core.group("Gathering files", async () => {
    const ignores = ["node_modules", ".tags", ...settings.ignores];
    return FastGlob.sync(["**/*.md"], { cwd, absolute: true, ignore: ignores });
  });

  // Scraping files
  await core.group("Scraping files", async () => {
    return Promise.all(files.map((file) => tagMap.scrapeDoc(file)));
  });
  console.info("Tag count:", tagMap.count);

  // Replacing tags
  await core.group("Replacing tags", async () => {
    const replacer = new Replacer(tagMap);
    return replacer.replaceDocuments(files);
  });
}
