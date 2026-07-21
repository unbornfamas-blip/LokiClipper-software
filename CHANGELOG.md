# Version 0.5.4

## Workspace V2
- Complete dashboard redesign
- Responsive 12-column workspace layout
- Fixed panel overlap and resizing issues
- Added panel lock/unlock toggle
- Improved panel spacing and visual hierarchy
- Modular HTML and CSS architecture
- Full-width video player and timeline
- Dedicated Project, Metadata and AI Queue panels
- Maintained compatibility with:
  - Video Import
  - FFprobe Metadata Engine
  - FFmpeg Thumbnail Generator
  - Waveform Generator

  # v0.6.0 - AI Clip Generation Pipeline

## Added
- AI Hook Review panel
- Generated Clips panel
- FFmpeg clip generation
- Human-friendly clip naming
- Balanced hook candidate distribution
- Improved hook scoring
- Unicode-safe project folder names
- Robust null handling throughout the import pipeline

## Improved
- Hook detection quality
- Project stability
- Import workflow
- Error handling
- Clip generation reliability

## Fixed
- Whisper failures with emoji and Unicode filenames
- Hook analysis null reference crashes
- Generated clip panel integration
- Project JSON clip support