import { initialiseVideoPlayer } from "./videoPlayer.js";
import { initialiseImportManager } from "./importManager.js";
import { initialiseTimelinePanel } from "./timelinePanel.js";
import { initialiseLayoutManager } from "./layoutManager.js";
import {
  initialiseJobQueuePanel
} from "./jobQueuePanel.js";

const videoPlayer = initialiseVideoPlayer();

const { updateTimelinePanel } =
  initialiseTimelinePanel(videoPlayer);

initialiseImportManager(
  videoPlayer,
  updateTimelinePanel
);

initialiseLayoutManager();

const {updateJob} = initialiseJobQueuePanel();

window.lokiAPI.onJobUpdated(job => {
  console.log("Job received in renderer:", job);
  updateJob(job);
});