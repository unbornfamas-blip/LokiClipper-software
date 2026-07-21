const path = require("path");

const {
    generateClipTitle,
    makeSafeFilename
} = require("./clipTitle");

const {
    calculateClipRange
} = require("./clipTiming");

const {
    createClip
} = require("./clipGenerator");

const {
    expandMoment
} = require("../analysis/momentExpander");

async function generateClipFromHook({

    hook,

    videoPath,

    videoDuration,

    clipsDirectory,

    score = null,

    transcript = ""

}) {

    const expandedHook =
        expandMoment(
            hook,
            null
        );

    const clipRange =
        calculateClipRange(
            expandedHook,
            videoDuration
        );

    const clipTitle =
    generateClipTitle(
        transcript
    );

    const filename =
        `${makeSafeFilename(
            clipTitle
        )}.mp4`;

    const outputPath = path.join(

        clipsDirectory,

        filename

    );

    return createClip({

        inputVideo: videoPath,

        outputVideo: outputPath,

        startTime: clipRange.startTime,

        endTime: clipRange.endTime,

        score,

        transcript,

        sourceHook: expandedHook

    });

}

module.exports = {

    generateClipFromHook

};