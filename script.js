// ================ LOADING SCREEN ================
function createBubbles() {
  const container = document.querySelector(".bubbles-container");
  const heartCount = 30;
  const hearts = ["❤️", "💖", "💕", "💗"];

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.className = "bubble-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    // Random properties
    const size = Math.random() * 20 + 20; // 20-40px
    const left = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 5;

    heart.style.fontSize = `${size}px`;
    heart.style.left = `${left}%`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.opacity = Math.random() * 0.5 + 0.3;

    container.appendChild(heart);
  }
}

// ================ FLOATING HEARTS ================
function createFloatingHearts() {
  const container = document.querySelector(".floating-hearts");
  const heartCount = 20;

  const hearts = ["❤️", "💖", "💗", "💓", "💕", "💞", "💘", "💝"];

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.className = "heart-float";

    // Random properties
    const size = Math.random() * 30 + 20;
    const left = Math.random() * 100;
    const delay = Math.random() * 20;
    const duration = Math.random() * 25 + 20;
    const heartType = hearts[Math.floor(Math.random() * hearts.length)];

    heart.innerHTML = heartType;
    heart.style.left = `${left}%`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.animationDuration = `${duration}s`;

    container.appendChild(heart);
  }
}

// ================ GREETING & TIME ================
function updateGreeting() {
  const greeting = document.getElementById("greeting");
  const timeDisplay = document.getElementById("timeDisplay");
  const letterDate = document.getElementById("letterDate");

  const now = new Date();
  const hours = now.getHours();

  let greetingText;
  if (hours < 12) greetingText = "Good Morning, Beautiful! 🌅";
  else if (hours < 18) greetingText = "Good Afternoon, Love! ☀️";
  else greetingText = "Good Evening, My Dear! 🌙";

  greeting.textContent = greetingText;

  // Format time
  const timeString = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  timeDisplay.textContent = timeString;

  // Format date for letter
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  if (letterDate) {
    letterDate.textContent = dateString;
  }
}

// ================ PAGE NAVIGATION ================
function showPage(page) {
    // Time Lock for Special Gift
    if (page === 'gift') {
        const now = new Date();
        const targetDate = new Date('2026-01-13T00:00:00');
        
        if (now < targetDate) {
            // Show Locked Modal
            const modal = document.getElementById('lockedModal');
            const icon = modal.querySelector('.locked-icon');
            const title = modal.querySelector('.locked-title');
            const text = modal.querySelector('.locked-text');
            
            icon.textContent = "🥺";
            title.textContent = "Tunggu ya sayang!";
            text.innerHTML = "Kado ini baru bisa dibuka pada:<br><strong>13 Januari 2026 pukul 00:00</strong>";
            
            modal.style.display = 'flex';
            setTimeout(() => modal.style.opacity = '1', 10);
            return;
        }
    }

  // Hide all pages
  const pages = [
    "mainPage",
    "ucapanPage",
    "galeriPage",
    "gamesPage",
    "morsePage",
    "gardenPage",
    "giftPage",
    "quizPage"
  ];
  pages.forEach((pageId) => {
    document.getElementById(pageId).style.display = "none";
  });

  // Show selected page
  document.getElementById(`${page}Page`).style.display = "block";

  // Update game stats if on games page
  if (page === "games") {
    updateGameStats();
  }

  // Initialize morse if on morse page
  if (page === "morse") {
    initializeMorse();
  }

  // Initialize gallery if on gallery page
  if (page === "galeri") {
    initializeGallery();
  }

  // Initialize special gift if on gift page
  if (page === "gift") {
    initializeSpecialGift();
  }

  // Initialize garden if on garden page
  if (page === "garden") {
    initializeGarden();
  }

  // Scroll to top
  window.scrollTo(0, 0);
}


// ================ FLOWER GARDEN FUNCTIONS ================
// ================ FLOWER GARDEN FUNCTIONS ================
let gardenData = {
    flowers: {
        // === ROMANTIC FLOWERS (7) ===
        rose: { count: 0, lastGrown: null, name: "Red Rose", emoji: "🌹", description: "Symbol of deep love and passion", message: "My love for you is as eternal as this rose" },
        sakura: { count: 0, lastGrown: null, name: "Cherry Blossom", emoji: "🌸", description: "Represents the beauty and fragility of life", message: "Cherish every moment like these beautiful blossoms" },
        sunflower: { count: 0, lastGrown: null, name: "Sunflower", emoji: "🌻", description: "Symbol of loyalty, adoration, and happiness", message: "You are my sunshine that makes every day brighter" },
        daisy: { count: 0, lastGrown: null, name: "Daisy", emoji: "🌼", description: "Represents innocence, purity, and true love", message: "My love for you is pure and true like this daisy" },
        tulip: { count: 0, lastGrown: null, name: "Tulip", emoji: "🌷", description: "Symbol of perfect love and elegance", message: "Our love is as perfect as this beautiful tulip" },
        lily: { count: 0, lastGrown: null, name: "White Lily", emoji: "💮", description: "Represents purity, beauty, and devotion", message: "Your beauty and grace inspire me every day" },
        hibiscus: { count: 0, lastGrown: null, name: "Hibiscus", emoji: "🌺", description: "Symbol of delicate beauty and femininity", message: "You are as delicate and beautiful as this hibiscus" },
        
        // === SPECIAL FLOWERS (5) ===
        orchid: { count: 0, lastGrown: null, name: "Orchid", emoji: "🪷", description: "Symbol of luxury, beauty, and strength", message: "You are as rare and beautiful as this orchid" },
        lavender: { count: 0, lastGrown: null, name: "Lavender", emoji: "🪻", description: "Represents serenity, grace, and calmness", message: "Your presence brings peace to my soul" },
        peony: { count: 0, lastGrown: null, name: "Peony", emoji: "🌺", description: "Symbol of prosperity, good fortune, and happy marriage", message: "I wish you all the happiness in the world" },
        forgetmenot: { count: 0, lastGrown: null, name: "Forget-me-not", emoji: "💠", description: "Represents true love and remembrance", message: "I will never forget our special moments" },
        jasmine: { count: 0, lastGrown: null, name: "Jasmine", emoji: "🌿", description: "Symbol of sweet love and attachment", message: "My love for you is sweet and everlasting" },
        
        // === SEASONAL FLOWERS (4) ===
        cherryblossom: { count: 0, lastGrown: null, name: "Pink Cherry", emoji: "🌸", description: "Represents spring, renewal, and new beginnings", message: "Every day with you feels like a new beginning" },
        poinsettia: { count: 0, lastGrown: null, name: "Poinsettia", emoji: "🎄", description: "Symbol of good cheer and success", message: "Wishing you success in all your dreams" },
        hydrangea: { count: 0, lastGrown: null, name: "Hydrangea", emoji: "🌺", description: "Represents gratitude and heartfelt emotion", message: "I'm so grateful to have you in my life" },
        carnation: { count: 0, lastGrown: null, name: "Carnation", emoji: "🌹", description: "Represents fascination and distinction", message: "You fascinate me more every day" },
        
        // === RARE FLOWERS (4) ===
        birdofparadise: { count: 0, lastGrown: null, name: "Bird of Paradise", emoji: "🐦", description: "Symbol of joyfulness and paradise", message: "Being with you feels like paradise" },
        protea: { count: 0, lastGrown: null, name: "Protea", emoji: "🌺", description: "Represents diversity, courage, and transformation", message: "Your courage inspires me every day" },
        lotus: { count: 0, lastGrown: null, name: "Lotus", emoji: "🪷", description: "Symbol of purity, enlightenment, and rebirth", message: "You help me see the beauty in everything" },
        anemone: { count: 0, lastGrown: null, name: "Anemone", emoji: "🌺", description: "Symbol of anticipation and protection", message: "I will always protect and cherish you" },
        edelweiss: { count: 0, lastGrown: null, name: "Edelweiss", emoji: "❄️", description: "Represents courage, devotion, and true love", message: "My devotion to you will never fade" }
    },
    totalFlowers: 0,
    gardenLevel: 1,
    lastVisit: null,
    todayGrowth: 0,
    maxDailyGrowth: 5, // Increased from 3 to 5 for more fun
    daysStreak: 0,
    specialFlowersUnlocked: 0
};

// Total bunga: 7 + 5 + 4 + 4 = 20 bunga!

function initializeGarden() {
  loadGardenData();
  updateGardenStats();
  renderGardenDisplay();
  renderCollection();
  checkDailyReset();

  // Add click handler for garden display
  const gardenDisplay = document.getElementById("gardenDisplay");
  if (gardenDisplay) {
    gardenDisplay.addEventListener("click", function (e) {
      if (e.target.closest(".flower")) {
        const flowerElement = e.target.closest(".flower");
        const flowerType = flowerElement.dataset.type;
        showFlowerDetails(flowerType);
      }
    });
  }
}

function loadGardenData() {
  try {
    const saved = localStorage.getItem("laysaGarden");
    if (saved) {
      const parsed = JSON.parse(saved);
      gardenData = { ...gardenData, ...parsed };

      // Ensure all flower types exist
      Object.keys(gardenData.flowers).forEach((type) => {
        if (!gardenData.flowers[type]) {
          // Reset to default if missing
          gardenData.flowers[type] = { count: 0, lastGrown: null };
        }
      });
    }
  } catch (e) {
    console.log("Error loading garden data:", e);
  }
}

function saveGardenData() {
  try {
    localStorage.setItem("laysaGarden", JSON.stringify(gardenData));
  } catch (e) {
    console.log("Error saving garden data:", e);
  }
}

function checkDailyReset() {
  const today = new Date().toDateString();

  if (!gardenData.lastVisit) {
    gardenData.lastVisit = today;
    gardenData.todayGrowth = 0;
    saveGardenData();
    return;
  }

  if (gardenData.lastVisit !== today) {
    const lastVisit = new Date(gardenData.lastVisit);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - lastVisit);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      gardenData.daysStreak++;
    } else if (diffDays > 1) {
      gardenData.daysStreak = 0;
    }

    gardenData.lastVisit = today;
    gardenData.todayGrowth = 0;
    saveGardenData();
    updateGardenStats();
  }
}

function updateGardenStats() {
  // Calculate total flowers
  let total = 0;
  Object.values(gardenData.flowers).forEach((flower) => {
    total += flower.count;
  });
  gardenData.totalFlowers = total;

  // Update garden level (every 10 flowers = 1 level)
  gardenData.gardenLevel = Math.floor(total / 10) + 1;

  // Update UI
  const totalFlowersEl = document.getElementById("totalFlowers");
  const gardenLevelEl = document.getElementById("gardenLevel");
  const daysStreakEl = document.getElementById("daysStreak");
  const todayGrowthEl = document.getElementById("todayGrowth");

  if (totalFlowersEl) totalFlowersEl.textContent = total;
  if (gardenLevelEl) gardenLevelEl.textContent = gardenData.gardenLevel;
  if (daysStreakEl) daysStreakEl.textContent = gardenData.daysStreak;
  if (todayGrowthEl)
    todayGrowthEl.textContent = `${gardenData.todayGrowth}/${gardenData.maxDailyGrowth}`;

  // Disable grow button if reached daily limit
  const growBtn = document.getElementById("growBtn");
  if (growBtn) {
    if (gardenData.todayGrowth >= gardenData.maxDailyGrowth) {
      growBtn.disabled = true;
      growBtn.innerHTML =
        '<i class="fas fa-seedling"></i><span>Come Back Tomorrow</span>';
    } else {
      growBtn.disabled = false;
      growBtn.innerHTML =
        '<i class="fas fa-magic"></i><span>Grow a Flower</span>';
    }
  }

  saveGardenData();
}

function growRandomFlower() {
  if (gardenData.todayGrowth >= gardenData.maxDailyGrowth) {
    showNotification(
      "You've grown enough flowers for today! Come back tomorrow."
    );
    return;
  }

  // Define rarity tiers
  const flowerRarity = {
    common: [
      "rose",
      "sakura",
      "sunflower",
      "daisy",
      "tulip",
      "lily",
      "hibiscus",
    ],
    uncommon: ["orchid", "lavender", "peony", "forgetmenot", "jasmine"],
    rare: ["cherryblossom", "poinsettia", "hydrangea", "carnation"],
    legendary: ["birdofparadise", "protea", "lotus", "anemone", "edelweiss"],
  };

  // Calculate chances based on garden level
  let randomType;
  const rand = Math.random();

  if (gardenData.gardenLevel >= 10 && rand < 0.05) {
    // 5% chance for legendary at level 10+
    randomType =
      flowerRarity.legendary[
        Math.floor(Math.random() * flowerRarity.legendary.length)
      ];
  } else if (gardenData.gardenLevel >= 5 && rand < 0.15) {
    // 15% chance for rare at level 5+
    randomType =
      flowerRarity.rare[Math.floor(Math.random() * flowerRarity.rare.length)];
  } else if (gardenData.gardenLevel >= 3 && rand < 0.3) {
    // 30% chance for uncommon at level 3+
    randomType =
      flowerRarity.uncommon[
        Math.floor(Math.random() * flowerRarity.uncommon.length)
      ];
  } else {
    // Default: common flowers
    randomType =
      flowerRarity.common[
        Math.floor(Math.random() * flowerRarity.common.length)
      ];
  }

  const flower = gardenData.flowers[randomType];

  // Update flower data
  flower.count++;
  flower.lastGrown = new Date().toISOString();
  gardenData.totalFlowers++;
  gardenData.todayGrowth++;

  // Create flower in display
  createFlowerInGarden(randomType, flower.emoji);

  // Create particle effect with different colors based on rarity
  createParticleEffect(randomType);

  // Show special notification based on rarity
  const rarityMessages = {
    legendary: `✨ LEGENDARY! You found a rare ${flower.name}! ${flower.emoji}`,
    rare: `🌟 Rare Discovery! You grew a ${flower.name}! ${flower.emoji}`,
    uncommon: `💫 Special Flower! You grew a ${flower.name}! ${flower.emoji}`,
    common: `You grew a beautiful ${flower.name}! ${flower.emoji}`,
  };

  let rarity = "common";
  if (flowerRarity.legendary.includes(randomType)) rarity = "legendary";
  else if (flowerRarity.rare.includes(randomType)) rarity = "rare";
  else if (flowerRarity.uncommon.includes(randomType)) rarity = "uncommon";

  showNotification(rarityMessages[rarity]);

  // Update UI
  updateGardenStats();
  renderCollection();

  // Check for level up
  checkForLevelUp();

  // Play sound effect based on rarity
  playGrowthSound(rarity);

  // Special effect for legendary flowers
  if (rarity === "legendary") {
    createLegendaryEffect();
  }
}

function createLegendaryEffect() {
  const gardenDisplay = document.getElementById("gardenDisplay");
  if (!gardenDisplay) return;

  // Create sparkle effect
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, #ffd700 30%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10;
                animation: sparkleSpin 1s ease-out forwards;
            `;

      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;

      gardenDisplay.appendChild(sparkle);

      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.remove();
        }
      }, 1000);
    }, i * 100);
  }
}

// Tambahkan animasi sparkle di CSS
const sparkleStyles = document.createElement("style");
sparkleStyles.textContent = `
    @keyframes sparkleSpin {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 0.8;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyles);


function updateGardenStats() {
  // Calculate total flowers
  let total = 0;
  Object.values(gardenData.flowers).forEach((flower) => {
    total += flower.count;
  });
  gardenData.totalFlowers = total;

  // Update garden level (every 15 flowers = 1 level for more levels)
  gardenData.gardenLevel = Math.floor(total / 15) + 1;

  // Calculate special flowers unlocked
  gardenData.specialFlowersUnlocked = Object.values(gardenData.flowers).filter(
    (flower) => flower.count > 0
  ).length;

  // Update UI
  const totalFlowersEl = document.getElementById("totalFlowers");
  const gardenLevelEl = document.getElementById("gardenLevel");
  const daysStreakEl = document.getElementById("daysStreak");
  const todayGrowthEl = document.getElementById("todayGrowth");
  const specialFlowersEl = document.getElementById("specialFlowers"); // Add this element if needed

  if (totalFlowersEl) totalFlowersEl.textContent = total;
  if (gardenLevelEl) gardenLevelEl.textContent = gardenData.gardenLevel;
  if (daysStreakEl) daysStreakEl.textContent = gardenData.daysStreak;
  if (todayGrowthEl)
    todayGrowthEl.textContent = `${gardenData.todayGrowth}/${gardenData.maxDailyGrowth}`;
  if (specialFlowersEl)
    specialFlowersEl.textContent = gardenData.specialFlowersUnlocked;

  // Disable grow button if reached daily limit
  const growBtn = document.getElementById("growBtn");
  if (growBtn) {
    if (gardenData.todayGrowth >= gardenData.maxDailyGrowth) {
      growBtn.disabled = true;
      growBtn.innerHTML =
        '<i class="fas fa-seedling"></i><span>Come Back Tomorrow</span>';
    } else {
      growBtn.disabled = false;
      growBtn.innerHTML =
        '<i class="fas fa-magic"></i><span>Grow a Flower</span>';
    }
  }

  saveGardenData();
}

function checkAchievements() {
  // Check if any flower reached milestones
  Object.entries(gardenData.flowers).forEach(([type, data]) => {
    if (data.count === 3) {
      showNotification(`🌼 Growing! You've collected 3 ${data.name}s!`);
    }
    if (data.count === 10) {
      showNotification(`🌺 Amazing! You've collected 10 ${data.name}s!`);
    }
    if (data.count === 25) {
      showNotification(`🏆 Master Gardener! 25 ${data.name}s collected!`);
    }
  });

  // Check for rare flower achievements
  const rareFlowers = ["birdofparadise", "protea", "edelweiss", "lotus"];
  rareFlowers.forEach((type) => {
    if (gardenData.flowers[type].count > 0) {
      showNotification(
        `💎 Rare Flower Found: ${gardenData.flowers[type].name}!`
      );
    }
  });

  // Check for all flowers collected
  const allCollected = Object.values(gardenData.flowers).every(
    (flower) => flower.count > 0
  );
  if (allCollected) {
    showNotification(
      `🌈 Perfect Collection! You've collected all 20 flower types!`
    );
    // Play special celebration
    playPerfectCollectionSound();
  }

  // Check for total milestones
  if (gardenData.totalFlowers === 50) {
    showNotification(`🎊 50 Flowers Grown! Your garden is flourishing!`);
  }
  if (gardenData.totalFlowers === 100) {
    showNotification(`👑 Centurion Gardener! 100 Flowers Collected!`);
  }
}

function playPerfectCollectionSound() {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Play a special melody for perfect collection
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
    let time = audioContext.currentTime;

    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

      oscillator.start(time);
      oscillator.stop(time + 0.3);

      time += 0.2;
    });
  } catch (e) {
    // Fail silently
  }
}

function createFlowerInGarden(type, emoji) {
  const gardenDisplay = document.getElementById("gardenDisplay");
  if (!gardenDisplay) return;

  const flower = document.createElement("div");
  flower.className = "flower";
  flower.dataset.type = type;

  // Random position within garden
  const x = Math.random() * 80 + 10; // 10-90%
  const y = Math.random() * 70 + 15; // 15-85%

  flower.style.left = `${x}%`;
  flower.style.top = `${y}%`;
  flower.style.animationDelay = `${Math.random() * 2}s`;

  const emojiSpan = document.createElement("span");
  emojiSpan.className = "flower-emoji";
  emojiSpan.textContent = emoji;
  emojiSpan.style.fontSize = `${Math.random() * 20 + 30}px`; // 30-50px

  flower.appendChild(emojiSpan);
  gardenDisplay.appendChild(flower);

  // Limit number of flowers displayed (remove oldest if > 20)
  const flowers = gardenDisplay.querySelectorAll(".flower");
  if (flowers.length > 20) {
    flowers[0].remove();
  }
}

function createParticleEffect(flowerType = null) {
  const gardenDisplay = document.getElementById("gardenDisplay");
  if (!gardenDisplay) return;

  // Determine particle colors based on flower rarity
  let colors;
  if (
    flowerType &&
    ["birdofparadise", "protea", "lotus", "anemone", "edelweiss"].includes(
      flowerType
    )
  ) {
    colors = ["#ffd700", "#ff6b8b", "#4fc3f7", "#ba68c8", "#ff8e53"]; // Gold, pink, blue, purple, orange (legendary)
  } else if (
    flowerType &&
    ["cherryblossom", "poinsettia", "hydrangea", "carnation"].includes(
      flowerType
    )
  ) {
    colors = ["#ff4081", "#ff8e53", "#81c784", "#4fc3f7"]; // Pink, orange, green, blue (rare)
  } else if (
    flowerType &&
    ["orchid", "lavender", "peony", "forgetmenot", "jasmine"].includes(
      flowerType
    )
  ) {
    colors = ["#ba68c8", "#9575cd", "#7986cb", "#64b5f6"]; // Purple shades (uncommon)
  } else {
    colors = ["#ff6b8b", "#ff8e53", "#81c784", "#4fc3f7"]; // Default colors (common)
  }

  for (let i = 0; i < 20; i++) {
    // More particles for better effect
    const particle = document.createElement("div");
    particle.className = "particle";

    // Random color from selected palette
    particle.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    // Random position around center
    const startX = 50 + (Math.random() - 0.5) * 40;
    const startY = 50 + (Math.random() - 0.5) * 40;

    // Random movement
    const tx = (Math.random() - 0.5) * 150;
    const ty = (Math.random() - 0.5) * 150;

    particle.style.left = `${startX}%`;
    particle.style.top = `${startY}%`;
    particle.style.setProperty("--tx", `${tx}px`);
    particle.style.setProperty("--ty", `${ty}px`);

    // Different sizes based on rarity
    if (
      flowerType &&
      ["birdofparadise", "protea", "lotus", "anemone", "edelweiss"].includes(
        flowerType
      )
    ) {
      particle.style.width = `${Math.random() * 15 + 8}px`;
      particle.style.height = particle.style.width;
      particle.style.boxShadow = "0 0 10px rgba(255, 215, 0, 0.5)";
    } else {
      particle.style.width = `${Math.random() * 10 + 5}px`;
      particle.style.height = particle.style.width;
    }

    gardenDisplay.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, 1000);
  }
}

function renderGardenDisplay() {
  const gardenDisplay = document.getElementById("gardenDisplay");
  if (!gardenDisplay) return;

  gardenDisplay.innerHTML = "";

  // Show some initial flowers based on collected count
  Object.entries(gardenData.flowers).forEach(([type, data]) => {
    for (let i = 0; i < Math.min(data.count, 3); i++) {
      // Max 3 of each type shown
      setTimeout(() => {
        createFlowerInGarden(type, data.emoji);
      }, i * 100);
    }
  });

  // Add some decorative plants if garden is empty
  if (gardenData.totalFlowers === 0) {
    const placeholder = document.createElement("div");
    placeholder.className = "garden-placeholder";
    placeholder.innerHTML = `
            <i class="fas fa-seedling" style="font-size: 4rem; color: #81c784; opacity: 0.5;"></i>
            <p style="color: #666; margin-top: 20px;">Click "Grow a Flower" to start your garden!</p>
        `;
    gardenDisplay.appendChild(placeholder);
  }
}

function renderCollection() {
  const collectionGrid = document.getElementById("collectionGrid");
  if (!collectionGrid) return;

  collectionGrid.innerHTML = "";

  // Define categories
  const categories = {
    romantic: [
      "rose",
      "sakura",
      "sunflower",
      "daisy",
      "tulip",
      "lily",
      "hibiscus",
    ],
    special: ["orchid", "lavender", "peony", "forgetmenot", "jasmine"],
    seasonal: ["cherryblossom", "poinsettia", "hydrangea", "carnation"],
    rare: ["birdofparadise", "protea", "anemone", "lotus", "edelweiss"],
  };

  const categoryNames = {
    romantic: "💖 Romantic Flowers",
    special: "✨ Special Flowers",
    seasonal: "🌷 Seasonal Flowers",
    rare: "💎 Rare Flowers",
  };

  // Render by category
  Object.entries(categories).forEach(([category, flowerTypes]) => {
    // Add category header
    const categoryHeader = document.createElement("div");
    categoryHeader.className = "flower-category";
    categoryHeader.textContent = categoryNames[category];
    collectionGrid.appendChild(categoryHeader);

    // Add flowers in this category
    flowerTypes.forEach((type) => {
      const data = gardenData.flowers[type];
      const collectionItem = document.createElement("div");
      collectionItem.className = `collection-item ${
        data.count > 0 ? "unlocked" : "locked"
      } ${category}`;
      collectionItem.dataset.type = type;

      // Add rarity class
      if (category === "rare") {
        collectionItem.classList.add("legendary");
      } else if (category === "special") {
        collectionItem.classList.add("rare");
      } else {
        collectionItem.classList.add("common");
      }

      collectionItem.innerHTML = `
                <span class="collection-emoji">${data.emoji}</span>
                <div class="collection-name">${data.name}</div>
                <div class="collection-count">${data.count} collected</div>
            `;

      collectionItem.addEventListener("click", () => showFlowerDetails(type));
      collectionGrid.appendChild(collectionItem);
    });
  });
}

function showFlowerDetails(type) {
  const flower = gardenData.flowers[type];
  const modal = document.getElementById("flowerModal");
  if (!modal) return;

  // Update modal content
  document.getElementById("modalEmoji").textContent = flower.emoji;
  document.getElementById("modalTitle").textContent = flower.name;
  document.getElementById("modalDescription").textContent = flower.description;
  document.getElementById("modalCount").textContent = flower.count;
  document.getElementById("modalMessage").textContent = flower.message;

  // Format last grown date
  let lastGrownText = "Never";
  if (flower.lastGrown) {
    const date = new Date(flower.lastGrown);
    lastGrownText = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  document.getElementById("modalLastGrown").textContent = lastGrownText;

  // Show modal
  modal.classList.add("active");
  setTimeout(() => {
    modal.style.opacity = "1";
  }, 10);
}

function closeFlowerModal() {
  const modal = document.getElementById("flowerModal");
  if (!modal) return;

  modal.style.opacity = "0";
  setTimeout(() => {
    modal.classList.remove("active");
  }, 300);
}

function checkForLevelUp() {
  const oldLevel = Math.floor((gardenData.totalFlowers - 1) / 10) + 1;
  const newLevel = gardenData.gardenLevel;

  if (newLevel > oldLevel) {
    showNotification(`🎉 Garden Level Up! You've reached Level ${newLevel}!`);
    // Play celebration sound
    playLevelUpSound();
  }

  // Check for special achievements
  checkAchievements();
}

function checkAchievements() {
  // Check if any flower reached 5
  Object.entries(gardenData.flowers).forEach(([type, data]) => {
    if (data.count === 5) {
      showNotification(`🌟 Achievement! You've collected 5 ${data.name}s!`);
    }
  });

  // Check for all flowers collected
  const allCollected = Object.values(gardenData.flowers).every(
    (flower) => flower.count > 0
  );
  if (allCollected) {
    showNotification(`🌈 Amazing! You've collected all flower types!`);
  }
}

function playGrowthSound(rarity = "common") {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies based on rarity
    const frequencies = {
      legendary: [659.25, 783.99, 1046.5], // E5, G5, C6
      rare: [523.25, 659.25], // C5, E5
      uncommon: [392.0, 493.88], // G4, B4
      common: [261.63], // C4
    };

    const freqArray = frequencies[rarity] || frequencies.common;
    const frequency = freqArray[Math.floor(Math.random() * freqArray.length)];

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    // Sound not essential, fail silently
  }
}

function playLevelUpSound() {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 659.25; // E5
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 1
    );

    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      1318.51,
      audioContext.currentTime + 1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  } catch (e) {
    // Fail silently
  }
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

// ================ GALLERY FUNCTIONS ================
let currentFilter = "all";
const mediaItems = [];

function initializeGallery() {
  const galleryContainer = document.getElementById("galleryContainer");
  if (!galleryContainer) return;

  // Clear previous content
  galleryContainer.innerHTML = "";
  mediaItems.length = 0;

  // Define all possible media files in your galeri folder
  // Define all possible media files in your galeri folder
  const mediaFiles = [
    // Original numbered files
    { type: "photo", name: "1.jpg", caption: "Beautiful Moment" },
    { type: "photo", name: "2.jpg", caption: "Sweet Smile" },
    { type: "photo", name: "3.jpg", caption: "Lovely Memory" },
    { type: "photo", name: "4.jpg", caption: "Special Day" },
    { type: "photo", name: "5.jpeg", caption: "Lovely Day" },
    { type: "photo", name: "5.png", caption: "Beautiful Art" },
    { type: "photo", name: "6.jpeg", caption: "Special Day" },
    { type: "photo", name: "7.jpeg", caption: "Sweet Memory" },
    { type: "photo", name: "8.jpg", caption: "Lovely Day" },
    { type: "photo", name: "9.jpg", caption: "Precious Memory" },
    { type: "photo", name: "10.jpg", caption: "Sweet Memory" },
    { type: "photo", name: "11.jpeg", caption: "Wonderful Time" },
    { type: "photo", name: "12.jpg", caption: "Special Moment" },
    { type: "photo", name: "13.jpeg", caption: "Lovely Smile" },
    { type: "photo", name: "14.jpg", caption: "Happy Day" },
    { type: "photo", name: "16.jpg", caption: "Sweet Day" },
    { type: "photo", name: "17.jpg", caption: "Beautiful Day" },
    { type: "photo", name: "18.jpg", caption: "Precious Day" },
    { type: "photo", name: "19.jpg", caption: "Lovely Moment" },
    { type: "photo", name: "Gemini_Generated_Image_789e7j789e7j789e.png", caption: "SUPERWOMAN" },
    
    // ChatGPT Generated
    { type: "photo", name: "ChatGPT Image Jan 11, 2026, 09_38_56 AM.png", caption: "AI Generated Art" },

    // Videos
    { type: "video", name: "11.mp4", caption: "Memory Video" },
    { type: "video", name: "13.mp4", caption: "Fun Video" },
    { type: "video", name: "new.mp4", caption: "New Memory" },
    { type: "video", name: "WhatsApp Video 2026-01-06 at 23.11.20.mp4", caption: "Special Video" },
    { type: "video", name: "WhatsApp Video 2026-01-06 at 23.11.23.mp4", caption: "Lovely Video" },
    { type: "video", name: "WhatsApp Video 2026-01-06 at 23.11.26.mp4", caption: "Sweet Video" },
    { type: "video", name: "WhatsApp Video 2026-01-06 at 23.11.45.mp4", caption: "Fun Moment" },

    // WhatsApp Images
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.10.58 (1).jpeg", caption: "Our Moment" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.10.58.jpeg", caption: "Sweet Photo" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.10.59.jpeg", caption: "Lovely Photo" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.11.jpeg", caption: "Beautiful Photo" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.15.jpeg", caption: "Nice Photo" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.16 (1).jpeg", caption: "Cute Photo" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.16.jpeg", caption: "Good Time" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.17.jpeg", caption: "Memory" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.18 (1).jpeg", caption: "Precious" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.18.jpeg", caption: "Smile" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.19 (1).jpeg", caption: "Happiness" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.19 (2).jpeg", caption: "Together" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.19.jpeg", caption: "Us" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.20.jpeg", caption: "Love" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.23.jpeg", caption: "Joy" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.24 (1).jpeg", caption: "Fun" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.24.jpeg", caption: "Moment" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.25.jpeg", caption: "Day out" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.26.jpeg", caption: "Date" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.27 (1).jpeg", caption: "Picnic" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.27.jpeg", caption: "Trip" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.28.jpeg", caption: "Holiday" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.29.jpeg", caption: "Vacation" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.30 (1).jpeg", caption: "Remember" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.30.jpeg", caption: "Forever" },
    { type: "photo", name: "WhatsApp Image 2026-01-06 at 23.11.31.jpeg", caption: "Always" }
  ];

  // Fallback images if local images don't exist
  const fallbackImages = [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=500&q=80",
  ];

  mediaFiles.forEach((media, index) => {
    const galleryItem = document.createElement("div");
    galleryItem.className = `gallery-item ${media.type}`;
    galleryItem.setAttribute("data-type", media.type);

    if (media.type === "photo") {
      const image = document.createElement("img");
      image.src = `galeri/${media.name}`;
      image.alt = media.caption;
      image.loading = "lazy";

      // Add error handler for missing images
      image.onerror = function () {
        const fallbackIndex = index % fallbackImages.length;
        this.src = fallbackImages[fallbackIndex];
      };

      galleryItem.appendChild(image);
      galleryItem.addEventListener("click", () =>
        openImageModal(`galeri/${media.name}`, media.caption)
      );
    } else if (media.type === "video") {
      const video = document.createElement("video");
      video.src = `galeri/${media.name}`;
      video.poster = `galeri/thumbnail${media.name.replace(".mp4", ".jpg")}`;
      video.preload = "metadata";

      galleryItem.appendChild(video);
      galleryItem.addEventListener("click", () =>
        openVideoModal(`galeri/${media.name}`)
      );
    }

    // Add media type indicator
    const typeIndicator = document.createElement("div");
    typeIndicator.className = `media-type ${media.type}`;
    typeIndicator.textContent = media.type === "photo" ? "PHOTO" : "VIDEO";
    galleryItem.appendChild(typeIndicator);

    galleryContainer.appendChild(galleryItem);
    mediaItems.push(galleryItem);
  });

  // Apply current filter
  filterGallery(currentFilter);
}

function filterGallery(type) {
  currentFilter = type;

  // Update filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // Show/hide items based on filter
  mediaItems.forEach((item) => {
    if (type === "all" || item.getAttribute("data-type") === type) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

function openImageModal(imageSrc, caption) {
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");

  modalImage.src = imageSrc;
  modalImage.alt = caption;
  modal.style.display = "flex";

  // Add animation
  setTimeout(() => {
    modal.style.opacity = "1";
  }, 10);
}

function openVideoModal(videoSrc) {
  const modal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");

  modalVideo.src = videoSrc;
  modal.style.display = "flex";

  // Add animation and play video
  setTimeout(() => {
    modal.style.opacity = "1";
    modalVideo.play();
  }, 10);
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  modal.style.opacity = "0";

  setTimeout(() => {
    modal.style.display = "none";
    document.getElementById("modalImage").src = "";
  }, 300);
}

function closeVideoModal() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("modalVideo");

  // Pause video first
  video.pause();
  video.currentTime = 0;

  modal.style.opacity = "0";
  setTimeout(() => {
    modal.style.display = "none";
    video.src = "";
  }, 300);
}

// ================ MUSIC PLAYER FUNCTIONS ================
let currentSongIndex = 0;
let isPlaying = false;
const audioPlayer = document.getElementById("audioPlayer");

// Playlist dengan lagu-lagu romantis
const playlist = [
  {
    title: "3000",
    src: "audio/3000.mp3",
  },
  {
    title: "123456",
    src: "audio/123456.mp3",
  },
  {
    title: "AngelBaby",
    src: "audio/angelbaby.mp3",
  },
  {
    title: "Favorite Girl",
    src: "audio/favoritegirl.mp3",
  },
];

function initializeMusicPlayer() {
  // Buat playlist items
  const playlistContainer = document.getElementById("playlist");
  playlistContainer.innerHTML = "";

  playlist.forEach((song, index) => {
    const playlistItem = document.createElement("div");
    playlistItem.className = "playlist-item";
    if (index === currentSongIndex) {
      playlistItem.classList.add("active");
    }

    playlistItem.innerHTML = `
            <div class="play-icon">
                <i class="fas fa-play"></i>
            </div>
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-duration">${song.duration}</div>
        `;

    playlistItem.addEventListener("click", () => playSong(index));
    playlistContainer.appendChild(playlistItem);
  });

  // Setup audio player events
  audioPlayer.addEventListener("timeupdate", updateProgress);
  audioPlayer.addEventListener("ended", nextSong);
  audioPlayer.addEventListener("loadedmetadata", updateDuration);

  // Set volume awal
  audioPlayer.volume = 0.7;

  // Load first song
  loadSong(currentSongIndex);
}

function toggleMusicPlayer() {
  const playerPanel = document.getElementById("musicPlayerPanel");
  const musicToggle = document.getElementById("musicToggle");

  playerPanel.classList.toggle("active");
  musicToggle.classList.toggle("active");

  if (playerPanel.classList.contains("active")) {
    musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Music On</span>';
  } else {
    musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Music</span>';
  }
}

function loadSong(index) {
  const song = playlist[index];
  audioPlayer.src = song.src;

  // Update UI
  document.getElementById("nowPlaying").innerHTML = `
        <span class="song-title">${song.title}</span>
        <span class="song-artist">${song.artist}</span>
    `;

  // Update active playlist item
  document.querySelectorAll(".playlist-item").forEach((item, i) => {
    item.classList.toggle("active", i === index);
  });

  // Jika sedang play, langsung play lagu baru
  if (isPlaying) {
    audioPlayer.play().catch((e) => console.log("Autoplay prevented"));
  }
}

function playSong(index) {
  currentSongIndex = index;
  loadSong(index);
  play();
}

function togglePlay() {
  if (isPlaying) {
    pause();
  } else {
    play();
  }
}

function play() {
  isPlaying = true;
  audioPlayer.play().catch((e) => console.log("Playback error:", e));
  document.getElementById("playPauseIcon").className = "fas fa-pause";
  document.getElementById("playPauseBtn").title = "Pause";
}

function pause() {
  isPlaying = false;
  audioPlayer.pause();
  document.getElementById("playPauseIcon").className = "fas fa-play";
  document.getElementById("playPauseBtn").title = "Play";
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  loadSong(currentSongIndex);
  if (isPlaying) {
    play();
  }
}

function previousSong() {
  currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentSongIndex);
  if (isPlaying) {
    play();
  }
}

function updateProgress() {
  const progress = document.getElementById("songProgress");
  const currentTime = document.getElementById("currentTime");

  if (audioPlayer.duration) {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progress.style.width = `${percent}%`;

    // Format waktu
    currentTime.textContent = formatTime(audioPlayer.currentTime);
  }
}

function updateDuration() {
  const duration = document.getElementById("duration");
  duration.textContent = formatTime(audioPlayer.duration);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function seekSong(event) {
  const progressBar = event.currentTarget;
  const rect = progressBar.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;

  if (audioPlayer.duration) {
    audioPlayer.currentTime = percent * audioPlayer.duration;
  }
}

function changeVolume(value) {
  audioPlayer.volume = value / 100;
}

// ================ GAME STATS ================
function updateGameStats() {
  try {
    let totalScore = localStorage.getItem("totalScore")
      ? parseInt(localStorage.getItem("totalScore"))
      : 0;
    let gamesPlayed = localStorage.getItem("gamesPlayed")
      ? parseInt(localStorage.getItem("gamesPlayed"))
      : 0;

    document.getElementById("totalScore").textContent = totalScore;
    document.getElementById("gamesPlayed").textContent = gamesPlayed;
  } catch (e) {
    console.log("Error loading game stats:", e);
  }
}

// ================ MORSE CODE FUNCTIONS ================
let morseInterval;
let currentMorseIndex = 0;
let isMorsePlaying = false;
const morseCode = "kicpbwskypcbysktkminaysku";
const morseMessage =
  "kamu itu cantik pake banget woi sayang kamu ya pasti cantik banget ya sayangku";

// Morse code mapping
const morseAlphabet = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
};

function initializeMorse() {
  const morseDisplay = document.getElementById("morseDisplay");
  morseDisplay.innerHTML = "";

  // Create character elements
  morseCode.split("").forEach((char) => {
    const charElement = document.createElement("div");
    charElement.className = "morse-char";
    charElement.textContent = char.toUpperCase();
    charElement.setAttribute("data-code", "");
    morseDisplay.appendChild(charElement);
  });

  // Reset message reveal
  document.getElementById("messageReveal").style.display = "none";

  // Reset controls
  document.getElementById("playBtn").disabled = false;
  document.getElementById("pauseBtn").disabled = true;
  document.getElementById("resetBtn").disabled = false;

  currentMorseIndex = 0;
  isMorsePlaying = false;

  // Stop any running interval
  if (morseInterval) {
    clearInterval(morseInterval);
    morseInterval = null;
  }
}

function startMorse() {
  if (isMorsePlaying) return;

  isMorsePlaying = true;
  const chars = document.querySelectorAll(".morse-char");
  const playBtn = document.getElementById("playBtn");
  const pauseBtn = document.getElementById("pauseBtn");

  playBtn.disabled = true;
  pauseBtn.disabled = false;

  // Reset all characters
  chars.forEach((char) => {
    char.classList.remove("active");
    char.setAttribute("data-code", "");
  });

  morseInterval = setInterval(() => {
    if (currentMorseIndex >= morseCode.length) {
      // Morse code completed
      clearInterval(morseInterval);
      morseInterval = null;
      isMorsePlaying = false;
      playBtn.disabled = false;
      pauseBtn.disabled = true;

      // Show secret message
      setTimeout(() => {
        document.getElementById("messageReveal").style.display = "block";
        createConfetti();
      }, 500);

      return;
    }

    // Remove active class from previous character
    if (currentMorseIndex > 0) {
      chars[currentMorseIndex - 1].classList.remove("active");
    }

    // Add active class to current character
    const currentChar = chars[currentMorseIndex];
    currentChar.classList.add("active");

    // Show morse code
    const char = morseCode[currentMorseIndex];
    if (char !== " ") {
      const morseSymbol = morseAlphabet[char] || "";
      currentChar.setAttribute("data-code", morseSymbol);

      // Play sound (optional)
      playMorseSound(char);
    }

    currentMorseIndex++;
  }, 800);
}

function pauseMorse() {
  if (!isMorsePlaying || !morseInterval) return;

  clearInterval(morseInterval);
  morseInterval = null;
  isMorsePlaying = false;

  document.getElementById("playBtn").disabled = false;
  document.getElementById("pauseBtn").disabled = true;
}

function resetMorse() {
  if (morseInterval) {
    clearInterval(morseInterval);
    morseInterval = null;
  }

  isMorsePlaying = false;
  initializeMorse();
}

function playMorseSound(char) {
  // Simple sound simulation
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    if (audioContext && char !== " ") {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      const morsePattern = morseAlphabet[char] || "";
      const duration = morsePattern.includes("-") ? 0.3 : 0.1;

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    }
  } catch (e) {
    console.log("Audio context error:", e);
  }
}

function createConfetti() {
  const revealBox = document.querySelector(".reveal-box");
  const colors = ["#ff6b8b", "#ff8e53", "#ff4081", "#4fc3f7", "#ffd700"];

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";

    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = `${Math.random() * 100}%`;
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.opacity = "0.8";
    confetti.style.width = `${Math.random() * 10 + 5}px`;
    confetti.style.height = confetti.style.width;
    confetti.style.animation = `pulse 0.5s ease-in-out ${Math.random() * 0.5}s`;

    revealBox.appendChild(confetti);

    // Remove confetti after animation
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.remove();
      }
    }, 2000);
  }
}

// ================ INITIALIZATION ================
document.addEventListener("DOMContentLoaded", function () {
  // Create loading effects
  createBubbles();
  createFloatingHearts();

  // Hide loading screen after delay
  setTimeout(() => {
    document.getElementById("loadingScreen").classList.add("hidden");
  }, 3000);

  // Initialize components
  updateGreeting();
  setInterval(updateGreeting, 60000); // Update every minute

  initializeMusicPlayer();
  updateGameStats();
  initializeMorse();

  // Show main page
  showPage("main");

  // Modal close handlers
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      const imageModal = document.getElementById("imageModal");
      const videoModal = document.getElementById("videoModal");

      if (imageModal.style.display === "flex") {
        closeModal();
      }
      if (videoModal.style.display === "flex") {
        closeVideoModal();
      }
    }
  });

  window.addEventListener("click", function (event) {
    const imageModal = document.getElementById("imageModal");
    const videoModal = document.getElementById("videoModal");

    if (event.target === imageModal) {
      closeModal();
    }
    if (event.target === videoModal) {
      closeVideoModal();
    }
  });

  // Auto-start music after user interaction
  document.addEventListener("click", function initAudioOnce() {
    if (audioPlayer.paused) {
      audioPlayer.play().catch((e) => console.log("Autoplay prevented"));
    }
    document.removeEventListener("click", initAudioOnce);
  });
});

// ================ SPECIAL GIFT FUNCTIONS ================
const specialGiftMedia = [
    { type: "image", src: "galeri/hbd/WhatsApp Image 2026-01-12 at 22.26.41 (1).jpeg", caption: "Special Moment" },
    { type: "image", src: "galeri/hbd/WhatsApp Image 2026-01-12 at 22.26.41.jpeg", caption: "Beautiful Memory" },
    { type: "video", src: "galeri/hbd/WhatsApp Video 2026-01-12 at 22.26.20 (1).mp4", caption: "Special Video 1" },
    { type: "video", src: "galeri/hbd/WhatsApp Video 2026-01-12 at 22.26.20.mp4", caption: "Special Video 2" },
    { type: "video", src: "galeri/hbd/WhatsApp Video 2026-01-12 at 22.26.40 (1).mp4", caption: "Special Video 3" },
    { type: "video", src: "galeri/hbd/WhatsApp Video 2026-01-12 at 22.26.40.mp4", caption: "Special Video 4" }
];

function initializeSpecialGift() {
    const container = document.getElementById("specialGiftContainer");
    if (!container) return;

    // Only populate if empty
    if (container.children.length === 0) {
        specialGiftMedia.forEach((media) => {
            const item = document.createElement("div");
            item.className = `gallery-item ${media.type}`;
            
            if (media.type === "image") {
                const img = document.createElement("img");
                img.src = media.src;
                img.alt = media.caption;
                img.loading = "lazy";
                item.appendChild(img);
                item.addEventListener("click", () => openImageModal(media.src, media.caption));
            } else if (media.type === "video") {
                const video = document.createElement("video");
                video.src = media.src;
                video.preload = "metadata";
                item.appendChild(video);
                item.addEventListener("click", () => openVideoModal(media.src));
            }

            const typeIndicator = document.createElement("div");
            typeIndicator.className = `media-type ${media.type}`;
            typeIndicator.textContent = media.type === "image" ? "PHOTO" : "VIDEO";
            item.appendChild(typeIndicator);

            container.appendChild(item);
        });
    }
}

function openGift() {
    const giftBox = document.getElementById('giftBox');
    const giftReveal = document.getElementById('giftReveal');
    const messageView = document.getElementById('messageView');
    const galleryView = document.getElementById('galleryView');
    
    // Animate Box
    giftBox.classList.add('open');
    
    // Wait for animation then show content
    setTimeout(() => {
        giftBox.style.display = 'none';
        giftReveal.style.display = 'block';
        
        // Show message first, hide gallery
        if(messageView) messageView.style.display = 'block';
        if(galleryView) galleryView.style.display = 'none';
        
        // Confetti
        createConfetti();
        
        // Play celebration sound if available
        playLevelUpSound(); // Reuse existing sound function
    }, 1000);
}

function showGiftGallery() {
    const messageView = document.getElementById('messageView');
    const galleryView = document.getElementById('galleryView');
    
    if(messageView) messageView.style.display = 'none';
    if(galleryView) galleryView.style.display = 'block';
    
    // Smooth scroll to top
    window.scrollTo(0, 0);
}

function showGiftMessage() {
    const messageView = document.getElementById('messageView');
    const galleryView = document.getElementById('galleryView');
    
    if(messageView) messageView.style.display = 'block';
    if(galleryView) galleryView.style.display = 'none';
    
    // Smooth scroll to top
    window.scrollTo(0, 0);
}

function resetGift() {
    const giftBox = document.getElementById('giftBox');
    const giftReveal = document.getElementById('giftReveal');
    const messageView = document.getElementById('messageView');
    const galleryView = document.getElementById('galleryView');
    
    giftReveal.style.display = 'none';
    giftBox.style.display = 'block';
    giftBox.classList.remove('open');
    
    // Reset views
    if(messageView) messageView.style.display = 'block';
    if(galleryView) galleryView.style.display = 'none';
}

function closeLockedModal() {
    const modal = document.getElementById('lockedModal');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// ================ QUIZ ABOUT US ================
const quizQuestions = [
    {
        question: "Musuh terbesar hubungan kita saat ini adalah...",
        options: ["Orang ketiga", "Jarak & Waktu 🥺", "Kuota habis", "Tukang paket"],
        correct: 1 // Index 1: Jarak & Waktu
    },
    {
        question: "Kegiatan wajib sebelum tidur anak LDR?",
        options: ["Sikat gigi", "Sleepcall sampe HP panas 🔥", "Nghayal doang", "Mimpiin dia"],
        correct: 1 // Index 1: Sleepcall
    },
    {
        question: "Kalimat paling horor saat lagi video call?",
        options: ["'Aku mau ngomong sesuatu...'", "'Sinyal kamu merah yank...'", "'Baterai lemah 2%'", "'Kamu gemukan ya?'"],
        correct: 1 // Index 1: Sinyal merah
    },
    {
        question: "Kapan kita bakal ketemu ?",
        options: ["Gak tau kapan 😭", "Tunggu liburan", "Secepatnya! (Aamiin)", "Nunggu tiket murah"],
        correct: 2 // Index 2: Secepatnya
    }
];

let currentQuestion = 0;
let quizScore = 0;

function startQuiz() {
    currentQuestion = 0;
    quizScore = 0;
    
    document.getElementById('quizIntro').style.display = 'none';
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizQuestion').style.display = 'block';
    
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        showQuizResult();
        return;
    }
    
    const q = quizQuestions[currentQuestion];
    const qText = document.getElementById('qText');
    const qOptions = document.getElementById('qOptions');
    const progress = document.getElementById('quizProgress');
    
    qText.textContent = q.question;
    qOptions.innerHTML = '';
    
    // Update progress
    progress.style.width = ((currentQuestion) / quizQuestions.length * 100) + '%';
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(index, btn);
        qOptions.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btnElement) {
    const q = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    
    // Disable all buttons
    options.forEach(btn => btn.disabled = true);
    
    if (selectedIndex === q.correct) {
        btnElement.classList.add('correct');
        quizScore++;
        // Play correct sound
    } else {
        btnElement.classList.add('wrong');
        options[q.correct].classList.add('correct'); // Show correct one
        // Play wrong sound
    }
    
    setTimeout(() => {
        currentQuestion++;
        loadQuestion();
    }, 1500);
}

function showQuizResult() {
    document.getElementById('quizQuestion').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';
    
    const scoreIcon = document.getElementById('scoreIcon');
    const scoreText = document.getElementById('scoreText');
    
    // Final progress bar full
    document.getElementById('quizProgress').style.width = '100%';

    if (quizScore === quizQuestions.length) {
        scoreIcon.textContent = "👮‍♂️";
        scoreText.textContent = `Lolos Investigasi (${quizScore}/${quizQuestions.length})! Kamu bebas dari tuduhan tidak peka! ❤️`;
        createConfetti();
    } else if (quizScore >= quizQuestions.length / 2) {
        scoreIcon.textContent = "👀";
        scoreText.textContent = `Hmm Mencurigakan (${quizScore}/${quizQuestions.length})... Perlu diinterogasi lebih lanjut nih! 🤨`;
    } else {
        scoreIcon.textContent = "�";
        scoreText.textContent = `DITAHAN! (${quizScore}/${quizQuestions.length})... Kamu harus dihukum traktir aku makan! 😤`;
    }
}

// Ensure showNotification is available (if not defined elsewhere)
if (typeof showNotification !== 'function') {
    window.showNotification = function(msg) {
        alert(msg); // Fallback
    };
}

// Add simple confetti if not exists
if (typeof createConfetti !== 'function') {
    window.createConfetti = function() {
        const colors = ['#ff6b8b', '#ff8e53', '#ffffff', '#FFD700'];
        for (let i = 0; i < 50; i++) {
            const p = document.createElement('div');
            p.style.position = 'fixed';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = '-10px';
            p.style.width = Math.random() * 10 + 5 + 'px';
            p.style.height = p.style.width;
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            p.style.borderRadius = '50%';
            p.style.zIndex = '9999';
            p.style.pointerEvents = 'none';
            document.body.appendChild(p);

            const duration = Math.random() * 2000 + 1500;
            const anim = p.animate([
                { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${Math.random() * 200 - 100}px, 100vh) rotate(720deg)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
            });

            anim.onfinish = () => p.remove();
        }
    };
}

