import { main } from "./main";
import * as core from "@actions/core";

async function action() {
  const settings = {
    folder: core.getInput("folder", { trimWhitespace: true }),
    ignores: core.getMultilineInput("ignore", { trimWhitespace: true }),
  };

  console.log("Starting on linking", settings);
  
  await main(settings);
}

action()
  .then(() => console.log("done"))
  .catch((err) => core.setFailed(err));
