let subjListItems = document.getElementsByClassName("list-group-item");
let videoId;
let player;
let isPlayerInitialized = false; // Ensure player is only initialized once

// Event listeners for the list items
for (element of subjListItems) {
  element.addEventListener("click", (e) => {
    let target = e.target;
    let url = target.getAttribute("value");

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
        playsinline: 1,
        autoplay: 0,
        controls: 1,
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
}

// YouTube player state change event handler
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    done = true;
  }
  if (event.data == YT.PlayerState.PLAYING) {
    console.log("The video is playing");
  } else if (event.data == YT.PlayerState.PAUSED) {
    console.log("The video is paused");
  } else if (event.data == YT.PlayerState.ENDED) {
    console.log("The video has ended");
  }
}

var done = false;

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
