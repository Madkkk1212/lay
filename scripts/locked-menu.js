// ================ LOCKED MENU FUNCTIONS ================

function checkPasswordInput() {
  const input = document.getElementById("passwordInput");
  const message = document.getElementById("passwordMessage");

  // Hanya izinkan angka
  input.value = input.value.replace(/\D/g, "");

  if (input.value.length === 6) {
    if (input.value === "123123") {
      message.textContent = 'Password benar! Klik "Buka Ruangan"';
      message.style.color = "#2ecc71";
    } else {
      message.textContent = "Password salah. Coba lagi!";
      message.style.color = "#e74c3c";
    }
  } else {
    message.textContent = "";
  }
}

function togglePasswordVisibility() {
  const input = document.getElementById("passwordInput");
  const eyeIcon = document.getElementById("eyeIcon");

  if (input.type === "password") {
    input.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
}

function unlockSecretRoom() {
  const password = document.getElementById("passwordInput").value;
  const message = document.getElementById("passwordMessage");

  if (password === "123123") {
    // Password benar
    document.getElementById("secretRoom").style.display = "block";
    message.textContent = "Akses berhasil! Selamat datang.";
    message.style.color = "#2ecc71";

    // Update stats
    if (typeof addToTotalScore === "function") {
      addToTotalScore(50);
    }

    // Animasi sukses
    const secretRoom = document.getElementById("secretRoom");
    secretRoom.style.animation = "fadeIn 0.8s ease-in-out";

    // Tambahkan efek konfeti
    createConfetti();
  } else {
    // Password salah
    message.textContent = "Password salah! Coba lagi.";
    message.style.color = "#e74c3c";

    // Efek gagal
    const passwordInput = document.getElementById("passwordInput");
    passwordInput.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => {
      passwordInput.style.animation = "";
    }, 500);
  }
}

function createConfetti() {
  const colors = ["#ff6b9d", "#ff8e53", "#3498db", "#2ecc71", "#f1c40f"];

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
            top: -20px;
            left: ${Math.random() * 100}vw;
            animation: confettiFall ${1 + Math.random() * 2}s linear forwards;
            z-index: 9999;
        `;

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 2000);
  }
}

// Add confetti animation to CSS
const confettiStyle = document.createElement("style");
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);
