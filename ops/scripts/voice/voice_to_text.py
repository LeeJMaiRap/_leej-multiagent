#!/usr/bin/env python3
from __future__ import annotations

import argparse
import datetime as dt
import os
import pathlib
import subprocess
import sys

REPO_ROOT = pathlib.Path(__file__).resolve().parents[3]
DEFAULT_VENV = REPO_ROOT / '.venvs' / 'voice-stack'
DEFAULT_OUTPUT_DIR = REPO_ROOT / 'ops' / 'tmp' / 'voice' / 'transcripts'


def env_path(name: str, default: pathlib.Path) -> pathlib.Path:
    return pathlib.Path(os.environ.get(name, str(default))).expanduser()


def venv_executable(venv: pathlib.Path, executable: str) -> pathlib.Path:
    scripts_dir = 'Scripts' if sys.platform == 'win32' else 'bin'
    suffix = '.exe' if sys.platform == 'win32' else ''
    return venv / scripts_dir / f'{executable}{suffix}'

SCRIPT_TEMPLATE = """from faster_whisper import WhisperModel\nmodel = WhisperModel({model!r}, compute_type='int8')\nsegments, info = model.transcribe({audio!r}, language={language!r})\nprint('LANG:', info.language)\nprint('PROB:', info.language_probability)\nprint('---TRANSCRIPT---')\nfor segment in segments:\n    print(segment.text.strip())\n"""


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description='Convert voice/audio to text using faster-whisper.')
    p.add_argument('audio', help='Path to audio file (.ogg/.mp3/.wav/...)')
    p.add_argument('--language', default='vi', help='Language hint, default vi')
    p.add_argument('--model', default='small', help='Whisper model size (tiny/base/small/medium/large-v3...)')
    p.add_argument('--name', default='transcript', help='Base name for output transcript file')
    p.add_argument('--output-dir', default=str(env_path('VOICE_TRANSCRIPT_DIR', DEFAULT_OUTPUT_DIR)), help='Directory for transcript files')
    return p


def main() -> int:
    args = build_parser().parse_args()
    audio_path = pathlib.Path(args.audio)
    if not audio_path.exists():
        raise SystemExit(f'Audio file not found: {audio_path}')

    output_dir = pathlib.Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    stamp = dt.datetime.utcnow().strftime('%Y%m%d-%H%M%S')
    transcript_path = output_dir / f'{stamp}-{args.name}.md'
    runner_path = output_dir / f'{stamp}-{args.name}-runner.py'

    runner_path.write_text(
        SCRIPT_TEMPLATE.format(model=args.model, audio=str(audio_path), language=args.language),
        encoding='utf-8'
    )

    venv_path = env_path('VOICE_STACK_VENV', DEFAULT_VENV)
    python_bin = env_path('VOICE_STACK_PYTHON', venv_executable(venv_path, 'python'))
    if not python_bin.exists():
        raise SystemExit(f'voice-stack python not found at {python_bin}; set VOICE_STACK_PYTHON or VOICE_STACK_VENV')

    result = subprocess.run(
        [str(python_bin), str(runner_path)],
        check=True,
        capture_output=True,
        text=True,
    )

    transcript_path.write_text(result.stdout, encoding='utf-8')
    print(str(transcript_path))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
