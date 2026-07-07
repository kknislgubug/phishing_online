const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const body = document.body;
const toast = $("#toast");
const confetti = $("#confetti");
const missionFill = $("#missionFill");
const missionText = $("#missionText");
const pageProgress = $("#pageProgress");

const missions = {
  cerita: false,
  modus: false,
  chat: false,
  link: false,
  kuis: false,
  darurat: false,
};

const storySteps = [
  {
    sender: "Nomor baru",
    message: "Bu, ini undangan nikah saya. Buka file Undangan Nikah.apk ya.",
    question: "Apa keputusan paling aman?",
    choices: [
      {
        icon: "👆",
        label: "Langsung buka file",
        good: false,
        feedback: "Berisiko. File APK dari nomor tidak dikenal bisa memasang aplikasi berbahaya.",
      },
      {
        icon: "🛑",
        label: "Jangan buka, cek dulu pengirimnya",
        good: true,
        feedback: "Benar. Berhenti dulu adalah langkah aman saat melihat APK dari nomor baru.",
      },
      {
        icon: "↗️",
        label: "Kirim ke grup keluarga tanpa komentar",
        good: false,
        feedback: "Belum aman. Orang lain bisa ikut membuka file berbahaya. Lebih baik beri peringatan.",
      },
    ],
  },
  {
    sender: "Akun hadiah",
    message: "Selamat! Kamu dapat hadiah. Klik link dan bayar admin Rp50.000 sekarang.",
    question: "Apa tanda bahaya utamanya?",
    choices: [
      {
        icon: "🎁",
        label: "Hadiah mendadak dan diminta bayar admin",
        good: true,
        feedback: "Tepat. Hadiah palsu sering meminta biaya admin, data pribadi, atau klik link.",
      },
      {
        icon: "😊",
        label: "Kalimatnya sopan, jadi aman",
        good: false,
        feedback: "Tidak selalu. Penipu bisa memakai bahasa sopan agar terlihat meyakinkan.",
      },
      {
        icon: "💬",
        label: "Balas pesan dan minta link lain",
        good: false,
        feedback: "Masih berisiko. Jangan lanjutkan percakapan dengan akun mencurigakan.",
      },
    ],
  },
  {
    sender: "Anak?",
    message: "Ma, ini nomor baru. Tolong transfer sekarang, HP lama rusak.",
    question: "Bagaimana cara mengecek kebenarannya?",
    choices: [
      {
        icon: "📞",
        label: "Telepon nomor lama atau tanya keluarga lain",
        good: true,
        feedback: "Benar. Jangan percaya nomor baru sebelum konfirmasi lewat jalur lama yang sudah dikenal.",
      },
      {
        icon: "💸",
        label: "Transfer kecil dulu untuk memastikan",
        good: false,
        feedback: "Tetap berbahaya. Penipu biasanya mulai dari nominal kecil lalu meminta lebih banyak.",
      },
      {
        icon: "🔢",
        label: "Kirim kode OTP agar cepat dibantu",
        good: false,
        feedback: "Sangat berbahaya. OTP tidak boleh diberikan kepada siapa pun.",
      },
    ],
  },
];

const chatCases = [
  {
    sender: "Kurir Paket",
    incoming: [
      "Paket kamu gagal dikirim.",
      "Klik bit.ly/resi-cepat dan isi data sekarang supaya tidak dikembalikan.",
    ],
    responses: [
      { icon: "🔗", label: "Klik link untuk cek resi", risk: 95, good: false, feedback: "Berisiko tinggi. Link pendek dari chat bisa mengarah ke situs palsu." },
      { icon: "📦", label: "Buka aplikasi ekspedisi resmi", risk: 15, good: true, feedback: "Benar. Cek resi lewat aplikasi atau website resmi, bukan link acak." },
      { icon: "📝", label: "Isi data pribadi dulu", risk: 100, good: false, feedback: "Sangat berisiko. Data pribadi bisa dipakai mengambil alih akun." },
    ],
  },
  {
    sender: "Bank Palsu",
    incoming: [
      "Akun Anda akan diblokir dalam 10 menit.",
      "Kirim kode OTP agar petugas bisa membatalkan pemblokiran.",
    ],
    responses: [
      { icon: "🔢", label: "Kirim OTP agar cepat selesai", risk: 100, good: false, feedback: "Bahaya. OTP adalah kunci akun dan tidak boleh diberikan." },
      { icon: "🏦", label: "Tutup chat lalu hubungi bank resmi", risk: 10, good: true, feedback: "Tepat. Hubungi kanal resmi yang kamu cari sendiri." },
      { icon: "😰", label: "Balas karena takut akun diblokir", risk: 85, good: false, feedback: "Penipu sengaja membuat panik. Berhenti dulu." },
    ],
  },
  {
    sender: "Teman Tersimpan",
    incoming: [
      "Besok rapat jam 09.00 ya.",
      "Tidak ada link. Lokasinya di balai warga seperti biasa.",
    ],
    responses: [
      { icon: "✅", label: "Catat jadwalnya", risk: 5, good: true, feedback: "Lebih aman. Tidak ada link, APK, OTP, atau permintaan uang." },
      { icon: "🚫", label: "Langsung blokir teman", risk: 25, good: false, feedback: "Tidak perlu langsung blokir kalau kontak jelas dan isi pesan wajar." },
      { icon: "❓", label: "Tanya ulang kalau masih ragu", risk: 8, good: true, feedback: "Baik. Bertanya ulang adalah kebiasaan aman." },
    ],
  },
];

const slides = [
  { icon: "🛑", title: "STOP", text: "Semua pesan mendesak harus dihentikan sebentar. Penipu menang saat korban panik." },
  { icon: "👀", title: "CEK", text: "Cek pengirim, ejaan link, jenis file, dan permintaan data pribadi." },
  { icon: "🧑‍🤝‍🧑", title: "TANYA", text: "Konfirmasi ke keluarga, admin resmi, atau orang yang lebih paham sebelum bertindak." },
  { icon: "🔐", title: "OTP itu rahasia", text: "Kode OTP, PIN, dan password tidak boleh diberikan kepada siapa pun, termasuk yang mengaku petugas." },
  { icon: "📵", title: "APK jangan asal buka", text: "File APK dari chat bisa berbahaya. Install aplikasi hanya dari toko resmi." },
];

const quizItems = [
  {
    text: "Undangan nikah dikirim sebagai file Undangan.apk dari nomor baru.",
    scam: true,
    explain: "Penipuan atau sangat berisiko. File APK dari nomor baru jangan dibuka.",
  },
  {
    text: "Bank mengirim pesan: jangan berikan OTP kepada siapa pun.",
    scam: false,
    explain: "Ini lebih aman karena mengingatkan untuk tidak membagikan OTP.",
  },
  {
    text: "Akun hadiah meminta bayar admin sebelum uang cair.",
    scam: true,
    explain: "Berisiko. Hadiah palsu sering meminta biaya admin atau data pribadi.",
  },
  {
    text: "Teman tersimpan mengingatkan jadwal rapat tanpa link dan tanpa file.",
    scam: false,
    explain: "Ini lebih aman. Tidak ada link mencurigakan, APK, OTP, atau uang mendadak.",
  },
  {
    text: "Nomor baru mengaku anak dan meminta transfer segera.",
    scam: true,
    explain: "Berisiko. Konfirmasi lewat nomor lama atau keluarga lain sebelum transfer.",
  },
];

let storyIndex = 0;
let chatIndex = 0;
let slideIndex = 0;
let quizIndex = 0;
let quizScore = 0;
let quizLocked = false;
let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function completeMission(key) {
  if (!missions[key]) {
    missions[key] = true;
    const item = document.querySelector(`[data-mission-item="${key}"]`);
    if (item) item.classList.add("done");
  }

  const done = Object.values(missions).filter(Boolean).length;
  missionText.textContent = `${done}/6 selesai`;
  missionFill.style.width = `${(done / 6) * 100}%`;

  if (done === 6) {
    showToast("Mantap. Semua misi belajar sudah dicoba.");
    launchConfetti(42);
  }
}

function setBox(element, message, type = "") {
  element.classList.remove("good", "bad");
  if (type) element.classList.add(type);
  element.textContent = message;
}

function launchConfetti(amount = 24) {
  if (body.classList.contains("reduce-motion")) return;
  confetti.innerHTML = "";
  const colors = ["#ffd84d", "#7030a0", "#073b78", "#137333", "#c1121f"];

  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("i");
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.45}s`;
    piece.style.transform = `rotate(${Math.random() * 120}deg)`;
    confetti.appendChild(piece);
  }

  setTimeout(() => {
    confetti.innerHTML = "";
  }, 1900);
}

function renderStory() {
  const step = storySteps[storyIndex];
  $("#storySender").textContent = step.sender;
  $("#storyMessage").textContent = step.message;
  $("#storyStep").textContent = `Langkah ${storyIndex + 1} dari ${storySteps.length}`;
  $("#storyQuestion").textContent = step.question;
  $("#storyFeedback").textContent = "Pilih salah satu keputusan untuk melihat akibatnya.";
  $("#storyFeedback").classList.remove("good", "bad");

  const container = $("#storyChoices");
  container.innerHTML = "";

  step.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-btn";
    button.innerHTML = `<span aria-hidden="true">${choice.icon}</span><strong>${choice.label}</strong>`;
    button.addEventListener("click", () => {
      setBox($("#storyFeedback"), choice.feedback, choice.good ? "good" : "bad");
      if (choice.good) {
        completeMission("cerita");
        launchConfetti(14);
        setTimeout(() => {
          storyIndex = (storyIndex + 1) % storySteps.length;
          renderStory();
        }, 1500);
      } else {
        showToast("Coba cari pilihan yang membuat kamu berhenti dan cek dulu.");
      }
    });
    container.appendChild(button);
  });
}

function renderChat() {
  const data = chatCases[chatIndex];
  $("#chatSender").textContent = data.sender;
  const area = $("#chatArea");
  area.innerHTML = "";

  data.incoming.forEach((message, index) => {
    const bubble = document.createElement("div");
    bubble.className = "chat-message";
    bubble.style.animationDelay = `${index * 0.18}s`;
    bubble.innerHTML = `<strong>${data.sender}</strong><p>${message}</p>`;
    area.appendChild(bubble);
  });

  const responseGrid = $("#responseGrid");
  responseGrid.innerHTML = "";
  $("#riskFill").style.width = "0%";
  $("#riskLabel").textContent = "Belum dinilai";
  setBox($("#chatFeedback"), "Pilih respons untuk melihat apakah keputusanmu aman.");

  data.responses.forEach((response) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "response-btn";
    button.innerHTML = `<span aria-hidden="true">${response.icon}</span><strong>${response.label}</strong>`;
    button.addEventListener("click", () => answerChat(response));
    responseGrid.appendChild(button);
  });
}

function answerChat(response) {
  const area = $("#chatArea");
  const reply = document.createElement("div");
  reply.className = "chat-message me";
  reply.innerHTML = `<strong>Saya</strong><p>${response.label}</p>`;
  area.appendChild(reply);
  area.scrollTop = area.scrollHeight;

  $("#riskFill").style.width = `${response.risk}%`;
  $("#riskLabel").textContent = response.risk >= 70 ? "Risiko tinggi" : response.risk >= 30 ? "Perlu hati-hati" : "Lebih aman";
  setBox($("#chatFeedback"), response.feedback, response.good ? "good" : "bad");

  if (response.good) {
    completeMission("chat");
    launchConfetti(16);
  } else {
    showToast("Risiko tinggi. Ingat: STOP • CEK • TANYA.");
  }
}

function renderSlide() {
  const slide = slides[slideIndex];
  $("#carousel").innerHTML = `
    <article class="slide-card">
      <span class="slide-icon" aria-hidden="true">${slide.icon}</span>
      <div>
        <p class="eyebrow">Kartu ${slideIndex + 1} dari ${slides.length}</p>
        <h3>${slide.title}</h3>
        <p>${slide.text}</p>
      </div>
    </article>
  `;
}

function renderQuiz() {
  const item = quizItems[quizIndex];
  quizLocked = false;
  $("#quizCount").textContent = `Soal ${quizIndex + 1} dari ${quizItems.length}`;
  $("#quizQuestion").textContent = item.text;
  setBox($("#quizFeedback"), "Pilih jawaban.");
}

function answerQuiz(answer) {
  if (quizLocked) return;
  quizLocked = true;

  const item = quizItems[quizIndex];
  const answerScam = answer === "scam";
  const correct = answerScam === item.scam;

  if (correct) {
    quizScore += 1;
    $("#quizScore").textContent = quizScore;
    setBox($("#quizFeedback"), `Benar. ${item.explain}`, "good");
    launchConfetti(12);
  } else {
    setBox($("#quizFeedback"), `Belum tepat. ${item.explain}`, "bad");
  }

  setTimeout(() => {
    quizIndex += 1;
    if (quizIndex >= quizItems.length) {
      const total = quizItems.length;
      const message = quizScore >= 4
        ? `Kuis selesai. Skor ${quizScore}/${total}. Pemahaman sudah kuat.`
        : `Kuis selesai. Skor ${quizScore}/${total}. Coba ulangi pelan-pelan.`;
      setBox($("#quizFeedback"), message, quizScore >= 4 ? "good" : "bad");
      completeMission("kuis");
      if (quizScore >= 4) launchConfetti(34);
      return;
    }
    renderQuiz();
  }, 1500);
}

function resetQuiz() {
  quizIndex = 0;
  quizScore = 0;
  $("#quizScore").textContent = "0";
  renderQuiz();
}

function checkLink() {
  const raw = $("#linkInput").value.trim().toLowerCase();
  let message = "Belum tentu aman. Cek lagi sumber dan alamat websitenya.";
  let type = "bad";

  if (!raw) {
    message = "Ketik link dulu.";
  } else if (raw.includes("bit.ly") || raw.includes("s.id") || raw.includes("tinyurl") || raw.includes("short")) {
    message = "Risiko tinggi. Link pendek menyembunyikan alamat asli. Jangan klik dari pesan acak.";
  } else if (raw.includes("http://")) {
    message = "Perlu hati-hati. Alamat tanpa HTTPS lebih mudah disalahgunakan.";
  } else if (raw.includes("bca.co.id") || raw.includes("go.id") || raw.includes("sch.id") || raw.includes("ac.id")) {
    message = "Terlihat lebih resmi, tetapi tetap pastikan kamu mengetik alamatnya sendiri, bukan dari chat mencurigakan.";
    type = "good";
  } else if (raw.includes("login") || raw.includes("hadiah") || raw.includes("gratis") || raw.includes("claim")) {
    message = "Waspada. Kata seperti login, hadiah, gratis, atau claim sering dipakai untuk menjebak.";
  }

  setBox($("#linkResult"), message, type);
  completeMission("link");
  if (type === "good") launchConfetti(10);
}

function checkFile() {
  const raw = $("#fileInput").value.trim().toLowerCase();
  let message = "Belum tentu aman. Cek pengirim, konteks, dan sumber file.";
  let type = "bad";

  if (!raw) {
    message = "Ketik nama file dulu.";
  } else if (raw.endsWith(".apk")) {
    message = "Bahaya. APK adalah file aplikasi. Jangan buka APK dari WA/SMS atau nomor tidak dikenal.";
  } else if (raw.endsWith(".exe") || raw.endsWith(".bat") || raw.endsWith(".scr")) {
    message = "Bahaya tinggi. Ini file program/script dan jangan dibuka sembarangan.";
  } else if (raw.endsWith(".jpg") || raw.endsWith(".png") || raw.endsWith(".jpeg")) {
    message = "Lebih umum sebagai gambar. Tetap cek pengirim dan jangan klik link tambahan.";
    type = "good";
  } else if (raw.endsWith(".pdf")) {
    message = "PDF lebih umum untuk dokumen. Tetap jangan isi data pribadi dari link di dalam PDF.";
    type = "good";
  }

  setBox($("#fileResult"), message, type);
  completeMission("link");
  if (type === "good") launchConfetti(10);
}

function updateChecklist() {
  const checked = $$(".safe-check").filter((item) => item.checked).length;
  const result = $("#checklistResult");

  if (checked === 0) {
    setBox(result, "Belum ada yang dicek. Jangan klik dulu.", "bad");
  } else if (checked < 4) {
    setBox(result, `${checked}/4 sudah dicek. Masih perlu hati-hati sebelum klik.`, "bad");
  } else {
    setBox(result, "4/4 sudah dicek. Keputusan lebih aman, tetapi tetap gunakan akal sehat.", "good");
    completeMission("link");
    launchConfetti(12);
  }
}

function speakPage() {
  if (!("speechSynthesis" in window)) {
    showToast("Browser ini belum mendukung fitur bacakan.");
    return;
  }

  const text = [
    "Awas Klik.",
    "Belajar mengenali penipuan online dengan cara interaktif.",
    "Rumus aman adalah Stop, Cek, Tanya.",
    "Jangan buka file APK dari nomor tidak dikenal.",
    "Jangan berikan OTP, PIN, atau password kepada siapa pun.",
    "Cek link lewat website resmi dan tanya orang terpercaya kalau ragu.",
  ].join(" ");

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
  showToast("Halaman sedang dibacakan.");
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.id === "darurat") completeMission("darurat");
        }
      });
    },
    { threshold: 0.16 }
  );

  $$(".reveal, #darurat").forEach((element) => observer.observe(element));
}

function initNavProgress() {
  const sections = ["cerita", "modus", "simulasi", "lab", "kuis", "darurat"].map((id) => document.getElementById(id));
  const links = $$(".main-nav a");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    pageProgress.style.width = `${Math.max(0, Math.min(100, (scrollTop / height) * 100))}%`;

    let activeId = "";
    sections.forEach((section) => {
      if (section && section.offsetTop - 140 <= scrollTop) activeId = section.id;
    });

    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
    });
  });
}

function initEvents() {
  $("#fontUpBtn").addEventListener("click", (event) => {
    body.classList.toggle("large-text");
    event.currentTarget.setAttribute("aria-pressed", body.classList.contains("large-text"));
  });

  $("#contrastBtn").addEventListener("click", (event) => {
    body.classList.toggle("high-contrast");
    event.currentTarget.setAttribute("aria-pressed", body.classList.contains("high-contrast"));
  });

  $("#motionBtn").addEventListener("click", (event) => {
    body.classList.toggle("reduce-motion");
    event.currentTarget.setAttribute("aria-pressed", body.classList.contains("reduce-motion"));
  });

  $("#speakBtn").addEventListener("click", speakPage);

  $(".menu-toggle").addEventListener("click", (event) => {
    const open = event.currentTarget.getAttribute("aria-expanded") === "true";
    event.currentTarget.setAttribute("aria-expanded", String(!open));
    $("#mainNav").classList.toggle("open", !open);
    $(".accessibility-tools").classList.toggle("open", !open);
  });

  $$(".hotspot").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".hotspot").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const explain = $("#hotspotExplain");
      explain.innerHTML = `<span class="panel-icon">⚠️</span><h3>Ini tanda bahaya</h3><p>${button.dataset.hotspot}</p>`;
      completeMission("modus");
    });
  });

  $$(".flip-card").forEach((card) => {
    card.addEventListener("click", () => {
      $$(".flip-card").forEach((item) => item.classList.remove("flipped"));
      card.classList.add("flipped");
      setBox($("#cardExplain"), card.dataset.card, "good");
      completeMission("modus");
    });
  });

  $("#nextChatBtn").addEventListener("click", () => {
    chatIndex = (chatIndex + 1) % chatCases.length;
    renderChat();
  });

  $("#checkLinkBtn").addEventListener("click", checkLink);
  $("#checkFileBtn").addEventListener("click", checkFile);
  $$(".safe-check").forEach((item) => item.addEventListener("change", updateChecklist));

  $("#prevSlide").addEventListener("click", () => {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    renderSlide();
  });

  $("#nextSlide").addEventListener("click", () => {
    slideIndex = (slideIndex + 1) % slides.length;
    renderSlide();
  });

  $$("[data-quiz-answer]").forEach((button) => {
    button.addEventListener("click", () => answerQuiz(button.dataset.quizAnswer));
  });

  $("#restartQuizBtn").addEventListener("click", resetQuiz);

  $("#coachBtn").addEventListener("click", () => {
    const box = $("#coachBox");
    box.hidden = !box.hidden;
  });
}

renderStory();
renderChat();
renderSlide();
renderQuiz();
initEvents();
initReveal();
initNavProgress();
