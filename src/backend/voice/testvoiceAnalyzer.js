const path = require("path");

const {
  analyze
} = require("./voiceAnalyzer");

async function runTest() {
  const audioPath = process.argv[2];

  if (!audioPath) {
    console.error(
      "Please provide the path to an audio.wav file."
    );

    process.exitCode = 1;
    return;
  }

  try {
    console.log(
      "Analysing:",
      path.resolve(audioPath)
    );

    const result =
      await analyze(path.resolve(audioPath));

    console.log(
      JSON.stringify(result, null, 2)
    );
  } catch (error) {
    console.error(
      "Voice analysis test failed:",
      error
    );

    process.exitCode = 1;
  }
}

runTest();