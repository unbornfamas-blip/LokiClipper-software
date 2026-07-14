const fs = require("fs");

function parseTranscript(jsonPath) {

    const json = JSON.parse(
        fs.readFileSync(jsonPath, "utf8")
    );

    const segments = json.transcription ?? [];

    return segments.map(segment => ({

        start: segment.offsets.from / 1000,

        end: segment.offsets.to / 1000,

        duration:
            (segment.offsets.to -
             segment.offsets.from) / 1000,

        text:
            segment.text.trim()

    }));

}

module.exports = {
    parseTranscript
};