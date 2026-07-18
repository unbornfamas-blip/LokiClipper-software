import { formatTime } from "./utils.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function initialiseHookReviewPanel(
  videoPlayer,
  addClip
) {
  const hookCount =
    document.getElementById("hookCount");

  const hookCandidateList =
    document.getElementById(
      "hookCandidateList"
    );

  const createClipButton =
    document.getElementById(
      "createClipBtn"
    );

  const clipActionStatus =
    document.getElementById(
      "clipActionStatus"
    );

  let selectedHook = null;
  let currentHooks = [];

  function renderHookReasons(reasons = []) {
    if (!Array.isArray(reasons)) {
      return "";
    }

    return reasons
      .map(reason => `
        <span class="hook-reason">
          ${escapeHtml(reason)}
        </span>
      `)
      .join("");
  }

  function renderHooks(hooks = []) {
    const safeHooks =
      Array.isArray(hooks) ? hooks : [];

    currentHooks = safeHooks;
    selectedHook = null;

    createClipButton.disabled = true;

    clipActionStatus.textContent =
      safeHooks.length > 0
        ? "Select a clip suggestion"
        : "No clip suggestions available";

    hookCount.textContent =
      `${safeHooks.length} Found`;

    if (safeHooks.length === 0) {
      hookCandidateList.innerHTML = `
        <div class="job-queue-empty">
          No hook candidates were found.
        </div>
      `;

      return;
    }

    hookCandidateList.innerHTML =
      safeHooks
        .map((hook, index) => `
          <button
            class="hook-card"
            type="button"
            data-hook-index="${index}"
            data-hook-start="${Number(
              hook.start || 0
            )}"
          >
            <div class="hook-card-header">
              <strong>
                Score ${Number(
                  hook.score || 0
                )}
              </strong>

              <span>
                ${formatTime(
                  Number(hook.start || 0)
                )}
              </span>
            </div>

            <p>
              ${escapeHtml(hook.text || "")}
            </p>

            <div class="hook-reasons">
              ${renderHookReasons(
                hook.reasons
              )}
            </div>
          </button>
        `)
        .join("");
  }

  hookCandidateList.addEventListener(
    "click",
    event => {
      const card =
        event.target.closest(".hook-card");

      if (!card || !videoPlayer.src) {
        return;
      }

      const hookIndex =
        Number(card.dataset.hookIndex);

      selectedHook =
        currentHooks[hookIndex];

      if (!selectedHook) {
        console.error(
          "Could not find selected hook:",
          hookIndex
        );

        return;
      }

      const hookStart =
        Number(card.dataset.hookStart);

      if (Number.isFinite(hookStart)) {
        videoPlayer.currentTime =
          hookStart;

        videoPlayer.play();
      }

      document
        .querySelectorAll(
          ".hook-card.active"
        )
        .forEach(activeCard => {
          activeCard.classList.remove(
            "active"
          );
        });

      card.classList.add("active");

      createClipButton.disabled = false;

      clipActionStatus.textContent =
        "Ready to create clip";
    }
  );

  createClipButton.addEventListener(
    "click",
    async () => {
      if (!selectedHook) {
        clipActionStatus.textContent =
          "Select a clip suggestion first";

        return;
      }

      const videoPath =
        videoPlayer.dataset.filePath;

      const clipsDirectory =
        videoPlayer.dataset.clipsDirectory;

      const videoDuration =
        Number(videoPlayer.duration);

      if (
        !videoPath ||
        !clipsDirectory ||
        !Number.isFinite(videoDuration)
      ) {
        console.error(
          "Missing clip creation data:",
          {
            videoPath,
            clipsDirectory,
            videoDuration
          }
        );

        clipActionStatus.textContent =
          "Clip data is missing";

        return;
      }

      createClipButton.disabled = true;

      clipActionStatus.textContent =
        "Creating clip...";

      try {
        const clip =
          await window.lokiAPI.createClip({
            hook: selectedHook,
            videoPath,
            videoDuration,
            clipsDirectory,
            score: selectedHook.score,
            transcript:
              selectedHook.text || ""
          });

        const clipDisplayName =
        selectedHook.text
            .replace(/[<>:"/\\|?*]/g, "")
            .trim()
            .split(/\s+/)
            .slice(0, 6)
            .join(" ");

        addClip({
        name:
            clipDisplayName ||
            `Clip ${Date.now()}`,
        path: clip.outputPath,
        score: selectedHook.score,
        duration: clip.duration
        });

        console.log(
          "Clip created:",
          clip
        );

        clipActionStatus.textContent =
          "Clip created successfully";
      } catch (error) {
        console.error(
          "Clip creation failed:",
          error
        );

        clipActionStatus.textContent =
          "Clip creation failed";
      } finally {
        createClipButton.disabled = false;
      }
    }
  );

  renderHooks();

  return {
    renderHooks,

    getSelectedHook() {
      return selectedHook;
    }
  };
}