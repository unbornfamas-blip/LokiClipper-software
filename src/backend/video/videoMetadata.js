const ffprobe = require("ffprobe-static");
const { execFile } = require("child_process");

function getVideoMetadata(videoPath) {
    return new Promise((resolve, reject) => {

        execFile(
            ffprobe.path,
            [
                "-v",
                "quiet",
                "-print_format",
                "json",
                "-show_format",
                "-show_streams",
                videoPath
            ],

            (error, stdout) => {

                if (error) {
                    reject(error);
                    return;
                }

                try {

                    const data = JSON.parse(stdout);

                    const videoStream = data.streams.find(
                        stream => stream.codec_type === "video"
                    );

                    const audioStream = data.streams.find(
                        stream => stream.codec_type === "audio"
                    );

                    resolve({

                        duration: Number(data.format.duration),

                        bitrate: Number(data.format.bit_rate),

                        width: videoStream?.width,

                        height: videoStream?.height,

                        fps: videoStream?.r_frame_rate,

                        videoCodec: videoStream?.codec_name,

                        audioCodec: audioStream?.codec_name

                    });

                }

                catch (err) {

                    reject(err);

                }

            }

        );

    });
}

module.exports = {

    getVideoMetadata

};