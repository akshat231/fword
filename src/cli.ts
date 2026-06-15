import * as readline from "readline/promises";
import * as indexFile from "./index";
import { modelConfig } from "./types";;

const args = process.argv;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const whisperCLIQuestion = "Enter whisper-CLI Path: ";
const modelQuestion = "Enter model path: ";

const config = async () => {
  try {
    const whisperCliPath = await rl.question(whisperCLIQuestion);
    await indexFile.fileExist(whisperCliPath)
    const modelPath = await rl.question(modelQuestion);
    await indexFile.fileExist(modelPath)
    rl.close();
    const config: modelConfig = {
      whisperCliPath,
      modelPath
    }
    await indexFile.setConfig(config);
    return;
  } catch (error) {
    throw error;
  }
};


if (args[2] === "config") {
  config()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
} else if (args[2] === "find") {
  indexFile.findWord(args[3], args[4])
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
} else {
  throw new Error('Argument not supported')
}
