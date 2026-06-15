# findword (`fword`)

Find where a word or phrase is spoken in any audio or video.

`fword` transcribes a media file (or a video from a URL) with
[whisper.cpp](https://github.com/ggerganov/whisper.cpp), then reports the
timestamped transcript segments that contain your search term — so you can jump
straight to the moment it was said.

```bash
fword find talk.mp4 "machine learning"
```
```
[
  {
    timestamps: { from: '00:03:12,400', to: '00:03:18,900' },
    offsets:    { from: 192400, to: 198900 },
    text: ' so this is where machine learning really shines'
  }
]
```

## How it works

```
input (file or URL)
  ├── URL  → yt-dlp  → output.wav   (extract audio)
  └── file → ffmpeg  → output.wav   (16-bit PCM)
                          │
                          ▼
                  whisper.cpp  → output.json   (transcript + timestamps)
                          │
                          ▼
            match search term against each segment → print matches
```

## Prerequisites

These must be installed and available on your `PATH`:

| Tool | Why | 
|------|-----|
| **Node.js ≥ 18** | runtime |
| **[whisper.cpp](https://github.com/ggerganov/whisper.cpp)** | transcription — build the `whisper-cli` binary and download a model (e.g. `ggml-base.en.bin`) |
| **ffmpeg** | converts local media files to WAV |
| **yt-dlp** | downloads audio from URLs ([YouTube, Vimeo, X, Instagram, TikTok, and hundreds more](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)) |

## Setup

```bash
npm install
npm run build
```

Tell `fword` where your `whisper-cli` binary and model live:

```bash
fword config
```

It will prompt for both paths and validate that each file exists, then save them
to `config/config.json`. You can also copy `config/config.example.json` to
`config/config.json` and edit it by hand:

```json
{
  "whisperCliPath": "/path/to/whisper.cpp/build/bin/whisper-cli",
  "modelPath": "/path/to/whisper.cpp/models/ggml-base.en.bin"
}
```

## Usage

**Search a local file:**

```bash
fword find /path/to/media.mp4 "hello"
```

**Search a video from a URL:**

```bash
fword find "https://youtube.com/watch?v=dQw4w9WgXcQ" "never gonna"
```

The search term can be a single word or a phrase. Matching is
case-insensitive and uses substring matching (so `cat` also matches
`category`). Matching segments are printed to stdout; if nothing matches, an
empty list is printed.

## Limitations

A few things worth knowing before you rely on it:

- **Phrases must fall within a single transcript segment.** whisper.cpp splits
  speech into segments of roughly a sentence each. A phrase is only found if it
  appears whole inside one segment — a phrase that spans a segment boundary
  won't be matched.
- **Timestamps are segment-level, not word-level.** A match points to the
  segment containing the term (often several seconds long), not the exact
  instant the word is spoken.
- **Working files are written to the current directory.** Each run creates
  `output.wav` and `output.json` in the directory you run from, overwriting any
  previous run. Don't run two searches in the same directory at once.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run typecheck` | Type-check without emitting |
| `npm run fword -- <args>` | Run the CLI directly via `ts-node` (e.g. `npm run fword -- find clip.mp4 "hi"`) |
| `fword <args>` | Run the installed CLI |

## License

ISC
