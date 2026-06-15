import { execFileSync } from "child_process";
import { access } from "fs/promises";
import path from "path";
import { modelConfig, segment } from "./types";
import fs from "fs/promises";
import os from "os";

const getConfig = async (): Promise<modelConfig> => {
  try {
    const configPath = path.join(__dirname, "..", "config", "config.json");
    const data = await fs.readFile(configPath, "utf-8");
    return JSON.parse(data) as modelConfig;
  } catch (error) {
    throw error;
  }
};

const setConfig = async (options: modelConfig): Promise<void> => {
  try {
    const configPath = path.join(__dirname, "..", "config", "config.json");
    await fs.writeFile(configPath, JSON.stringify(options, null, 2), "utf-8");
  } catch (error) {
    throw error;
  }
};

const fileExist = async (inputPath: string): Promise<boolean> => {
  try {
    await access(inputPath);
    return true;
  } catch (error) {
    throw error;
  }
};

const convertToWav = async (inputPath: string, isItUrl: boolean): Promise<string> => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputPath = path.join(os.tmpdir(), `output-${timestamp}.wav`);
  try {
    if (isItUrl) {
      const args = ["--extract-audio", "--audio-format", "wav", "--audio-quality", "0", "-o", outputPath, inputPath];
      execFileSync("yt-dlp", args);
    } else {
      const args = ["-y", "-i", inputPath, "-c:a", "pcm_s16le", outputPath];
      execFileSync("ffmpeg", args);
    }
    return outputPath;
  } catch (error) {
    await fs.unlink(outputPath)
    throw error;
  }
};

const transcribeWithTimestamp = async (
  inputPath: string,
  word: string,
): Promise<segment[]> => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputPath = path.join(os.tmpdir(), `output-${timestamp}`);
  try {
    const matches: segment[] = [];
    //get config
    const config = await getConfig();
    const whisperCliPath = config.whisperCliPath;
    const modelPath = config.modelPath;
    // do actual transcribing
    const args = ["-m", modelPath, "-f", inputPath, "-oj", "-of", outputPath];
    execFileSync(whisperCliPath, args);
    await fs.unlink(inputPath)
    const rawFile = outputPath + ".json";
    const raw = await fs.readFile(rawFile, "utf-8");
    const data = JSON.parse(raw);
    const segments: segment[] = data.transcription ?? [];
    for (const seg of segments) {
      if (seg.text?.toLowerCase().includes(word.toLowerCase())) {
        matches.push(seg);
      }
    }
    await fs.unlink(`${outputPath}.json`)
    return matches;
  } catch (error) {
    await fs.unlink(inputPath)
    await fs.unlink(`${outputPath}.json`)
    throw error;
  }
};

const isUrl = (input: string) => {
  try {
    const url = new URL(input);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
};

export { fileExist, convertToWav, transcribeWithTimestamp, setConfig, isUrl };
