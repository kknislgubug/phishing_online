const scamMessages = [
  {
    sender: "Nomor tidak dikenal",
    text: "Bu, ini undangan nikah saya. Buka file Undangan Nikah.apk ya.",
    safe: false,
    explain: "Ini bahaya. Ada file APK dari nomor tidak dikenal. Jangan dibuka.",
  },
  {
    sender: "Kurir paket",
    text: "Paket kamu gagal dikirim. Klik bit.ly/resi-cepat untuk konfirmasi.",
    safe: false,
    explain: "Ini mencurigakan. Link pendek dan memaksa klik. Cek di aplikasi ekspedisi resmi.",
  },
  {
    sender: "Anak",
    text: "Ma, ini nomor baru. Tolong transfer sekarang, HP lama rusak.",
    safe: false,
    explain: "Jangan langsung percaya. Telepon nomor lama atau tanya keluarga dulu.",
  },
  {
    sender: "Tetangga tersimpan",
    text: "Bu, foto kegiatan KWT sudah saya kirim sebagai Foto Kegiatan.jpg.",
    safe: true,
    explain: "Lebih aman karena file foto biasa dan dari kontak dikenal. Tetap cek kalau ragu.",
  },
];

const quizItems = [
  {
    text: "Selamat! Ibu menang hadiah Rp5.000.000. Klik link ini dan bayar admin Rp50.000.",
    scam: true,
    explain: "Penipuan. Hadiah palsu sering minta klik link dan bayar admin.",
  },
  {
    text: "Kode OTP BCA Anda 482910. Jangan berikan kode ini kepada siapa pun.",
    scam: false,
    explain: "Ini peringatan OTP. Yang penting: jangan berikan kodenya ke siapa pun.",
  },
  {
    text: "Saya polisi. Kirim kode 6 angka SMS agar kasus ibu bisa dibantu.",
    scam: true,
    explain: "Penipuan. Polisi, bank, dan kurir tidak boleh meminta kode OTP.",
  },
  {
    text: "Undangan arisan.apk dikirim dari nomor baru. Buka dulu ya Bu.",
    scam: true,
    explain: "Penipuan. File APK dari nomor baru harus ditolak.",
  },
  {
    text: "Grup KWT: Besok kumpul jam 09.00 di balai. Tidak ada link dan tidak ada file.",
    scam: false,
    explain: "Pesan ini lebih aman. Tidak ada link aneh, APK, atau permintaan kode.",
  },
];

const progress = {
  scamCard: false,
  simulator: false,
  quiz: false,
  apk: false,
  emergency: false,
};

let currentMessage = 0;
let currentQuiz = 0;
let quizScore = 0;
let quizAnswered = false;
let toastTimer = 0;

const safeMeter = document.querySelector("#safeMeter");
const safeScoreText = document.querySelector("#safeScoreText");
const reasonPanel = document.querySelector("#reasonPanel");
const chatList = document.querySelector("#chatList");
const simFeedback = document.querySelector("#simFeedback");
const nextMessageBtn = document.querySelector("#nextMessageBtn");
const quizLabel = document.querySelector("#quizLabel");
const quizQuestion = document.querySelector("#quizQuestion");
const quizFeedback = document.querySelector("#quizFeedback");
const quizScoreText = document.querySelector("#quizScore");
const fileNameInput = document.querySelector("#fileNameInput");
const fileResult = document.querySelector("#fileResult");
const toast = document.querySelector("#toast");

function updateProgress(key) {
  progress[key] = true;
  const done = Object.values(progress).filter(Boolean).length;
  safeMeter.style.width = `${(done / 5) * 100}%`;
  safeScoreText.textContent = `${done} dari 5 langkah`;

  if (done === 5) {
    showToast("Mantap, Bu. Semua latihan utama sudah dicoba.");
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function setFeedback(element, message, type) {
  element.textContent = message;
  element.classList.remove("is-good", "is-bad");
  if (type) {
    element.classList.add(type === "good" ? "is-good" : "is-bad");
  }
}

function renderMessage() {
  const message = scamMessages[currentMessage];
  chatList.innerHTML = `
    <div class="chat-message">
      <strong>${message.sender}</strong>
      <p>${message.text}</p>
    </div>
  `;
  setFeedback(simFeedback, "Pilih jawaban dulu, Bu.", "");
}

function answerSimulator(choice) {
  const message = scamMessages[currentMessage];
  const correct = choice === "ask";

  if (correct) {
    setFeedback(simFeedback, `Benar. ${message.explain}`, "good");
    updateProgress("simulator");
  } else {
    const prefix = message.safe ? "Lebih baik tetap cek dulu." : "Hampir kena.";
    setFeedback(simFeedback, `${prefix} ${message.explain}`, "bad");
  }
}

function nextMessage() {
  currentMessage = (currentMessage + 1) % scamMessages.length;
  renderMessage();
}

function renderQuiz() {
  const item = quizItems[currentQuiz];
  quizAnswered = false;
  quizLabel.textContent = `Pesan ${currentQuiz + 1} dari ${quizItems.length}`;
  quizQuestion.textContent = item.text;
  setFeedback(quizFeedback, "Jawab dulu, nanti penjelasannya muncul.", "");
}

function answerQuiz(answerScam) {
  if (quizAnswered) {
    return;
  }

  quizAnswered = true;
  const item = quizItems[currentQuiz];
  const correct = answerScam === item.scam;

  if (correct) {
    quizScore += 1;
    quizScoreText.textContent = String(quizScore);
    setFeedback(quizFeedback, `Benar. ${item.explain}`, "good");
  } else {
    setFeedback(quizFeedback, `Belum tepat. ${item.explain}`, "bad");
  }

  window.setTimeout(() => {
    currentQuiz += 1;
    if (currentQuiz >= quizItems.length) {
      const total = quizItems.length;
      const message =
        quizScore >= 4
          ? `Kuis selesai. Skor ${quizScore}/${total}. Ibu sudah jago curiga.`
          : `Kuis selesai. Skor ${quizScore}/${total}. Yuk ulangi pelan-pelan.`;
      setFeedback(quizFeedback, message, quizScore >= 4 ? "good" : "bad");
      currentQuiz = 0;
      quizScore = 0;
      quizScoreText.textContent = "0";
      updateProgress("quiz");
      return;
    }
    renderQuiz();
  }, 1800);
}

function checkFileName() {
  const value = fileNameInput.value.trim().toLowerCase();

  if (!value) {
    setFeedback(fileResult, "Ketik nama file dulu, Bu.", "bad");
    return;
  }

  if (value.endsWith(".apk")) {
    setFeedback(fileResult, "Bahaya. Ini APK. Jangan dibuka kalau bukan dari sumber resmi.", "bad");
  } else if (value.endsWith(".jpg") || value.endsWith(".png") || value.endsWith(".jpeg")) {
    setFeedback(fileResult, "Ini terlihat seperti foto. Tetap cek pengirimnya dulu.", "good");
  } else if (value.startsWith("http") || value.includes("bit.ly")) {
    setFeedback(fileResult, "Ini link. Jangan klik kalau alamatnya tidak resmi atau bikin panik.", "bad");
  } else {
    setFeedback(fileResult, "Belum tentu aman. Cek pengirim, jenis file, dan tanya dulu kalau ragu.", "bad");
  }

  updateProgress("apk");
}

function readMainLesson() {
  const text = [
    "Jangan asal klik, Bu.",
    "Kalau ada pesan mencurigakan, ingat rumusnya.",
    "Stop. Cek. Tanya.",
    "Jangan buka file APK dari nomor tidak dikenal.",
    "Jangan berikan kode OTP kepada siapa pun.",
  ].join(" ");

  if (!("speechSynthesis" in window)) {
    showToast("Browser ini belum mendukung fitur bacakan.");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
}

document.querySelectorAll(".scam-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".scam-card").forEach((item) => item.classList.remove("is-active"));
    card.classList.add("is-active");
    reasonPanel.innerHTML = `
      <strong>Kenapa harus hati-hati?</strong>
      <p>${card.dataset.reason}</p>
    `;
    updateProgress("scamCard");
  });
});

document.querySelectorAll("[data-choice]").forEach((button) => {
  button.addEventListener("click", () => answerSimulator(button.dataset.choice));
});

document.querySelectorAll(".fake-file").forEach((button) => {
  button.addEventListener("click", () => {
    fileNameInput.value = button.textContent.trim();
    checkFileName();
  });
});

document.querySelectorAll("#emergencySteps button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("is-done");
    updateProgress("emergency");
  });
});

nextMessageBtn.addEventListener("click", nextMessage);
document.querySelector("#quizScamBtn").addEventListener("click", () => answerQuiz(true));
document.querySelector("#quizSafeBtn").addEventListener("click", () => answerQuiz(false));
document.querySelector("#checkFileBtn").addEventListener("click", checkFileName);
fileNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkFileName();
  }
});
document.querySelector("#readPageBtn").addEventListener("click", readMainLesson);

renderMessage();
renderQuiz();
setFeedback(fileResult, "Contoh: Undangan Nikah.apk, CEK RESI.apk, atau Foto Kegiatan.jpg.", "");
