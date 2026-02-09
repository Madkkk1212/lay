// ================ NOTES FUNCTIONALITY ================

let notes = [];
let currentNoteId = null;
const NOTE_PASSWORD = "123123"; // Password untuk membuka buku harian

// Cek password input
function checkNotePasswordInput() {
  const input = document.getElementById("notePasswordInput");
  const message = document.getElementById("notePasswordMessage");

  // Hanya izinkan angka
  input.value = input.value.replace(/\D/g, "");

  if (input.value.length === 6) {
    if (input.value === NOTE_PASSWORD) {
      message.textContent = 'Password benar! Klik "Buka Buku Harian"';
      message.style.color = "#2ecc71";
    } else {
      message.textContent = "Password salah. Coba lagi!";
      message.style.color = "#e74c3c";
    }
  } else {
    message.textContent = "";
  }
}

// Toggle visibility password
function toggleNotePasswordVisibility() {
  const input = document.getElementById("notePasswordInput");
  const eyeIcon = document.getElementById("noteEyeIcon");

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

// Buka section catatan
function unlockNoteSection() {
  const password = document.getElementById("notePasswordInput").value;
  const message = document.getElementById("notePasswordMessage");

  if (password === NOTE_PASSWORD) {
    // Password benar
    document.getElementById("noteSection").style.display = "block";
    message.textContent = "Akses berhasil! Selamat menulis.";
    message.style.color = "#2ecc71";

    // Load notes dari localStorage
    loadNotes();

    // Set tanggal hari ini
    setTodayDate();

    // Update word count secara real-time
    document
      .getElementById("noteContent")
      .addEventListener("input", updateWordCount);
  } else {
    // Password salah
    message.textContent = "Password salah! Coba lagi.";
    message.style.color = "#e74c3c";

    // Efek gagal
    const passwordInput = document.getElementById("notePasswordInput");
    passwordInput.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => {
      passwordInput.style.animation = "";
    }, 500);
  }
}

// Load notes dari localStorage
function loadNotes() {
  try {
    const savedNotes = localStorage.getItem("lay_notes");
    if (savedNotes) {
      // Decode notes dari localStorage
      notes = JSON.parse(savedNotes);
      displayNotesList();

      if (notes.length > 0) {
        // Load note pertama
        loadNote(notes[0].id);
      }
    } else {
      notes = [];
      displayNotesList();
    }
  } catch (error) {
    console.error("Error loading notes:", error);
    notes = [];
    displayNotesList();
  }
}

// Simpan notes ke localStorage
function saveNotesToStorage() {
  try {
    localStorage.setItem("lay_notes", JSON.stringify(notes));
    updateLastSavedTime();
  } catch (error) {
    console.error("Error saving notes:", error);
    alert("Gagal menyimpan catatan. Coba lagi.");
  }
}

// Tampilkan daftar notes
function displayNotesList() {
  const notesList = document.getElementById("notesList");

  if (notes.length === 0) {
    notesList.innerHTML = `
            <div class="empty-notes">
                <i class="fas fa-edit"></i>
                <p>Belum ada catatan. Buat catatan pertama kamu!</p>
            </div>
        `;
    return;
  }

  // Urutkan notes berdasarkan tanggal (terbaru dulu)
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  notesList.innerHTML = sortedNotes
    .map(
      (note) => `
        <div class="note-item ${
          currentNoteId === note.id ? "active" : ""
        }" onclick="loadNote('${note.id}')">
            <div class="note-item-header">
                <h4 class="note-item-title">${note.title || "Tanpa Judul"}</h4>
                <span class="note-item-date">${formatDate(note.date)}</span>
            </div>
            <p class="note-item-preview">${note.content.substring(0, 100)}${
        note.content.length > 100 ? "..." : ""
      }</p>
            <div class="note-item-footer">
                <span><i class="fas fa-clock"></i> ${formatTime(
                  note.lastModified
                )}</span>
                <span><i class="fas fa-file-alt"></i> ${
                  note.content.split(/\s+/).length
                } kata</span>
            </div>
        </div>
    `
    )
    .join("");
}

// Format tanggal
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("id-ID", options);
}

// Format waktu
function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return formatDate(dateString);
}

// Buat catatan baru
function createNewNote() {
  const noteId = "note_" + Date.now();
  const now = new Date();

  currentNoteId = noteId;

  // Reset form
  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";
  setTodayDate();

  // Buat objek note baru (tidak disimpan sampai user menekan save)
  notes.push({
    id: noteId,
    title: "",
    content: "",
    date: now.toISOString().split("T")[0],
    lastModified: now.toISOString(),
  });

  displayNotesList();
  updateWordCount();

  // Fokus ke judul
  document.getElementById("noteTitle").focus();
}

// Load note yang dipilih
function loadNote(noteId) {
  const note = notes.find((n) => n.id === noteId);
  if (!note) return;

  currentNoteId = noteId;

  // Isi form
  document.getElementById("noteTitle").value = note.title || "";
  document.getElementById("noteContent").value = note.content || "";
  document.getElementById("noteDate").value = note.date;

  updateWordCount();
  updateLastSavedTime(note.lastModified);
  displayNotesList();

  // Fokus ke textarea
  setTimeout(() => {
    document.getElementById("noteContent").focus();
  }, 100);
}

// Simpan note
function saveNote() {
  if (!currentNoteId) {
    alert("Pilih atau buat catatan terlebih dahulu!");
    return;
  }

  const noteIndex = notes.findIndex((n) => n.id === currentNoteId);
  if (noteIndex === -1) {
    alert("Catatan tidak ditemukan!");
    return;
  }

  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();
  const date = document.getElementById("noteDate").value;
  const now = new Date();

  // Update note
  notes[noteIndex] = {
    ...notes[noteIndex],
    title: title || "Tanpa Judul",
    content,
    date: date || now.toISOString().split("T")[0],
    lastModified: now.toISOString(),
  };

  // Simpan ke localStorage
  saveNotesToStorage();
  displayNotesList();

  // Tampilkan notifikasi
  showNotification("Catatan berhasil disimpan!", "success");
}

// Hapus note saat ini
function deleteCurrentNote() {
  if (!currentNoteId) {
    alert("Tidak ada catatan yang dipilih!");
    return;
  }

  if (!confirm("Yakin ingin menghapus catatan ini?")) {
    return;
  }

  const noteIndex = notes.findIndex((n) => n.id === currentNoteId);
  if (noteIndex === -1) return;

  // Hapus note
  notes.splice(noteIndex, 1);

  // Reset form
  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";
  currentNoteId = null;

  // Update tampilan
  saveNotesToStorage();
  displayNotesList();
  updateWordCount();
  updateLastSavedTime();

  showNotification("Catatan berhasil dihapus!", "info");
}

// Set tanggal hari ini
function setTodayDate() {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  document.getElementById("noteDate").value = formattedDate;
}

// Update word count
function updateWordCount() {
  const content = document.getElementById("noteContent").value;
  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  document.getElementById("wordCount").textContent = wordCount;
}

// Update last saved time
function updateLastSavedTime(timeString) {
  const lastSavedEl = document.getElementById("lastSaved");

  if (!timeString) {
    lastSavedEl.textContent = "-";
    return;
  }

  lastSavedEl.textContent = formatTime(timeString);
}

// Tampilkan notifikasi
function showNotification(message, type = "info") {
  // Hapus notifikasi sebelumnya
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Buat notifikasi baru
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <i class="fas fa-${
          type === "success" ? "check-circle" : "info-circle"
        }"></i>
        <span>${message}</span>
    `;

  // Tambah style untuk notifikasi
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === "success" ? "#2ecc71" : "#3498db"};
        color: white;
        padding: 15px 25px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;

  document.body.appendChild(notification);

  // Auto-hide setelah 3 detik
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

// Tambah animasi CSS untuk notifikasi
const notificationStyle = document.createElement("style");
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// Auto-save setiap 30 detik
setInterval(() => {
  if (currentNoteId && document.getElementById("noteContent").value.trim()) {
    saveNote();
  }
}, 30000);

// Cegah kehilangan data saat tab/window ditutup
window.addEventListener("beforeunload", (event) => {
  if (currentNoteId && document.getElementById("noteContent").value.trim()) {
    saveNote();
    // Standard way to show confirmation dialog
    event.preventDefault();
    event.returnValue = "";
  }
});
