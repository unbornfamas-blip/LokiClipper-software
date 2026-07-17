const path = require("path");

const {
    calculateClipRange
} = require("./clipTiming");

const {
    createClip
} = require("./clipGenerator");

async function generateClipFromHook({

    hook,

    videoPath,

    videoDuration,

    clipsDirectory,

    score = null,

    transcript = ""

}) {

    const clipRange =
        calculateClipRange(
            hook,
            videoDuration
        );

    const outputPath = path.join(

        clipsDirectory,

        `clip-${Date.now()}.mp4`

    );

    return createClip({

        inputVideo: videoPath,

        outputVideo: outputPath,

        startTime: clipRange.startTime,

        endTime: clipRange.endTime,

        score,

        transcript,

        sourceHook: hook

    });

}

module.exports = {

    generateClipFromHook

};