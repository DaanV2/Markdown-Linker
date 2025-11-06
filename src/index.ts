import { GitHub } from './github';
import { main } from "./main";

async function action() {
  const settings = {
    folder: GitHub.getInput("folder", { trimWhitespace: true }),
    ignores: GitHub.getMultilineInput("ignore", { trimWhitespace: true }),
  };

  console.log("Starting on linking", settings);
  
  await main(settings);
}

action()
  .then(() => console.log("done"))
  .catch((err) => GitHub.setFailed(err));
