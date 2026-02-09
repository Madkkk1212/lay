// ================ MAIN SCRIPT ================

// Variabel global
let totalScore = localStorage.getItem("totalScore")
  ? parseInt(localStorage.getItem("totalScore"))
  : 0;
let gamesPlayed = localStorage.getItem("gamesPlayed")
  ? parseInt(localStorage.getItem("gamesPlayed"))
  : 0;

// Loading Screen
window.addEventListener("load", function () {
  setTimeout(function () {
    document.getElementById("loading").classList.add("hidden");
    setTimeout(function () {
      document.getElementById("loading").style.display = "none";
    }, 500);
  }, 1000);
});

// ================ NAVIGATION FUNCTIONS ================
function showMain() {
  document.getElementById("mainPage").style.display = "flex";
  document.getElementById("ucapanPage").style.display = "none";
  document.getElementById("galeriPage").style.display = "none";
  document.getElementById("gameMenuPage").style.display = "none";
  document.getElementById("lockedMenuPage").style.display = "none";
}

function showUcapan() {
  document.getElementById("mainPage").style.display = "none";
  document.getElementById("ucapanPage").style.display = "block";
  document.getElementById("galeriPage").style.display = "none";
  document.getElementById("gameMenuPage").style.display = "none";
  document.getElementById("lockedMenuPage").style.display = "none";
}

function showGaleri() {
  document.getElementById("mainPage").style.display = "none";
  document.getElementById("ucapanPage").style.display = "none";
  document.getElementById("galeriPage").style.display = "block";
  document.getElementById("gameMenuPage").style.display = "none";
  document.getElementById("lockedMenuPage").style.display = "none";
  initGaleri();
}

function showGameMenu() {
  document.getElementById("mainPage").style.display = "none";
  document.getElementById("ucapanPage").style.display = "none";
  document.getElementById("galeriPage").style.display = "none";
  document.getElementById("gameMenuPage").style.display = "block";
  document.getElementById("lockedMenuPage").style.display = "none";
  updateGameStats();
}

function showLockedMenu() {
  document.getElementById("mainPage").style.display = "none";
  document.getElementById("lockedMenuPage").style.display = "block";
  document.getElementById("secretRoom").style.display = "none";
  document.getElementById("passwordInput").value = "";
  document.getElementById("passwordMessage").textContent = "";
  document.getElementById("passwordInput").type = "password";
  document.getElementById("eyeIcon").classList.remove("fa-eye-slash");
  document.getElementById("eyeIcon").classList.add("fa-eye");
}

// ================ GAME STATS ================
function updateGameStats() {
  document.getElementById("totalScore").textContent = totalScore;
  document.getElementById("gamesPlayed").textContent = gamesPlayed;
}

function incrementGamesPlayed() {
  gamesPlayed++;
  localStorage.setItem("gamesPlayed", gamesPlayed);
  updateGameStats();
}

function addToTotalScore(points) {
  totalScore += points;
  localStorage.setItem("totalScore", totalScore);
  updateGameStats();
}

// ================ FLOATING HEARTS ================
function createHearts() {
  const container = document.getElementById("floatingHearts");
  const total = 15;

  for (let i = 0; i < total; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "❤";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDelay = Math.random() * 5 + "s";
    heart.style.fontSize = Math.random() * 20 + 10 + "px";
    container.appendChild(heart);
  }
}

// ================ INITIALIZATION ================
document.addEventListener("DOMContentLoaded", function () {
  showMain();
  createHearts();
  updateGameStats();

  // Inisialisasi greeting message
  if (typeof updateGreeting === "function") {
    updateGreeting();
  }

  // Inisialisasi music player
  if (typeof initMusicPlayer === "function") {
    initMusicPlayer();
  }

  // Event listener untuk modal
  window.addEventListener("click", (e) => {
    const modal = document.getElementById("imageModal");
    if (e.target === modal) modal.style.display = "none";
  });

  // Tambahkan CSS animation untuk fade in/out
  const style = document.createElement("style");
  style.textContent = `
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            10%, 90% { opacity: 0.8; }
        }
    `;
  document.head.appendChild(style);
});
