// ================ GALERI FUNCTIONS ================

const galeriItems = [
  {
    src: "galeri/1.jpg",
    caption: "Bunga",
    fallback:
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=500&q=80",
  },
  {
    src: "galeri/2.jpg",
    caption: "Kebersamaan",
    fallback:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=80",
  },
  {
    src: "galeri/3.jpg",
    caption: "Senyuman yang Menawan",
    fallback:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80",
  },
  {
    src: "galeri/4.jpg",
    caption: "Momen Spesial",
    fallback:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=500&q=80",
  },
  {
    src: "galeri/5.png",
    caption: "Hadiah Spesial ❤️",
    fallback:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=500&q=80",
  },
  {
    src: "galeri/8.jpg",
    caption: "Kenangan Indah",
    fallback:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=80",
  },
  {
    src: "galeri/9.jpg",
    caption: "Cantik",
    fallback:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
  },
  {
    src: "galeri/10.jpg",
    caption: "Momen Bahagia",
    fallback:
      "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=500&q=80",
  },
  {
    src: "galeri/12.jpg",
    caption: "Potret Cantik",
    fallback:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
  },
  {
    src: "galeri/14.jpg",
    caption: "Senyum Manis",
    fallback:
      "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&w=500&q=80",
  },
  {
    src: "galeri/16.jpg",
    caption: "Pose Cantik",
    fallback:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=500&q=80",
  },
  {
    src: "galeri/17.jpg",
    caption: "Kenangan Terindah",
    fallback:
      "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=500&q=80",
  },
];

function initGaleri() {
  const galeriContainer = document.getElementById("galeriContainer");

  // Kosongkan container terlebih dahulu
  galeriContainer.innerHTML = "";

  galeriItems.forEach((item, index) => {
    // Buat frame untuk setiap item
    const frame = document.createElement("div");
    frame.className = "royal-frame";

    // Buat item galeri
    const galeriItem = document.createElement("div");
    galeriItem.className = "galeri-item";

    // Buat elemen gambar
    const img = document.createElement("img");
    img.className = "galeri-img";
    img.alt = item.caption;

    // Coba load gambar asli, jika gagal gunakan fallback
    img.onload = function () {
      console.log(`Gambar ${item.caption} berhasil dimuat: ${item.src}`);
    };

    img.onerror = function () {
      console.warn(
        `Gambar ${item.caption} gagal dimuat, menggunakan fallback: ${item.src}`
      );
      this.src = item.fallback;
    };

    // Set sumber gambar
    img.src = item.src;

    // Buat caption
    const caption = document.createElement("div");
    caption.className = "galeri-caption";
    caption.textContent = item.caption;

    // Tambahkan elemen ke item galeri
    galeriItem.appendChild(img);
    galeriItem.appendChild(caption);

    // Tambahkan event listener untuk klik
    galeriItem.addEventListener("click", function (e) {
      e.stopPropagation();
      openModal(img.src, img.alt);
    });

    // Tambahkan item ke frame
    frame.appendChild(galeriItem);

    // Tambahkan frame ke container
    galeriContainer.appendChild(frame);
  });

  console.log(
    "Galeri berhasil diinisialisasi dengan",
    galeriItems.length,
    "item"
  );
}

function openModal(imageSrc, imageAlt) {
  const modal = document.getElementById("imageModal");
  const modalContent = document.querySelector(".modal-content");

  // Kosongkan modal content
  modalContent.innerHTML = "";

  // Buat gambar untuk modal
  const img = document.createElement("img");
  img.src = imageSrc;
  img.alt = imageAlt;
  img.className = "modal-img";

  // Handle error jika gambar modal gagal dimuat
  img.onerror = function () {
    // Coba cari fallback dari array galeriItems
    const item = galeriItems.find(
      (i) => i.src === imageSrc || i.caption === imageAlt
    );
    if (item && item.fallback) {
      this.src = item.fallback;
    }
  };

  // Buat tombol close
  const closeBtn = document.createElement("span");
  closeBtn.className = "close-modal";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = closeModal;

  // Tambahkan elemen ke modal content
  modalContent.appendChild(img);
  modalContent.appendChild(closeBtn);

  // Tampilkan modal
  modal.style.display = "flex";

  // Tambahkan animasi
  setTimeout(() => {
    modal.style.opacity = "1";
  }, 10);
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  modal.style.opacity = "0";

  setTimeout(() => {
    modal.style.display = "none";

    // Kosongkan modal content
    const modalContent = document.querySelector(".modal-content");
    if (modalContent) {
      modalContent.innerHTML = "";
    }
  }, 300);
}

// Close modal dengan Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const modal = document.getElementById("imageModal");
    if (
      modal.style.display === "flex" ||
      getComputedStyle(modal).display === "flex"
    ) {
      closeModal();
    }
  }
});

// Close modal dengan klik di luar gambar
window.addEventListener("click", function (event) {
  const modal = document.getElementById("imageModal");
  if (event.target === modal) {
    closeModal();
  }
});
