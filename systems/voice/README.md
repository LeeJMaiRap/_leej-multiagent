# Voice IO

## Environment

Voice scripts default to repo-relative paths:

- Venv: `.venvs/voice-stack`
- STT output: `ops/tmp/voice/transcripts`
- TTS output: `ops/tmp/voice/generated`

Optional overrides:

- `VOICE_STACK_VENV`
- `VOICE_STACK_PYTHON`
- `EDGE_TTS_BIN`
- `FFMPEG_BIN`
- `VOICE_TRANSCRIPT_DIR`
- `VOICE_GENERATED_DIR`
- `VOICE_STT_SCRIPT`
- `VOICE_TTS_SCRIPT`

## STT

Use Whisper through the voice stack venv:

```bash
python ops/scripts/voice/voice_to_text.py <audio_file> --language vi --model small --name transcript
```

Windows PowerShell example:

```powershell
$env:VOICE_STACK_VENV = ".venvs\voice-stack"
python ops\scripts\voice\voice_to_text.py .\sample.ogg --language vi --model small
```

Linux/macOS example:

```bash
VOICE_STACK_VENV=.venvs/voice-stack python ops/scripts/voice/voice_to_text.py ./sample.ogg --language vi --model small
```

Notes:

- Default language is Vietnamese.
- Model `base` gives much better results than `tiny`.
- For short/unclear clips, result may still be imperfect.

## TTS

Use edge-tts through the voice stack venv:

```bash
python ops/scripts/voice/text_to_voice.py --text "Xin chào anh Doanh" --name reply
```

Windows PowerShell example:

```powershell
$env:VOICE_STACK_VENV = ".venvs\voice-stack"
python ops\scripts\voice\text_to_voice.py --text "Xin chào anh Doanh" --name reply
```

Linux/macOS example:

```bash
VOICE_STACK_VENV=.venvs/voice-stack python ops/scripts/voice/text_to_voice.py --text "Xin chào anh Doanh" --name reply
```

If ffmpeg is not on PATH, set `FFMPEG_BIN`:

```bash
FFMPEG_BIN=/path/to/ffmpeg python ops/scripts/voice/text_to_voice.py --text "Xin chào" --name reply
```

Default voice:

- `vi-VN-HoaiMyNeural`

## Current status

- STT: working on local test file
- TTS: working, outputs mp3/ogg
- Next improvement: auto language detect, preprocessing, confidence/fallback flow
