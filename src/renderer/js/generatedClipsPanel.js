export function initialiseGeneratedClipsPanel(
    videoPlayer
) {

  const clipList =
    document.getElementById(
      "generatedClipList"
    );

  const clipCount =
    document.getElementById(
      "generatedClipCount"
    );

  const clips = [];

  function render() {

    clipCount.textContent =
      `${clips.length} Clip${
        clips.length === 1 ? "" : "s"
      }`;

    if (clips.length === 0) {

      clipList.innerHTML = `
        <div class="job-queue-empty">
          Created clips will appear here.
        </div>
      `;

      return;

    }

    clipList.innerHTML =
      clips.map(clip => `
        <button
          class="generated-clip-card"
          type="button"
          data-clip-path="${clip.path}"
        >

          <strong>
            ${clip.name}
          </strong>

          <p>
            Score: ${clip.score}
          </p>

        </button>
      `).join("");

  }

  function addClip(clip) {

    clips.unshift(clip);

    render();

  }

  render();

clipList.addEventListener(
  "click",
  async event => {
    const card =
      event.target.closest(
        ".generated-clip-card"
      );

    if (!card) {
      return;
    }

    const clipPath =
      card.dataset.path;

    console.log(
      "Opening generated clip:",
      clipPath
    );

    if (!clipPath) {
      console.error(
        "Generated clip has no file path."
      );

      return;
    }

    const fileUrl = encodeURI(
      `file:///${clipPath.replace(/\\/g, "/")}`
    );

    console.log(
      "Generated clip URL:",
      fileUrl
    );

    videoPlayer.pause();
    videoPlayer.src = fileUrl;
    videoPlayer.load();

    try {
      await videoPlayer.play();
      videoPlayer.focus();
    } catch (error) {
      console.error(
        "Generated clip preview failed:",
        error
      );
    }
  }
);

  return {
    addClip
  };

}