import {
  initialiseGeneratedClipsPanel
} from "./generatedClipsPanel.js";

import { 
initialiseVideoPlayer 
} from "./videoPlayer.js";

import { 
initialiseImportManager 
} from "./importManager.js";

import { 
initialiseTimelinePanel 
} from "./timelinePanel.js";

import { 
initialiseLayoutManager 
} from "./layoutManager.js";

import {
initialiseJobQueuePanel
} from "./jobQueuePanel.js";

import {
    initialiseHookReviewPanel
} from "./hookReviewPanel.js";


const videoPlayer =
  initialiseVideoPlayer();

const { updateTimelinePanel } =
  initialiseTimelinePanel(videoPlayer);

const {
    addClip
} = initialiseGeneratedClipsPanel(
    videoPlayer
);

const { renderHooks } =
  initialiseHookReviewPanel(
    videoPlayer,
    addClip
  );

initialiseImportManager(
  videoPlayer,
  updateTimelinePanel,
  renderHooks
);

initialiseLayoutManager();

const { updateJob } =
  initialiseJobQueuePanel();

window.lokiAPI.onJobUpdated(job => {
  console.log(
    "Job received in renderer:",
    job
  );

  updateJob(job);
});