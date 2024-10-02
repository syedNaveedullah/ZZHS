let subjListItems = document.getElementsByClassName("list-group-item");
let videoId;
let player;
let isPlayerInitialized = false;
let lastTime = 0; // Keeps track of the current time to prevent seeking
let elementID; //ID to store in DB

let playPauseBtn = document.getElementById("playPauseBtn");
let progressRange = document.getElementById("progressRange");
let fullscreenBtn = document.getElementById("fullscreenBtn");

// accessing subject value from ejs file
// console.log(subject);

// Event listeners for the list items
for (element of subjListItems) {
  element.addEventListener("click", (e) => {
    let target = e.target;
    let url = target.getAttribute("value");
    elementID = target.getAttribute("ID");

    // Call the function to remove the "active" class from all items
    makeAllUnSelect();

    // Add "active" class to the clicked item
    target.classList.add("active");

    // Get YouTube video ID from URL
    videoId = YouTubeGetID(url);

    // Change the video in the player
    changeVideo(videoId);
  });
}

// Regular expression to extract YouTube video ID
function YouTubeGetID(url) {
  var ID = "";
  url = url
    .replace(/(>|<)/gi, "")
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  } else {
    ID = url;
  }
  return ID;
}

// Change the video in the YouTube player
function changeVideo(videoId) {
  if (player && typeof player.cueVideoById === "function") {
    player.cueVideoById(videoId);
    lastTime = 0; // Reset the last time when a new video is loaded
    updateTotalTime(); // Update total time when video changes
  } else {
    console.error(
      "Player is not initialized or cueVideoById method is not available."
    );
  }
}

// Function to remove "active" class from all list items
function makeAllUnSelect() {
  for (element of subjListItems) {
    element.classList.remove("active");
  }
}

// Initialize YouTube player when the API is ready
function onYouTubeIframeAPIReady() {
  if (!isPlayerInitialized) {
    console.log("YouTube IFrame API loaded");
    player = new YT.Player("player", {
      height: 500,
      width: 900,
      videoId: "", // Default video ID (you can change this to any default video)
      playerVars: {
        autoplay: 0, // Do not autoplay the video
        controls: 1, // Hide YouTube controls
        modestbranding: 1, // Hide YouTube logo
        rel: 0, // Prevent showing related videos at the end
        showinfo: 0, // Hide video title and uploader
        iv_load_policy: 3, // Disable video annotations
        disablekb: 1, // Disable keyboard controls
        playsinline: 1, // Play videos inline on mobile
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
    isPlayerInitialized = true;
  }
}

// YouTube player ready event handler
function onPlayerReady() {
  console.log("Player is ready");

  // Update total time once the player is ready
  updateTotalTime();

  // Custom Play/Pause button functionality
  playPauseBtn.addEventListener("click", togglePlayPause);

  // Sync progress bar with video time
  setInterval(updateProgressBar, 1000);

  // Enable seeking through progress bar
  progressRange.addEventListener("input", seekVideo);

  // Fullscreen toggle button
  fullscreenBtn.addEventListener("click", toggleFullscreen);
}

// YouTube player state change event handler
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    // preventSeeking(); // Check and prevent seeking while playing
  } else if (event.data == YT.PlayerState.ENDED) {
    console.log("The video has ended");
    addVidIDtoDB();
  }
}

// =====================ADDING video ID to Data Base===========================================
function addVidIDtoDB() {
  // Use the fetch API to call the server route for updating the subject array
  fetch(`/courses/10th/${subject}/${elementID}/pushingSub`, {
    method: "POST", // Assuming this is a GET request, based on your route
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    })
    .catch((error) => {
      console.error("Error in adding video ID to DB:", error);
    });
}

// Toggle between play and pause
function togglePlayPause() {
  if (player.getPlayerState() === YT.PlayerState.PLAYING) {
    player.pauseVideo();
    playPauseBtn.textContent = "Play";
  } else {
    player.playVideo();
    playPauseBtn.textContent = "Pause";
  }
}

// Function to format time (in seconds) to mm:ss format
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Function to update the total video duration
function updateTotalTime() {
  const totalTimeElement = document.getElementById("totalTime");
  const duration = player.getDuration();
  totalTimeElement.textContent = formatTime(duration);
}

// Update the progress bar and running time as the video plays
function updateProgressBar() {
  const currentTimeElement = document.getElementById("currentTime");
  const currentTime = player.getCurrentTime();
  const duration = player.getDuration();

  // Update progress bar
  const progressPercent = (currentTime / duration) * 100;
  progressRange.value = progressPercent;

  // Update running time
  currentTimeElement.textContent = formatTime(currentTime);

  // Also, update the total time, in case video metadata loads after player initialization
  const totalTimeElement = document.getElementById("totalTime");
  totalTimeElement.textContent = formatTime(duration);
}

// Seek the video using the custom progress bar
function seekVideo() {
  const seekToTime = (progressRange.value / 100) * player.getDuration();
  player.seekTo(seekToTime, true);
}

// Fullscreen toggle function
function toggleFullscreen() {
  const iframe = player.getIframe();
  if (iframe.requestFullscreen) {
    iframe.requestFullscreen();
  } else if (iframe.mozRequestFullScreen) {
    // Firefox
    iframe.mozRequestFullScreen();
  } else if (iframe.webkitRequestFullscreen) {
    // Chrome, Safari, and Opera
    iframe.webkitRequestFullscreen();
  } else if (iframe.msRequestFullscreen) {
    // IE/Edge
    iframe.msRequestFullscreen();
  }
}

// Check if YouTube API is loaded and initialize the player if available
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    if (typeof YT !== "undefined" && YT && YT.Player) {
      console.log("YouTube IFrame API is loaded");
      // Initialize player after DOM and API load
      onYouTubeIframeAPIReady();
    } else {
      console.log("YouTube IFrame API is not loaded yet");
    }
  }, 1000); // Add a delay to ensure the API has time to load
});
