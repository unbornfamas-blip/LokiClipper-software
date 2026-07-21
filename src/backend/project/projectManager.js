const fs = require("fs");
const path = require("path");

function getProjectsRoot(
  documentsPath
) {
  return path.join(
    documentsPath,
    "LokiClipper",
    "Projects"
  );
}

function readProjectJson(
  projectJsonPath
) {
  try {
    if (!fs.existsSync(projectJsonPath)) {
      return null;
    }

    return JSON.parse(
      fs.readFileSync(
        projectJsonPath,
        "utf8"
      )
    );
  } catch (error) {
    console.error(
      `Could not read project file: ${projectJsonPath}`,
      error
    );

    return null;
  }
}

function getProjects(
  documentsPath
) {
  const projectsRoot =
    getProjectsRoot(documentsPath);

  if (!fs.existsSync(projectsRoot)) {
    return [];
  }

  return fs
    .readdirSync(
      projectsRoot,
      {
        withFileTypes: true
      }
    )
    .filter(entry =>
      entry.isDirectory()
    )
    .map(entry => {
      const projectRoot =
        path.join(
          projectsRoot,
          entry.name
        );

      const projectJsonPath =
        path.join(
          projectRoot,
          "project.json"
        );

      const project =
        readProjectJson(
          projectJsonPath
        );

      const stats =
        fs.statSync(projectRoot);

      const clipsDirectory = path.join(
            projectRoot,
                 "clips"
        );

    let clipCount = 0;

    try {
    if (fs.existsSync(clipsDirectory)) {
        clipCount = fs
        .readdirSync(
            clipsDirectory,
            {
            withFileTypes: true
            }
        )
        .filter(entry =>
            entry.isFile() &&
            /\.(mp4|mov|mkv|webm)$/i.test(
            entry.name
            )
        )
        .length;
    }
    } catch (error) {
    console.error(
        `Could not count clips in: ${clipsDirectory}`,
        error
        );
    }

      return {
        name:
          project?.projectName ||
          entry.name,

        folderName:
          entry.name,

        projectRoot,
        projectJsonPath,

        thumbnailPath:
          project?.thumbnail?.path ||
          null,

        clipCount,

        duration:
          project?.metadata?.duration ||
          null,

        status:
          project?.status ||
          "unknown",

        createdAt:
          project?.createdAt ||
          stats.birthtime.toISOString(),

        lastModifiedAt:
          stats.mtime.toISOString()
      };
    })
    .sort(
      (a, b) =>
        new Date(b.lastModifiedAt) -
        new Date(a.lastModifiedAt)
    );
}

function readJsonFile(filePath) {
  try {
    if (
      !filePath ||
      !fs.existsSync(filePath)
    ) {
      return null;
    }

    return JSON.parse(
      fs.readFileSync(
        filePath,
        "utf8"
      )
    );
  } catch (error) {
    console.error(
      `Could not read JSON file: ${filePath}`,
      error
    );

    return null;
  }
}

function getGeneratedClips(projectRoot) {
  const clipsDirectory =
    path.join(
      projectRoot,
      "clips"
    );

  if (!fs.existsSync(clipsDirectory)) {
    return [];
  }

  try {
    return fs
      .readdirSync(
        clipsDirectory,
        {
          withFileTypes: true
        }
      )
      .filter(entry =>
        entry.isFile() &&
        /\.(mp4|mov|mkv|webm)$/i.test(
          entry.name
        )
      )
      .map(entry => {
        const clipPath =
          path.join(
            clipsDirectory,
            entry.name
          );

        const stats =
          fs.statSync(clipPath);

        return {
          name: path.parse(
            entry.name
          ).name.replaceAll("_", " "),

          fileName: entry.name,
          path: clipPath,

          createdAt:
            stats.birthtime.toISOString()
        };
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
  } catch (error) {
    console.error(
      `Could not read generated clips: ${clipsDirectory}`,
      error
    );

    return [];
  }
}

function openProject(projectJsonPath) {
  const project =
    readProjectJson(
      projectJsonPath
    );

  if (!project) {
    throw new Error(
      "The selected project could not be read."
    );
  }

  const projectRoot =
    path.dirname(
      projectJsonPath
    );

  const originalVideoPath =
    project.originalVideo?.path;

  if (
    !originalVideoPath ||
    !fs.existsSync(originalVideoPath)
  ) {
    throw new Error(
      "The original video file could not be found."
    );
  }

  const hookFile =
    readJsonFile(
      project.hookAnalysis?.path
    );

  const hookCandidates =
    Array.isArray(hookFile)
      ? hookFile
      : hookFile?.candidates ||
        hookFile?.hooks ||
        [];

  return {
    projectName:
      project.projectName ||
      path.basename(projectRoot),

    projectRoot,
    projectFile:
      projectJsonPath,

    path:
      originalVideoPath,

    url:
      `file:///${originalVideoPath.replace(
        /\\/g,
        "/"
      )}`,

    name:
      project.originalVideo?.name ||
      path.basename(originalVideoPath),

    size:
      project.originalVideo?.size ||
      0,

    metadata: {
      duration:
        project.metadata?.duration ||
        0,

      bitrate:
        project.metadata?.bitrate ||
        0,

      width:
        project.metadata?.width ||
        0,

      height:
        project.metadata?.height ||
        0,

      fps:
        project.metadata?.fps ||
        "0",

      videoCodec:
        project.metadata?.videoCodec ||
        "Unknown",

      audioCodec:
        project.metadata?.audioCodec ||
        "Unknown"
    },

    thumbnailUrl:
      project.thumbnail?.path
        ? `file:///${project.thumbnail.path.replace(
            /\\/g,
            "/"
          )}`
        : null,

    thumbnailPath:
      project.thumbnail?.path ||
      null,

    thumbnailTimestamp:
      project.thumbnail?.timestamp ||
      null,

    waveformUrl:
      project.waveform?.path
        ? `file:///${project.waveform.path.replace(
            /\\/g,
            "/"
          )}`
        : null,

    waveformPath:
      project.waveform?.path ||
      null,

    hookCandidates,

    generatedClips:
      getGeneratedClips(
        projectRoot
      )
  };
}

module.exports = {
  getProjectsRoot,
  getProjects,
  openProject
};