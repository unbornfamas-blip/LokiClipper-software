# LokiClipper Architecture

## Backend

- Electron Main Process
- FFmpeg
- FFprobe
- Project Manager
- AI Engine (Future)

## Renderer

- app.js
- videoPlayer.js
- utils.js
- importManager.js (Planned)
- metadataPanel.js (Planned)
- thumbnailPanel.js (Planned)

## Project Structure

Each imported stream becomes a standalone project containing:

- project.json
- thumbnail.jpg
- original/
- thumbnails/
- waveform/
- analysis/
- clips/
- exports/
- logs/