// Music Player Controls - Shared JavaScript

// Format time as MM:SS
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Initialize music player controls
function initMusicPlayer(bgMusicElement) {
  const playPauseBtn = document.getElementById("playPauseBtn");
  const playIcon = document.getElementById("playIcon");
  const pauseIcon = document.getElementById("pauseIcon");
  const timeline = document.getElementById("timeline");
  const timelineProgress = document.getElementById("timelineProgress");
  const currentTimeDisplay = document.getElementById("currentTime");
  const durationDisplay = document.getElementById("duration");

  if (!playPauseBtn || !timeline) {
    console.error("Music player elements not found");
    return;
  }

  // Update play/pause button icon
  function updatePlayPauseIcon() {
    if (bgMusicElement.paused) {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    } else {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    }
  }

  // Toggle play/pause
  playPauseBtn.addEventListener("click", () => {
    if (bgMusicElement.paused) {
      bgMusicElement
        .play()
        .then(() => {
          localStorage.setItem("valentine_music_started", "true");
          updatePlayPauseIcon();
        })
        .catch((error) => {
          console.log("Play failed:", error);
        });
    } else {
      bgMusicElement.pause();
      updatePlayPauseIcon();
    }
  });

  // Update timeline as music plays
  bgMusicElement.addEventListener("timeupdate", () => {
    if (bgMusicElement.duration) {
      const progress =
        (bgMusicElement.currentTime / bgMusicElement.duration) * 100;
      timelineProgress.style.width = progress + "%";
      currentTimeDisplay.textContent = formatTime(bgMusicElement.currentTime);
    }
  });

  // Set duration when metadata loads
  bgMusicElement.addEventListener("loadedmetadata", () => {
    durationDisplay.textContent = formatTime(bgMusicElement.duration);
  });

  // If duration is already available
  if (bgMusicElement.duration) {
    durationDisplay.textContent = formatTime(bgMusicElement.duration);
  }

  // Seek functionality
  timeline.addEventListener("click", (e) => {
    const rect = timeline.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    bgMusicElement.currentTime = percentage * bgMusicElement.duration;
  });

  // Update icon on play/pause events
  bgMusicElement.addEventListener("play", updatePlayPauseIcon);
  bgMusicElement.addEventListener("pause", updatePlayPauseIcon);

  // Initialize icon state
  updatePlayPauseIcon();
}
