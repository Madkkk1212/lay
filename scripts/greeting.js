// ================ GREETING MESSAGE FUNCTIONALITY ================

function updateGreeting() {
  const now = new Date();

  // Convert to WIB (UTC+7)
  const wibOffset = 7 * 60 * 60 * 1000;
  const wibTime = new Date(now.getTime() + wibOffset);

  const hour = wibTime.getUTCHours();
  const minute = wibTime.getUTCMinutes();

  let greeting = "";
  let icon = "";

  // Determine greeting based on time
  if (hour >= 5 && hour < 10) {
    greeting = "Selamat Pagi, Ratu Cantikku!";
    icon = "fas fa-sun";
  } else if (hour >= 10 && hour < 15) {
    greeting = "Selamat Siang, Sayangku!";
    icon = "fas fa-sun";
  } else if (hour >= 15 && hour < 18) {
    greeting = "Selamat Sore, Manis!";
    icon = "fas fa-cloud-sun";
  } else if (hour >= 18 && hour < 21) {
    greeting = "Selamat Malam, Cintaku!";
    icon = "fas fa-moon";
  } else {
    greeting = "Selamat Malam, Sayangku!";
    icon = "fas fa-moon";
  }

  // Format time
  const formattedHour = hour.toString().padStart(2, "0");
  const formattedMinute = minute.toString().padStart(2, "0");
  const timeString = `${formattedHour}:${formattedMinute} WIB`;

  // Update greeting element
  const greetingContainer = document.getElementById("greetingContainer");

  // Create greeting message with animation
  greetingContainer.innerHTML = `
        <div class="greeting-message">
            <i class="${icon}"></i>
            <span>${greeting}</span>
        </div>
        <div class="greeting-time">${timeString}</div>
    `;

  // Random position for greeting
  const containerWidth = greetingContainer.offsetWidth;
  const windowWidth = window.innerWidth;

  let leftPosition = 50;
  if (containerWidth < windowWidth) {
    leftPosition = 10 + Math.random() * 80;
  }

  greetingContainer.style.left = `${leftPosition}%`;
  greetingContainer.style.transform = "translateX(-50%)";

  // Add random color variation based on time of day
  const greetingElement = greetingContainer.querySelector(".greeting-message");
  let color1, color2;

  if (hour >= 5 && hour < 12) {
    color1 = "#ff6b9d";
    color2 = "#ff8e53";
  } else if (hour >= 12 && hour < 17) {
    color1 = "#3498db";
    color2 = "#9b59b6";
  } else {
    color1 = "#8e44ad";
    color2 = "#3498db";
  }

  greetingElement.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;

  // Random animation delay
  const animationDelay = Math.random() * 2;
  greetingElement.style.animationDelay = `${animationDelay}s`;

  // Random message variations
  const messageVariations = {
    morning: [
      "Semoga harimu penuh berkah, Cantik!",
      "Pagi yang cerah untuk ratu hatiku!",
      "Bangun dengan senyuman ya, Sayang!",
    ],
    afternoon: [
      "Semoga siangmu menyenangkan, Manis!",
      "Jangan lupa makan siang, Cantik!",
      "Tetap semangat menjalani hari!",
    ],
    evening: [
      "Sore yang indah untuk wanita tercantik!",
      "Sudah minum cukup hari ini?",
      "Sore yang penuh warna untukmu!",
    ],
    night: [
      "Selamat beristirahat, Cintaku!",
      "Mimpi indah untuk ratu hatiku",
      "Jangan tidur terlalu larut ya",
    ],
  };

  // Add random message occasionally (30% chance)
  if (Math.random() > 0.7) {
    let messages;
    if (hour >= 5 && hour < 10) messages = messageVariations.morning;
    else if (hour >= 10 && hour < 15) messages = messageVariations.afternoon;
    else if (hour >= 15 && hour < 18) messages = messageVariations.evening;
    else messages = messageVariations.night;

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Show additional message temporarily
    const additionalMessage = document.createElement("div");
    additionalMessage.className = "greeting-time";
    additionalMessage.textContent = randomMessage;
    additionalMessage.style.marginTop = "5px";
    additionalMessage.style.animation = "fadeInOut 5s ease-in-out";
    additionalMessage.style.opacity = "0.8";

    greetingContainer.appendChild(additionalMessage);

    // Remove after 5 seconds
    setTimeout(() => {
      if (additionalMessage.parentNode === greetingContainer) {
        greetingContainer.removeChild(additionalMessage);
      }
    }, 5000);
  }
}

// Update greeting every minute and on page load
setInterval(updateGreeting, 60000);
window.addEventListener("load", updateGreeting);

// Also update when user comes back to tab
document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    updateGreeting();
  }
});
