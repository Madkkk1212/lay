// ================ MUSIC PLAYER FUNCTIONALITY ================
let currentAudio = document.getElementById("bgm");
let isPlaying = true;
let currentSongIndex = 0;

// Playlist data
const playlist = [
  {
    title: "Untuk Laysa",
    artist: "Special Song",
    src: "audio/123456.mp3",
    duration: "3:45",
  },
  {
    title: "Baby Angel",
    artist: "Siapaaja",
    src: "audio/angelbaby.mp3",
    duration: "4:20",
  },
  {
    title: "Favorite Girl",
    artist: "Justin Bieber",
    src: "audio/favoritegirl.mp3",
    duration: "4:14",
  },
];

// Initialize music player
function initMusicPlayer() {
  const playlistItems = document.getElementById("playlistItems");

  // Load playlist items
  playlist.forEach((song, index) => {
    const item = document.createElement("div");
    item.className = "playlist-item";
    if (index === currentSongIndex) {
      item.classList.add("active");
    }

    item.innerHTML = `
            <div class="play-icon">
                <i class="fas fa-play"></i>
            </div>
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-duration">${song.duration}</div>
        `;

    item.onclick = () => playSong(index);
    playlistItems.appendChild(item);
  });

  // Music player click event
  document.getElementById("musicPlayer").onclick = togglePlaylist;

  // Update progress bar
  currentAudio.addEventListener("timeupdate", updateProgressBar);
  currentAudio.addEventListener("ended", nextSong);

  // Set initial progress
  updateProgressBar();
}

function togglePlaylist() {
  const playlistPanel = document.getElementById("playlistPanel");
  playlistPanel.style.display =
    playlistPanel.style.display === "block" ? "none" : "block";
}

function togglePlay() {
  const playPauseIcon = document.getElementById("playPauseIcon");

  if (isPlaying) {
    currentAudio.pause();
    playPauseIcon.classList.remove("fa-pause");
    playPauseIcon.classList.add("fa-play");
  } else {
    currentAudio.play();
    playPauseIcon.classList.remove("fa-play");
    playPauseIcon.classList.add("fa-pause");
  }

  isPlaying = !isPlaying;
}

function playSong(index) {
  // Update active song
  document.querySelectorAll(".playlist-item").forEach((item, i) => {
    item.classList.toggle("active", i === index);
  });

  currentSongIndex = index;
  const song = playlist[index];

  // Change audio source
  currentAudio.src = song.src;
  currentAudio.load();
  currentAudio.play();

  // Update play/pause button
  document.getElementById("playPauseIcon").classList.remove("fa-play");
  document.getElementById("playPauseIcon").classList.add("fa-pause");
  isPlaying = true;

  // Update current time
  updateProgressBar();
}

function nextSong() {
  let nextIndex = currentSongIndex + 1;
  if (nextIndex >= playlist.length) {
    nextIndex = 0;
  }
  playSong(nextIndex);
}

function previousSong() {
  let prevIndex = currentSongIndex - 1;
  if (prevIndex < 0) {
    prevIndex = playlist.length - 1;
  }
  playSong(prevIndex);
}

function updateProgressBar() {
  const progress = document.getElementById("songProgress");
  const currentTime = document.getElementById("currentTime");

  if (currentAudio.duration) {
    const percentage = (currentAudio.currentTime / currentAudio.duration) * 100;
    progress.style.width = percentage + "%";

    // Format time
    const minutes = Math.floor(currentAudio.currentTime / 60);
    const seconds = Math.floor(currentAudio.currentTime % 60);
    currentTime.textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}

function seekSong(event) {
  const progressBar = event.currentTarget;
  const rect = progressBar.getBoundingClientRect();
  const percentage = (event.clientX - rect.left) / rect.width;

  if (currentAudio.duration) {
    currentAudio.currentTime = percentage * currentAudio.duration;
  }
}
