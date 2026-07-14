const fs = require("fs");
const path = require("path");

const {
  getVideoMetadata
} = require("../video/videoMetadata");

const {
  generateThumbnail
} = require("../video/thumbnailGenerator");

const {
  generateWaveform
} = require("../audio/waveformGenerator");

const {
  extractAudio
} = require("../audio/audioExtractor");

const {
    transcribeAudio
} = require("../whisper/whisperService");

const { JobTypes } = require("../jobs/jobTypes"); 

const {
  createPendingJob,
  createRunningJob,
  completeJob,
  failJob
} = require("../jobs/jobFactory");

function safeFolderName(name) {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "_")
    .trim();
}

function toFileUrl(filePath) {
  return `file://${filePath.replace(/\\/g, "/")}`;
}

async function runImportPipeline({
  filePath,
  documentsPath
}) {
  const stats = fs.statSync(filePath);
  const fileName = path.basename(filePath);
  const projectName = safeFolderName(fileName);

 const metadataJob = createRunningJob(
  JobTypes.METADATA,
  "Reading video metadata..."
);

let metadata;

try {
  metadata = await getVideoMetadata(filePath);

  completeJob(
    metadataJob,
    "Metadata read successfully."
  );
} catch (error) {
  failJob(
    metadataJob,
    error.message || "Metadata processing failed."
  );

  console.error("FFprobe metadata error:", error);
  throw error;
}

  const projectsRoot = path.join(
    documentsPath,
    "LokiClipper",
    "Projects"
  );

  const projectRoot = path.join(
    projectsRoot,
    projectName
  );

  const projectFolders = [
    "original",
    "thumbnails",
    "waveform",
    "analysis",
    "clips",
    "exports",
    "logs"
  ];

  projectFolders.forEach(folder => {
    fs.mkdirSync(
      path.join(projectRoot, folder),
      { recursive: true }
    );
  });

  const projectFile = path.join(
    projectRoot,
    "project.json"
  );

  const thumbnailPath = path.join(
    projectRoot,
    "thumbnails",
    "thumbnail.jpg"
  );

  const waveformPath = path.join(
    projectRoot,
    "waveform",
    "waveform.png"
  );

  const audioPath = path.join(
  projectRoot,
  "analysis",
  "audio.wav"
);

  const thumbnailJob = createRunningJob(
  JobTypes.THUMBNAIL,
  "Generating project thumbnail..."
);

let thumbnail = null;

try {
  thumbnail = await generateThumbnail(
    filePath,
    thumbnailPath,
    metadata.duration
  );

  completeJob(
    thumbnailJob,
    "Thumbnail generated successfully."
  );
} catch (error) {
  failJob(
    thumbnailJob,
    error.message || "Thumbnail generation failed."
  );

  console.error(
    "Thumbnail generation failed:",
    error
  );
}

  const waveformJob = createRunningJob(
  JobTypes.WAVEFORM,
  "Generating audio waveform..."
);

let waveform = null;

try {
  waveform = await generateWaveform(
    filePath,
    waveformPath
  );

  completeJob(
    waveformJob,
    "Waveform generated successfully."
  );
} catch (error) {
  failJob(
    waveformJob,
    error.message || "Waveform generation failed."
  );

  console.error(
    "Waveform generation failed:",
    error
  );
}

const audioJob = createRunningJob(
  JobTypes.AUDIO_EXTRACTION,
  "Extracting audio..."
);

let audio = null;

try {

  audio = await extractAudio(
    filePath,
    audioPath
  );

  completeJob(
    audioJob,
    "Audio extracted successfully."
  );

} catch (error) {

  failJob(
    audioJob,
    error.message ||
    "Audio extraction failed."
  );

  console.error(
    "Audio extraction failed:",
    error
  );

}

const transcriptJob = createRunningJob(
  JobTypes.TRANSCRIPT,
  "Transcribing audio..."
);

let transcript = null;

try {

  transcript = await transcribeAudio(
    audio.outputPath,
    path.join(projectRoot, "analysis")
  );

  completeJob(
    transcriptJob,
    "Transcript generated successfully."
  );

} catch (error) {

  failJob(
    transcriptJob,
    error.message ||
    "Transcript generation failed."
  );

  console.error(
    "Transcript generation failed:",
    error
  );

}

createPendingJob(
  JobTypes.AI_ANALYSIS,
  "Waiting for transcript."
);

  const projectData = {
    app: "LokiClipper",
    version: "0.5.4",
    projectName,

    originalVideo: {
      path: filePath,
      name: fileName,
      size: stats.size
    },

    metadata,

    thumbnail: thumbnail
      ? {
          path: thumbnail.outputPath,
          timestamp: thumbnail.timestamp
        }
      : null,

    waveform: waveform
      ? {
          path: waveform.outputPath,
          width: waveform.width,
          height: waveform.height
        }
      : null,

    audio: audio
      ? {
          path: audio.outputPath
        }
      : null,

    transcript: transcript
      ? {
      path: transcript.jsonPath
      }
    : null,

    createdAt: new Date().toISOString(),
    status: "created"
  };

  fs.writeFileSync(
    projectFile,
    JSON.stringify(projectData, null, 2),
    "utf8"
  );

  return {
    path: filePath,
    url: toFileUrl(filePath),
    name: fileName,
    size: stats.size,

    projectName,
    projectRoot,
    projectFile,

    metadata,

    thumbnailPath:
      thumbnail?.outputPath || null,

    thumbnailUrl:
      thumbnail
        ? toFileUrl(thumbnail.outputPath)
        : null,

    thumbnailTimestamp:
      thumbnail?.timestamp ?? null,

    waveformPath:
      waveform?.outputPath || null,

    waveformUrl:
      waveform
        ? toFileUrl(waveform.outputPath)
        : null,

    audioPath:
      audio?.outputPath || null,

    audioUrl:
      audio
        ? toFileUrl(audio.outputPath)
        : null,
  };
}

module.exports = {
  runImportPipeline
};