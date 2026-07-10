import { initialiseVideoPlayer } from "./videoPlayer.js";
import { initialiseImportManager } from "./importManager.js";

const videoPlayer = initialiseVideoPlayer();

initialiseImportManager(videoPlayer);