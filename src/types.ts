type modelConfig = {
    whisperCliPath: string,
    modelPath: string
}

type segment = {
  timestamps: {
    from: string;
    to: string;
  };
  offsets: {
    from: number;
    to: number;
  };
  text: string;
};

export { modelConfig, segment }