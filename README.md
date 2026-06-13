# findword

Transcribe media files using [whisper.cpp](https://github.com/ggerganov/whisper.cpp) and search for specific words or phrases in the transcript.

## Prerequisites

- **Node.js >= 18**
- **[whisper.cpp](https://github.com/ggerganov/whisper.cpp)** — build the `whisper-cli` binary and download a model
- **ffmpeg** (for local media files)
- **yt-dlp** (for YouTube URLs)

## Setup

```bash
npm install
npm run build
```

Configure the paths to `whisper-cli` and your model:

```bash
fword config
```

Or edit `config/config.json` manually (see `config/config.example.json`).

## Usage

Search for a word in a media file:

```bash
fword find /path/to/media.mp4 "hello"
```

Search for a word in a YouTube video:

```bash
fword find https://youtube.com/watch?v=... "hello"
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run typecheck` | Type-check without emitting |
| `fword <args>` | Run the CLI (`npm run fword -- <args>` via ts-node) |

## License

ISC
