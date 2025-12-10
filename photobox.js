// ==============================
// PHOTOBOOTH.JS - MAIN LOGIC
// ==============================

// Global Variables
let currentStream = null;
let isCameraActive = false;
let isFrontCamera = true;
let mirrorMode = "auto";
let currentSession = null;

// Session Variables
let totalPhotos = 4; // Default 4 photos
let timerSeconds = 3; // Default 3 seconds
let selectedLayout = "single";
let selectedFrame = "classic";
let frameColor = "#FFD700";
let frameThickness = 15;
let frameOpacity = 100;
let frameStyle = "solid";

// Session Data
let sessionPhotos = [];
let currentPhotoIndex = 0;
let isSessionActive = false;
let sessionTimer = null;
let countdownTimer = null;
let sessionStartTime = null;

// Editor Variables
let editingPhotoIndex = null;
let currentStickers = [];
let editedPhotos = [];

// Initialize Photobooth
document.addEventListener("DOMContentLoaded", function () {
  console.log("🎪 Photobooth Initializing...");

  // Load saved data
  loadSavedData();

  // Initialize UI
  initializeUI();

  // Setup event listeners
  setupEventListeners();

  // Initialize camera overlay
  updateCameraOverlay();

  console.log("🎪 Photobooth Ready!");
});

// Load saved data from localStorage
function loadSavedData() {
  try {
    const savedSession = localStorage.getItem("photoboothSession");
    if (savedSession) {
      const data = JSON.parse(savedSession);
      totalPhotos = data.totalPhotos || 4;
      timerSeconds = data.timerSeconds || 3;
      selectedLayout = data.selectedLayout || "single";
      selectedFrame = data.selectedFrame || "classic";
      frameColor = data.frameColor || "#FFD700";
    }
  } catch (error) {
    console.error("Error loading saved data:", error);
  }
}

// Save data to localStorage
function saveData() {
  try {
    const data = {
      totalPhotos,
      timerSeconds,
      selectedLayout,
      selectedFrame,
      frameColor,
      lastSession: new Date().toISOString(),
    };
    localStorage.setItem("photoboothSession", JSON.stringify(data));
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

// Initialize UI elements
function initializeUI() {
  // Set initial values
  updatePhotoCountUI();
  updateTimerUI();
  updateLayoutUI();
  updateFrameUI();

  // Initialize session timer
  updateSessionTimer();
  setInterval(updateSessionTimer, 1000);
}

// Setup event listeners
function setupEventListeners() {
  // Camera controls
  document
    .getElementById("toggleCameraBtn")
    .addEventListener("click", toggleCamera);
  document
    .getElementById("startSessionBtn")
    .addEventListener("click", startPhotoSession);
  document
    .getElementById("flipCameraBtn")
    .addEventListener("click", flipCamera);
  document
    .getElementById("toggleMirrorBtn")
    .addEventListener("click", toggleMirrorMode);

  // Timer slider
  const timerSlider = document.getElementById("timerSlider");
  if (timerSlider) {
    timerSlider.addEventListener("input", function () {
      timerSeconds = parseInt(this.value);
      document.getElementById("timerValue").textContent = timerSeconds;
    });
  }

  // Frame controls
  const frameThicknessSlider = document.getElementById("frameThickness");
  if (frameThicknessSlider) {
    frameThicknessSlider.addEventListener("input", function () {
      frameThickness = parseInt(this.value);
      document.getElementById("thicknessValue").textContent =
        frameThickness + "px";
      updateCameraOverlay();
    });
  }

  const frameOpacitySlider = document.getElementById("frameOpacity");
  if (frameOpacitySlider) {
    frameOpacitySlider.addEventListener("input", function () {
      frameOpacity = parseInt(this.value);
      document.getElementById("opacityValue").textContent = frameOpacity + "%";
      updateCameraOverlay();
    });
  }

  const frameStyleSelect = document.getElementById("frameStyle");
  if (frameStyleSelect) {
    frameStyleSelect.addEventListener("change", function () {
      frameStyle = this.value;
      updateCameraOverlay();
    });
  }

  // Mirror mode radio buttons
  const mirrorRadios = document.querySelectorAll('input[name="mirrorMode"]');
  mirrorRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      updateMirrorMode(this.value);
    });
  });

  // Edit controls
  document
    .getElementById("resetEditBtn")
    .addEventListener("click", resetEditor);
  document
    .getElementById("autoEnhanceBtn")
    .addEventListener("click", autoEnhance);
  document
    .getElementById("saveAllBtn")
    .addEventListener("click", saveAllPhotos);
  document
    .getElementById("downloadAllBtn")
    .addEventListener("click", downloadAllPhotos);

  // Output controls
  document
    .getElementById("createCollageBtn")
    .addEventListener("click", createFinalCollage);
}

// Update session timer display
function updateSessionTimer() {
  if (!sessionStartTime) return;

  const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  document.getElementById("sessionTimer").textContent = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Update UI for photo count
function updatePhotoCountUI() {
  // Update active button
  document.querySelectorAll(".count-option").forEach((btn) => {
    const count = parseInt(btn.getAttribute("data-count"));
    btn.classList.toggle("active", count === totalPhotos);
  });

  // Update info display
  document.getElementById(
    "currentPhotoCount"
  ).textContent = `${totalPhotos} foto`;
}

// Update UI for timer
function updateTimerUI() {
  document.getElementById("timerValue").textContent = timerSeconds;
  document.getElementById("timerSlider").value = timerSeconds;

  // Update preset buttons
  document.querySelectorAll(".timer-preset").forEach((btn) => {
    const time = parseInt(btn.getAttribute("data-time"));
    btn.classList.toggle("active", time === timerSeconds);
  });
}

// Update UI for layout
function updateLayoutUI() {
  document.querySelectorAll(".layout-option").forEach((btn) => {
    btn.classList.toggle(
      "active",
      btn.getAttribute("data-layout") === selectedLayout
    );
  });

  document.getElementById("selectedLayout").textContent =
    selectedLayout === "single"
      ? "Single"
      : selectedLayout === "2x2"
      ? "2x2 Grid"
      : selectedLayout === "3x3"
      ? "3x3 Grid"
      : selectedLayout === "4x4"
      ? "4x4 Grid"
      : "Collage";
}

// Update UI for frame
function updateFrameUI() {
  document.querySelectorAll(".frame-option").forEach((btn) => {
    btn.classList.toggle(
      "active",
      btn.getAttribute("data-frame") === selectedFrame
    );
  });

  document.querySelectorAll(".color-option").forEach((btn) => {
    const color = btn.getAttribute("data-color");
    btn.classList.toggle("active", color === frameColor);
  });
}

// ==============================
// CAMERA CONTROLS
// ==============================

// Toggle camera on/off
async function toggleCamera() {
  try {
    if (!isCameraActive) {
      await startCamera();
    } else {
      stopCamera();
    }
  } catch (error) {
    console.error("Error toggling camera:", error);
    showNotification("Gagal mengakses kamera", "error");
  }
}

// Start camera
async function startCamera() {
  try {
    // Stop previous stream if exists
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
    }

    // Request camera access
    const constraints = {
      video: {
        facingMode: isFrontCamera ? "user" : "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    };

    currentStream = await navigator.mediaDevices.getUserMedia(constraints);

    // Set video source
    const video = document.getElementById("cameraStream");
    video.srcObject = currentStream;

    // Hide placeholder
    document.getElementById("cameraPlaceholder").style.display = "none";

    // Update status
    isCameraActive = true;
    updateCameraStatus();
    updateButtonStates();

    // Apply mirror mode
    applyMirrorToVideo();

    // Update camera overlay
    updateCameraOverlay();

    showNotification("Kamera aktif! Siap untuk sesi foto.", "success");
  } catch (error) {
    console.error("Error starting camera:", error);

    let message = "Tidak dapat mengakses kamera. ";
    if (error.name === "NotAllowedError") {
      message =
        "Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.";
    } else if (error.name === "NotFoundError") {
      message = "Kamera tidak ditemukan pada perangkat ini.";
    } else if (error.name === "NotReadableError") {
      message = "Kamera sedang digunakan oleh aplikasi lain.";
    } else {
      message = error.message;
    }

    showNotification(message, "error");

    // Show placeholder
    document.getElementById("cameraPlaceholder").style.display = "flex";
    isCameraActive = false;
    updateCameraStatus();
  }
}

// Stop camera
function stopCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
    currentStream = null;
  }

  // Clear video source
  const video = document.getElementById("cameraStream");
  video.srcObject = null;

  // Show placeholder
  document.getElementById("cameraPlaceholder").style.display = "flex";

  // Update status
  isCameraActive = false;
  updateCameraStatus();
  updateButtonStates();

  showNotification("Kamera dimatikan", "info");
}

// Update camera status display
function updateCameraStatus() {
  const statusDot = document.querySelector(".status-dot");
  const statusText = document.getElementById("cameraStatus");
  const toggleBtn = document.getElementById("toggleCameraBtn");

  if (isCameraActive) {
    statusDot.style.background = "#28a745";
    statusText.textContent = "Kamera Aktif";
    toggleBtn.innerHTML =
      '<i class="fas fa-power-off"></i><span>MATIKAN KAMERA</span>';
  } else {
    statusDot.style.background = "#dc3545";
    statusText.textContent = "Kamera Mati";
    toggleBtn.innerHTML =
      '<i class="fas fa-power-off"></i><span>HIDUPKAN KAMERA</span>';
  }
}

// Update button states
function updateButtonStates() {
  const startSessionBtn = document.getElementById("startSessionBtn");
  const flipBtn = document.getElementById("flipCameraBtn");
  const mirrorBtn = document.getElementById("toggleMirrorBtn");

  // Enable/disable based on camera status
  startSessionBtn.disabled = !isCameraActive;
  flipBtn.disabled = !isCameraActive;
  mirrorBtn.disabled = !isCameraActive;
}

// Flip camera (front/back)
async function flipCamera() {
  if (!isCameraActive) {
    showNotification("Nyalakan kamera terlebih dahulu", "warning");
    return;
  }

  isFrontCamera = !isFrontCamera;

  try {
    // Stop current stream
    currentStream.getTracks().forEach((track) => track.stop());

    // Start with new facing mode
    await startCamera();

    showNotification(
      `Berpindah ke kamera ${isFrontCamera ? "depan" : "belakang"}`,
      "success"
    );
  } catch (error) {
    console.error("Error flipping camera:", error);
    showNotification("Gagal mengganti kamera", "error");
  }
}

// Toggle mirror mode
function toggleMirrorMode() {
  const modes = ["auto", "mirror", "no-mirror"];
  const currentIndex = modes.indexOf(mirrorMode);
  const nextIndex = (currentIndex + 1) % modes.length;
  mirrorMode = modes[nextIndex];

  // Update button icon and tooltip
  const button = document.getElementById("toggleMirrorBtn");
  const icons = {
    auto: "fa-camera",
    mirror: "fa-exchange-alt",
    "no-mirror": "fa-ban",
  };

  button.innerHTML = `<i class="fas ${icons[mirrorMode]}"></i>
                       <span class="tooltip">Mirror: ${
                         mirrorMode === "auto"
                           ? "Auto"
                           : mirrorMode === "mirror"
                           ? "ON"
                           : "OFF"
                       }</span>`;

  // Update radio button
  document.querySelector(
    `input[name="mirrorMode"][value="${mirrorMode}"]`
  ).checked = true;

  // Apply to video
  applyMirrorToVideo();

  showNotification(
    `Mirror mode: ${
      mirrorMode === "auto"
        ? "Auto"
        : mirrorMode === "mirror"
        ? "Selalu ON"
        : "OFF"
    }`,
    "info"
  );
}

// Update mirror mode from radio buttons
function updateMirrorMode(mode) {
  mirrorMode = mode;

  // Update toggle button
  const button = document.getElementById("toggleMirrorBtn");
  const icons = {
    auto: "fa-camera",
    mirror: "fa-exchange-alt",
    "no-mirror": "fa-ban",
  };

  button.innerHTML = `<i class="fas ${icons[mirrorMode]}"></i>
                       <span class="tooltip">Mirror: ${
                         mirrorMode === "auto"
                           ? "Auto"
                           : mirrorMode === "mirror"
                           ? "ON"
                           : "OFF"
                       }</span>`;

  // Apply to video
  applyMirrorToVideo();
}

// Apply mirror effect to video
function applyMirrorToVideo() {
  const video = document.getElementById("cameraStream");
  if (!video) return;

  video.classList.remove("mirror");

  if (mirrorMode === "mirror") {
    video.classList.add("mirror");
  } else if (mirrorMode === "auto" && isFrontCamera) {
    video.classList.add("mirror");
  }
}

// Update camera overlay with frame
function updateCameraOverlay() {
  const overlay = document.getElementById("cameraOverlayFrame");
  if (!overlay) return;

  // Clear previous styles
  overlay.style.border = "none";
  overlay.style.borderRadius = "15px";

  // Apply frame based on selected style
  const opacity = frameOpacity / 100;
  const thickness = frameThickness + "px";

  switch (frameStyle) {
    case "solid":
      overlay.style.border = `${thickness} solid ${hexToRgba(
        frameColor,
        opacity
      )}`;
      break;
    case "dashed":
      overlay.style.border = `${thickness} dashed ${hexToRgba(
        frameColor,
        opacity
      )}`;
      break;
    case "dotted":
      overlay.style.border = `${thickness} dotted ${hexToRgba(
        frameColor,
        opacity
      )}`;
      break;
    case "double":
      overlay.style.border = `${thickness} double ${hexToRgba(
        frameColor,
        opacity
      )}`;
      break;
    case "groove":
      overlay.style.border = `${thickness} groove ${hexToRgba(
        frameColor,
        opacity
      )}`;
      break;
  }

  // Add frame decoration based on selected frame type
  switch (selectedFrame) {
    case "royal":
      overlay.style.boxShadow = `0 0 0 ${
        frameThickness / 2
      }px rgba(255, 215, 0, 0.3) inset`;
      break;
    case "heart":
      overlay.style.borderRadius = "50%";
      break;
    case "floral":
      overlay.style.boxShadow = `0 0 20px ${hexToRgba(frameColor, opacity)}`;
      break;
    case "diamond":
      overlay.style.borderImage = `repeating-linear-gradient(45deg, ${frameColor}, transparent 10px) 30`;
      break;
  }
}

// Helper: Convert hex to rgba
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ==============================
// PHOTO SESSION CONTROLS
// ==============================

// Select photo count
function selectPhotoCount(count) {
  totalPhotos = count;
  updatePhotoCountUI();
  saveData();
  showNotification(`Akan mengambil ${count} foto`, "info");
}

// Set timer
function setTimer(seconds) {
  timerSeconds = seconds;
  updateTimerUI();
  saveData();
  showNotification(`Timer diatur ke ${seconds} detik`, "info");
}

// Select layout
function selectLayout(layout) {
  selectedLayout = layout;
  updateLayoutUI();
  saveData();
  showNotification(`Layout diatur ke ${layout}`, "info");
}

// Select frame
function selectFrame(frame) {
  selectedFrame = frame;
  updateFrameUI();
  updateCameraOverlay();
  saveData();
  showNotification(`Bingkai diatur ke ${frame}`, "info");
}

// Select frame color
function selectFrameColor(color) {
  frameColor = color;
  updateFrameUI();
  updateCameraOverlay();
  saveData();
  showNotification(`Warna bingkai diubah`, "info");
}

// Start photo session
function startPhotoSession() {
  if (!isCameraActive) {
    showNotification("Nyalakan kamera terlebih dahulu", "warning");
    return;
  }

  if (isSessionActive) {
    showNotification("Sesi foto sedang berjalan", "warning");
    return;
  }

  // Reset session data
  sessionPhotos = [];
  currentPhotoIndex = 0;
  editedPhotos = [];

  // Initialize session
  isSessionActive = true;
  sessionStartTime = Date.now();

  // Show progress bar
  document.getElementById("sessionProgress").style.display = "block";
  updateSessionProgress();

  // Disable settings during session
  disableSessionSettings();

  // Start first photo
  startNextPhoto();

  showNotification(
    `Sesi foto dimulai! Akan mengambil ${totalPhotos} foto`,
    "success"
  );
}

// Start next photo in session
function startNextPhoto() {
  if (currentPhotoIndex >= totalPhotos) {
    endPhotoSession();
    return;
  }

  // Update progress
  updateSessionProgress();

  // Show countdown
  showCountdown();

  // Start timer for photo
  let countdown = timerSeconds;

  // Update countdown display
  const countdownElement = document.getElementById("countdownNumber");
  countdownElement.textContent = countdown;

  countdownTimer = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown;

    if (countdown <= 0) {
      clearInterval(countdownTimer);
      takePhoto();
    }
  }, 1000);
}

// Show countdown overlay
function showCountdown() {
  const countdownOverlay = document.getElementById("countdownOverlay");
  const timerDisplay = document.getElementById("timerDisplay");

  countdownOverlay.style.display = "flex";
  timerDisplay.style.display = "none";

  // Hide countdown after 1 second delay
  setTimeout(() => {
    countdownOverlay.style.display = "none";
    timerDisplay.style.display = "flex";

    // Start timer animation
    startTimerAnimation();
  }, 1000);
}

// Start timer animation
function startTimerAnimation() {
  const timerText = document.getElementById("timerText");
  const timerProgress = document.querySelector(".timer-progress");
  let timeLeft = timerSeconds;

  timerText.textContent = timeLeft;

  const timerInterval = setInterval(() => {
    timeLeft--;
    timerText.textContent = timeLeft;

    // Update progress circle
    const progress = ((timerSeconds - timeLeft) / timerSeconds) * 100;
    timerProgress.style.background = `conic-gradient(#ff6b6b 0% ${progress}%, transparent ${progress}% 100%)`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerDisplay.style.display = "none";
    }
  }, 1000);
}

// Take photo
function takePhoto() {
  try {
    const video = document.getElementById("cameraStream");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Apply mirror if needed
    if (mirrorMode === "mirror" || (mirrorMode === "auto" && isFrontCamera)) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get data URL
    const photoData = canvas.toDataURL("image/png");

    // Add to session photos
    sessionPhotos.push({
      index: currentPhotoIndex,
      data: photoData,
      timestamp: Date.now(),
      stickers: [],
      frame: {
        type: selectedFrame,
        color: frameColor,
        thickness: frameThickness,
        opacity: frameOpacity,
        style: frameStyle,
      },
    });

    // Update UI
    currentPhotoIndex++;
    document.getElementById("photosTaken").textContent = currentPhotoIndex;
    updateSessionProgress();

    // Play capture sound
    playCaptureSound();

    // Show notification
    showNotification(
      `Foto ${currentPhotoIndex}/${totalPhotos} berhasil diambil!`,
      "success"
    );

    // Wait 1 second before next photo
    setTimeout(() => {
      startNextPhoto();
    }, 1000);
  } catch (error) {
    console.error("Error taking photo:", error);
    showNotification("Gagal mengambil foto", "error");
    startNextPhoto(); // Continue to next photo anyway
  }
}

// Update session progress
function updateSessionProgress() {
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const progressCount = document.getElementById("progressCount");

  if (!isSessionActive) {
    progressText.textContent = "Sesi belum dimulai";
    progressCount.textContent = "0/0";
    progressFill.style.width = "0%";
    return;
  }

  const progress = (currentPhotoIndex / totalPhotos) * 100;
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `Mengambil foto ${
    currentPhotoIndex + 1
  } dari ${totalPhotos}`;
  progressCount.textContent = `${currentPhotoIndex}/${totalPhotos}`;
}

// End photo session
function endPhotoSession() {
  isSessionActive = false;

  // Hide progress bar
  setTimeout(() => {
    document.getElementById("sessionProgress").style.display = "none";
  }, 1000);

  // Enable settings
  enableSessionSettings();

  // Update results display
  displaySessionResults();

  // Show session complete modal
  showSessionCompleteModal();

  // Save session data
  saveSessionData();

  showNotification("Sesi foto selesai!", "success");
}

// Disable settings during session
function disableSessionSettings() {
  document.getElementById("toggleCameraBtn").disabled = true;
  document.getElementById("startSessionBtn").disabled = true;
  document
    .querySelectorAll(".count-option")
    .forEach((btn) => (btn.style.opacity = "0.5"));
  document
    .querySelectorAll(".timer-preset")
    .forEach((btn) => (btn.style.opacity = "0.5"));
  document
    .querySelectorAll(".layout-option")
    .forEach((btn) => (btn.style.opacity = "0.5"));
}

// Enable settings after session
function enableSessionSettings() {
  document.getElementById("toggleCameraBtn").disabled = false;
  document.getElementById("startSessionBtn").disabled = false;
  document
    .querySelectorAll(".count-option")
    .forEach((btn) => (btn.style.opacity = "1"));
  document
    .querySelectorAll(".timer-preset")
    .forEach((btn) => (btn.style.opacity = "1"));
  document
    .querySelectorAll(".layout-option")
    .forEach((btn) => (btn.style.opacity = "1"));
}

// ==============================
// RESULTS DISPLAY
// ==============================

// Display session results
function displaySessionResults() {
  const photosGrid = document.getElementById("photosGrid");

  if (sessionPhotos.length === 0) {
    photosGrid.innerHTML = `
            <div class="empty-results">
                <i class="fas fa-camera-retro"></i>
                <h4>Belum ada foto</h4>
                <p>Mulai sesi foto untuk melihat hasil di sini</p>
            </div>
        `;
    return;
  }

  // Clear grid
  photosGrid.innerHTML = "";

  // Create grid based on layout
  const gridSize =
    selectedLayout === "2x2"
      ? 2
      : selectedLayout === "3x3"
      ? 3
      : selectedLayout === "4x4"
      ? 4
      : 1;

  photosGrid.style.display = "grid";
  photosGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  photosGrid.style.gap = "15px";
  photosGrid.style.padding = "20px";

  // Add photos to grid
  sessionPhotos.forEach((photo, index) => {
    const photoItem = document.createElement("div");
    photoItem.className = "photo-item";
    photoItem.style.position = "relative";
    photoItem.style.borderRadius = "10px";
    photoItem.style.overflow = "hidden";
    photoItem.style.cursor = "pointer";
    photoItem.style.border = `3px solid ${photo.frame.color}`;
    photoItem.style.transition = "transform 0.3s ease";

    photoItem.innerHTML = `
            <img src="${photo.data}" alt="Foto ${
      index + 1
    }" style="width:100%; height:150px; object-fit:cover;">
            <div style="position:absolute; top:8px; left:8px; background:rgba(0,0,0,0.7); color:white; padding:4px 8px; border-radius:12px; font-size:0.8rem;">
                ${index + 1}
            </div>
            <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.7); padding:8px; text-align:center;">
                <button onclick="editPhoto(${index})" style="background:#007bff; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:0.8rem;">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
        `;

    // Add hover effect
    photoItem.addEventListener("mouseenter", () => {
      photoItem.style.transform = "scale(1.05)";
    });

    photoItem.addEventListener("mouseleave", () => {
      photoItem.style.transform = "scale(1)";
    });

    photoItem.addEventListener("click", () => {
      editPhoto(index);
    });

    photosGrid.appendChild(photoItem);
  });

  // Enable output buttons
  document.getElementById("saveAllBtn").disabled = false;
  document.getElementById("downloadAllBtn").disabled = false;
  document.getElementById("createCollageBtn").disabled = false;
}

// Edit photo
function editPhoto(index) {
  editingPhotoIndex = index;
  const photo = sessionPhotos[index];

  // Load photo in editor
  const editingPhoto = document.getElementById("editingPhoto");
  editingPhoto.src = photo.data;

  // Show editor
  document.getElementById("photoEditor").style.display = "block";

  // Scroll to editor
  document.getElementById("photoEditor").scrollIntoView({ behavior: "smooth" });

  // Update current stickers
  currentStickers = photo.stickers || [];
  updateStickersDisplay();

  showNotification(`Mengedit foto ${index + 1}`, "info");
}

// Close editor
function closeEditor() {
  document.getElementById("photoEditor").style.display = "none";
  editingPhotoIndex = null;
  currentStickers = [];
}

// Add sticker to photo
function addSticker(sticker) {
  if (editingPhotoIndex === null) return;

  // Add sticker to current stickers
  currentStickers.push({
    type: sticker,
    position: { x: 50, y: 50 }, // Center position
    size: 40,
    rotation: 0,
  });

  // Update photo stickers
  sessionPhotos[editingPhotoIndex].stickers = currentStickers;

  // Update display
  updateStickersDisplay();
  applyStickersToPreview();

  showNotification(`Stiker ${sticker} ditambahkan`, "success");
}

// Update stickers display
function updateStickersDisplay() {
  const editingPhoto = document.getElementById("editingPhoto");

  // Clear existing sticker overlays
  const existingOverlays =
    editingPhoto.parentElement.querySelectorAll(".sticker-overlay");
  existingOverlays.forEach((overlay) => overlay.remove());

  // Add new sticker overlays
  currentStickers.forEach((sticker, index) => {
    const overlay = document.createElement("div");
    overlay.className = "sticker-overlay";
    overlay.style.position = "absolute";
    overlay.style.left = `${sticker.position.x}%`;
    overlay.style.top = `${sticker.position.y}%`;
    overlay.style.transform = `translate(-50%, -50%) rotate(${sticker.rotation}deg)`;
    overlay.style.fontSize = `${sticker.size}px`;
    overlay.style.cursor = "move";
    overlay.style.userSelect = "none";
    overlay.textContent = sticker.type;
    overlay.draggable = true;

    // Make draggable
    makeDraggable(overlay, index);

    editingPhoto.parentElement.appendChild(overlay);
  });
}

// Apply stickers to preview
function applyStickersToPreview() {
  if (editingPhotoIndex === null) return;

  const photo = sessionPhotos[editingPhotoIndex];
  const img = new Image();

  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw original photo
    ctx.drawImage(img, 0, 0);

    // Draw stickers
    currentStickers.forEach((sticker) => {
      ctx.save();

      // Calculate position
      const x = (sticker.position.x / 100) * canvas.width;
      const y = (sticker.position.y / 100) * canvas.height;

      // Apply rotation
      ctx.translate(x, y);
      ctx.rotate((sticker.rotation * Math.PI) / 180);

      // Draw sticker (as text for emoji)
      ctx.font = `${sticker.size}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sticker.type, 0, 0);

      ctx.restore();
    });

    // Update preview
    const editingPhoto = document.getElementById("editingPhoto");
    editingPhoto.src = canvas.toDataURL("image/png");

    // Update session photo
    photo.data = canvas.toDataURL("image/png");
  };

  img.src = sessionPhotos[editingPhotoIndex].data;
}

// Make element draggable
function makeDraggable(element, stickerIndex) {
  let isDragging = false;
  let startX, startY, initialX, initialY;

  element.addEventListener("mousedown", startDrag);
  element.addEventListener("touchstart", startDragTouch);

  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = element.offsetLeft;
    initialY = element.offsetTop;

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  }

  function startDragTouch(e) {
    e.preventDefault();
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    initialX = element.offsetLeft;
    initialY = element.offsetTop;

    document.addEventListener("touchmove", dragTouch);
    document.addEventListener("touchend", stopDrag);
  }

  function drag(e) {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // Update position
    element.style.left = `${initialX + dx}px`;
    element.style.top = `${initialY + dy}px`;

    // Update sticker position in data
    const parentRect = element.parentElement.getBoundingClientRect();
    const xPercent = ((initialX + dx) / parentRect.width) * 100;
    const yPercent = ((initialY + dy) / parentRect.height) * 100;

    currentStickers[stickerIndex].position = { x: xPercent, y: yPercent };
  }

  function dragTouch(e) {
    if (!isDragging) return;

    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;

    element.style.left = `${initialX + dx}px`;
    element.style.top = `${initialY + dy}px`;

    const parentRect = element.parentElement.getBoundingClientRect();
    const xPercent = ((initialX + dx) / parentRect.width) * 100;
    const yPercent = ((initialY + dy) / parentRect.height) * 100;

    currentStickers[stickerIndex].position = { x: xPercent, y: yPercent };
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("touchmove", dragTouch);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchend", stopDrag);

    // Update photo with new sticker positions
    applyStickersToPreview();
  }
}

// Reset editor
function resetEditor() {
  if (editingPhotoIndex === null) return;

  // Reset stickers
  currentStickers = [];
  sessionPhotos[editingPhotoIndex].stickers = [];

  // Reset to original photo
  const originalData = sessionPhotos[editingPhotoIndex].data.split("?")[0]; // Remove any query string
  sessionPhotos[editingPhotoIndex].data = originalData;

  // Update display
  updateStickersDisplay();
  document.getElementById("editingPhoto").src = originalData;

  showNotification("Editor direset", "info");
}

// Auto enhance photo
function autoEnhance() {
  if (editingPhotoIndex === null) return;

  const img = new Image();
  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    // Draw image
    ctx.drawImage(img, 0, 0);

    // Simple auto-enhance: adjust brightness and contrast
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Calculate average brightness
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    const avgBrightness = sum / (data.length / 4);

    // Adjust pixels
    const targetBrightness = 128;
    const brightnessDiff = targetBrightness - avgBrightness;

    for (let i = 0; i < data.length; i += 4) {
      // Adjust brightness
      data[i] += brightnessDiff * 0.3; // Red
      data[i + 1] += brightnessDiff * 0.3; // Green
      data[i + 2] += brightnessDiff * 0.3; // Blue

      // Simple contrast adjustment
      const factor = 1.1;
      data[i] = (data[i] - 128) * factor + 128;
      data[i + 1] = (data[i + 1] - 128) * factor + 128;
      data[i + 2] = (data[i + 2] - 128) * factor + 128;

      // Clamp values
      data[i] = Math.max(0, Math.min(255, data[i]));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
    }

    ctx.putImageData(imageData, 0, 0);

    // Update photo
    sessionPhotos[editingPhotoIndex].data = canvas.toDataURL("image/png");
    document.getElementById("editingPhoto").src =
      sessionPhotos[editingPhotoIndex].data;

    showNotification("Foto ditingkatkan otomatis", "success");
  };

  img.src = sessionPhotos[editingPhotoIndex].data;
}

// Save edited photo
function saveEditedPhoto() {
  if (editingPhotoIndex === null) return;

  // Update session photo with current stickers
  sessionPhotos[editingPhotoIndex].stickers = [...currentStickers];

  // Add to edited photos if not already
  if (!editedPhotos.includes(editingPhotoIndex)) {
    editedPhotos.push(editingPhotoIndex);
  }

  // Update results display
  displaySessionResults();

  // Close editor
  closeEditor();

  showNotification("Perubahan disimpan", "success");
}

// Apply current edits to all photos
function applyToAllPhotos() {
  if (editingPhotoIndex === null || currentStickers.length === 0) {
    showNotification("Tidak ada stiker untuk diterapkan", "warning");
    return;
  }

  if (!confirm("Terapkan stiker ini ke semua foto?")) return;

  // Apply stickers to all photos
  sessionPhotos.forEach((photo, index) => {
    if (index !== editingPhotoIndex) {
      photo.stickers = [...currentStickers];
      // Note: Would need to actually render stickers on each photo
    }
  });

  showNotification("Stiker diterapkan ke semua foto", "success");
}

// Download edited photo
function downloadEditedPhoto() {
  if (editingPhotoIndex === null) return;

  const photo = sessionPhotos[editingPhotoIndex];
  const link = document.createElement("a");
  link.href = photo.data;
  link.download = `photobooth-foto-${editingPhotoIndex + 1}-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showNotification("Foto berhasil diunduh", "success");
}

// ==============================
// OUTPUT & EXPORT
// ==============================

// Save all photos
function saveAllPhotos() {
  if (sessionPhotos.length === 0) {
    showNotification("Belum ada foto yang diambil", "warning");
    return;
  }

  try {
    // Create session data
    const sessionData = {
      id: Date.now(),
      date: new Date().toLocaleString("id-ID"),
      totalPhotos: sessionPhotos.length,
      photos: sessionPhotos,
      layout: selectedLayout,
      frame: selectedFrame,
      frameColor: frameColor,
    };

    // Save to localStorage
    const savedSessions = JSON.parse(
      localStorage.getItem("photoboothSessions") || "[]"
    );
    savedSessions.unshift(sessionData);

    // Keep only last 10 sessions
    if (savedSessions.length > 10) {
      savedSessions.pop();
    }

    localStorage.setItem("photoboothSessions", JSON.stringify(savedSessions));

    showNotification(
      `${sessionPhotos.length} foto berhasil disimpan`,
      "success"
    );
  } catch (error) {
    console.error("Error saving photos:", error);
    showNotification("Gagal menyimpan foto", "error");
  }
}

// Download all photos
async function downloadAllPhotos() {
  if (sessionPhotos.length === 0) {
    showNotification("Belum ada foto yang diambil", "warning");
    return;
  }

  try {
    if (sessionPhotos.length === 1) {
      // Single photo - download directly
      const photo = sessionPhotos[0];
      const link = document.createElement("a");
      link.href = photo.data;
      link.download = `photobooth-foto-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Multiple photos - create zip
      showNotification("Menyiapkan download...", "info");
      await createAndDownloadZip();
    }
  } catch (error) {
    console.error("Error downloading photos:", error);
    showNotification("Gagal mengunduh foto", "error");
  }
}

// Create and download zip
async function createAndDownloadZip() {
  // Note: This is a simplified version
  // In production, you would use a library like JSZip

  showNotification("Fitur ZIP dalam pengembangan", "info");

  // For now, download photos one by one
  sessionPhotos.forEach((photo, index) => {
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = photo.data;
      link.download = `photobooth-foto-${index + 1}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, index * 1000); // Stagger downloads
  });
}

// Create final collage
function createFinalCollage() {
  if (sessionPhotos.length === 0) {
    showNotification("Belum ada foto yang diambil", "warning");
    return;
  }

  showNotification("Membuat collage...", "info");

  // Create canvas for collage
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size based on layout
  const collageSize = 1200;
  canvas.width = collageSize;
  canvas.height = collageSize;

  // Background
  const gradient = ctx.createLinearGradient(0, 0, collageSize, collageSize);
  gradient.addColorStop(0, frameColor);
  gradient.addColorStop(1, lightenColor(frameColor, 30));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, collageSize, collageSize);

  // Layout configuration
  let rows, cols;
  switch (selectedLayout) {
    case "2x2":
      rows = 2;
      cols = 2;
      break;
    case "3x3":
      rows = 3;
      cols = 3;
      break;
    case "4x4":
      rows = 4;
      cols = 4;
      break;
    default:
      rows = 1;
      cols = 1;
  }

  const padding = 50;
  const cellWidth = (collageSize - padding * 2) / cols;
  const cellHeight = (collageSize - padding * 2) / rows;

  // Draw photos
  let photosLoaded = 0;

  sessionPhotos.slice(0, rows * cols).forEach((photo, index) => {
    const img = new Image();
    img.onload = function () {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const x = padding + col * cellWidth;
      const y = padding + row * cellHeight;

      // Draw photo frame
      ctx.save();
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 5;
      ctx.strokeRect(x + 5, y + 5, cellWidth - 10, cellHeight - 10);

      // Draw photo (maintain aspect ratio)
      const photoAspect = img.width / img.height;
      const cellAspect = cellWidth / cellHeight;

      let drawWidth, drawHeight, drawX, drawY;

      if (photoAspect > cellAspect) {
        // Photo is wider
        drawWidth = cellWidth - 20;
        drawHeight = drawWidth / photoAspect;
        drawX = x + 10;
        drawY = y + (cellHeight - drawHeight) / 2;
      } else {
        // Photo is taller
        drawHeight = cellHeight - 20;
        drawWidth = drawHeight * photoAspect;
        drawX = x + (cellWidth - drawWidth) / 2;
        drawY = y + 10;
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();

      photosLoaded++;

      // When all photos are loaded
      if (photosLoaded === Math.min(sessionPhotos.length, rows * cols)) {
        // Add title
        ctx.fillStyle = "white";
        ctx.font = 'bold 48px "Playfair Display", serif';
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 10;
        ctx.fillText("Photobooth Sang Ratu", collageSize / 2, 40);

        // Add subtitle
        ctx.font = "24px Arial, sans-serif";
        ctx.fillText(
          `${sessionPhotos.length} Foto • ${new Date().toLocaleDateString(
            "id-ID"
          )}`,
          collageSize / 2,
          collageSize - 30
        );

        // Update final preview
        const finalPreview = document.getElementById("finalPreview");
        finalPreview.innerHTML = "";

        const previewImg = document.createElement("img");
        previewImg.src = canvas.toDataURL("image/png");
        previewImg.style.width = "100%";
        previewImg.style.height = "100%";
        previewImg.style.objectFit = "contain";
        finalPreview.appendChild(previewImg);

        // Enable download
        document.getElementById("downloadAllBtn").disabled = false;

        showNotification("Collage berhasil dibuat!", "success");
      }
    };

    img.onerror = function () {
      photosLoaded++;
    };

    img.src = photo.data;
  });
}

// Share photos
function sharePhotos() {
  if (sessionPhotos.length === 0) {
    showNotification("Belum ada foto yang diambil", "warning");
    return;
  }

  if (navigator.share) {
    // Use Web Share API if available
    navigator
      .share({
        title: "Photobooth Sang Ratu",
        text: `Lihat ${sessionPhotos.length} foto dari Photobooth Sang Ratu!`,
        url: window.location.href,
      })
      .then(() => {
        showNotification("Berhasil dibagikan!", "success");
      })
      .catch((error) => {
        console.error("Error sharing:", error);
        copyToClipboard();
      });
  } else {
    // Fallback to clipboard
    copyToClipboard();
  }
}

// Copy link to clipboard
function copyToClipboard() {
  const text = `🎪 Photobooth Sang Ratu\n${sessionPhotos.length} foto keren!\n${window.location.href}`;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      showNotification("Link disalin ke clipboard!", "success");
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
      showNotification("Gagal menyalin link", "error");
    });
}

// ==============================
// MODAL FUNCTIONS
// ==============================

// Show session complete modal
function showSessionCompleteModal() {
  const modal = document.getElementById("sessionCompleteModal");

  // Update stats
  document.getElementById("totalPhotosTaken").textContent =
    sessionPhotos.length;

  const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
  document.getElementById("sessionDuration").textContent = `${duration}s`;

  const quality = sessionPhotos.length >= totalPhotos ? "Excellent" : "Good";
  document.getElementById("photoQuality").textContent = quality;

  // Show modal
  modal.style.display = "flex";
}

// Close session modal
function closeSessionModal() {
  document.getElementById("sessionCompleteModal").style.display = "none";
}

// Start editing session
function startEditingSession() {
  closeSessionModal();

  // Scroll to editor
  document.getElementById("photoEditor").scrollIntoView({ behavior: "smooth" });

  // If there are photos, edit the first one
  if (sessionPhotos.length > 0) {
    setTimeout(() => {
      editPhoto(0);
    }, 500);
  }
}

// Start new session
function startNewSession() {
  closeSessionModal();

  // Reset session data
  sessionPhotos = [];
  currentPhotoIndex = 0;
  editedPhotos = [];

  // Update display
  displaySessionResults();

  showNotification("Siap untuk sesi foto baru!", "info");
}

// ==============================
// UTILITY FUNCTIONS
// ==============================

// Save session data
function saveSessionData() {
  try {
    const sessionData = {
      id: Date.now(),
      date: new Date().toISOString(),
      photos: sessionPhotos.length,
      duration: Math.floor((Date.now() - sessionStartTime) / 1000),
      settings: {
        totalPhotos,
        timerSeconds,
        selectedLayout,
        selectedFrame,
        frameColor,
      },
    };

    // Save to localStorage
    const history = JSON.parse(
      localStorage.getItem("photoboothHistory") || "[]"
    );
    history.unshift(sessionData);
    localStorage.setItem("photoboothHistory", JSON.stringify(history));
  } catch (error) {
    console.error("Error saving session data:", error);
  }
}

// Play capture sound
function playCaptureSound() {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    // Audio not supported
  }
}

// Show notification
function showNotification(message, type = "info") {
  const container = document.getElementById("notificationContainer");
  if (!container) return;

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  const icon =
    type === "success"
      ? "fa-check-circle"
      : type === "error"
      ? "fa-exclamation-circle"
      : type === "warning"
      ? "fa-exclamation-triangle"
      : "fa-info-circle";

  notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

  // Add to container
  container.appendChild(notification);

  // Show with animation
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Helper: Lighten color
function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

// Make functions available globally
window.selectPhotoCount = selectPhotoCount;
window.setTimer = setTimer;
window.selectLayout = selectLayout;
window.selectFrame = selectFrame;
window.selectFrameColor = selectFrameColor;
window.editPhoto = editPhoto;
window.closeEditor = closeEditor;
window.addSticker = addSticker;
window.resetEditor = resetEditor;
window.autoEnhance = autoEnhance;
window.saveEditedPhoto = saveEditedPhoto;
window.applyToAllPhotos = applyToAllPhotos;
window.downloadEditedPhoto = downloadEditedPhoto;
window.createFinalCollage = createFinalCollage;
window.downloadAllPhotos = downloadAllPhotos;
window.sharePhotos = sharePhotos;
window.closeSessionModal = closeSessionModal;
window.startEditingSession = startEditingSession;
window.startNewSession = startNewSession;
