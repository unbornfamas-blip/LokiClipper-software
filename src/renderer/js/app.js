import { initialiseVideoPlayer } from "./videoPlayer.js";
import { initialiseImportManager } from "./importManager.js";
import { initialiseTimelinePanel } from "./timelinePanel.js";
import { initialiseLayoutManager } from "./layoutManager.js";

const videoPlayer = initialiseVideoPlayer();

const { updateTimelinePanel } =
  initialiseTimelinePanel(videoPlayer);

initialiseImportManager(
  videoPlayer,
  updateTimelinePanel
);

initialiseLayoutManager();