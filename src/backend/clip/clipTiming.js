const DEFAULT_CLIP_SETTINGS = {

    paddingBefore: 5,

    paddingAfter: 12,

    minimumLength: 20,

    maximumLength: 60

};

function calculateClipRange(
    hook,
    videoDuration,
    settings = DEFAULT_CLIP_SETTINGS
) {

    if (!hook) {
        throw new Error(
            "No hook was supplied."
        );
    }

    let startTime =
        Math.max(
            0,
            hook.start - settings.paddingBefore
        );

    let endTime =
        Math.min(
            videoDuration,
            hook.end + settings.paddingAfter
        );

    let duration =
        endTime - startTime;

    if (
        duration <
        settings.minimumLength
    ) {

        endTime = Math.min(
            videoDuration,
            startTime +
            settings.minimumLength
        );

        duration =
            endTime - startTime;

    }

    if (
        duration >
        settings.maximumLength
    ) {

        endTime =
            startTime +
            settings.maximumLength;

        duration =
            endTime - startTime;

    }

    return {

        startTime,

        endTime,

        duration

    };

}

module.exports = {

    DEFAULT_CLIP_SETTINGS,

    calculateClipRange

};