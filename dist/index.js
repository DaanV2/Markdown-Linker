import { TagMap } from "./TagMap";
import FastGlob from "fast-glob";
import path from "path";
import { Replacer } from "./Replacer";
async function main() {
    const tagMap = new TagMap();
    const cwd = path.join(__dirname, "../../");
    console.info("Gathering files");
    const files = FastGlob.sync(["**/*.md"], { cwd, absolute: true });
    console.info(`Found ${files.length}x files`);
    console.info("Scraping files");
    await Promise.all(files.map((file) => tagMap.scrape(file)));
    console.info("Tag count:", tagMap.count);
    const replacer = new Replacer(tagMap, cwd);
    console.info("Replacing tags");
    await replacer.replaceDocuments(files);
}
main()
    .then(() => console.log("done"))
    .catch((err) => console.error(err));
