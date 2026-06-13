import logger from "./logger";
import { segment } from "./types";
import {
  fileExist,
  convertToWav,
  transcribeWithTimestamp,
  setConfig,
  isUrl,
} from "./utils";

const findWord = async (
  inputPath: string,
  word: string,
): Promise<segment[]> => {
  try {
    const isItUrl = isUrl(inputPath);
    if (!isItUrl) {
      await fileExist(inputPath);
    }
    //convert it to .wav
    const outputPath = convertToWav(inputPath, isItUrl);
    //start transcribing and keep on inserting word timestamp
    const segments: segment[] = await transcribeWithTimestamp(outputPath, word);
    //return
    console.log(segments);
    return segments;
  } catch (error) {
    logger.error(`Error in finding word in file: ${error}`);
    throw error;
  }
};

export { findWord, setConfig, fileExist };
