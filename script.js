const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const toast = $('#toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
}

// Reading progress
const progress = $('#readingProgress');
function updateProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const percent = height > 0 ? (scrollTop / height) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Section active state
const navLinks = $$('.main-nav a');
const sections = navLinks.map(link => $(link.getAttribute('href'))).filter(Boolean);
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { threshold: 0.45 });
sections.forEach(section => sectionObserver.observe(section));

// Reveal animation
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.16 });
$$('.reveal').forEach(item => revealObserver.observe(item));

// Header accessibility buttons were removed to keep the page cleaner and simpler.
// Low-vision support is now built into the base layout: large text, high contrast,
// wide buttons, and consistent spacing.

// Help button
$('#helpBtn').addEventListener('click', () => {
  showToast('Petunjuk: mulai dari Simulasi, tekan pilihan, lalu baca hasilnya. Rumus aman: STOP, CEK, TANYA.');
});

// Story interaction
const storySteps = [
  {
    step: 'Langkah 1 dari 3',
    question: 'Ada file “Undangan Nikah.apk”. Apa yang paling aman?',
    choices: [
      { text: 'Buka file karena penasaran', safe: false, feedback: 'Berisiko. File APK dari orang tidak dikenal bisa mencuri data.' },
      { text: 'Hapus pesan dan tanya orang yang dikenal', safe: true, feedback: 'Aman. Sari berhenti dulu dan mengecek lewat orang terpercaya.' },
      { text: 'Teruskan ke grup keluarga', safe: false, feedback: 'Kurang aman. Pesan berbahaya bisa menyebar ke orang lain.' }
    ]
  },
  {
    step: 'Langkah 2 dari 3',
    question: 'Ada link hadiah dengan batas waktu 5 menit. Apa yang dilakukan?',
    choices: [
      { text: 'Klik cepat sebelum habis', safe: false, feedback: 'Berisiko. Batas waktu sering dipakai agar korban panik.' },
      { text: 'Cek alamat resmi sendiri', safe: true, feedback: 'Aman. Jangan masuk dari link pesan; ketik alamat resmi sendiri.' },
      { text: 'Masukkan data dulu, cek nanti', safe: false, feedback: 'Berbahaya. Data pribadi tidak boleh diberikan ke link tidak jelas.' }
    ]
  },
  {
    step: 'Langkah 3 dari 3',
    question: 'Ada orang mengaku petugas meminta OTP. Apa jawaban aman?',
    choices: [
      { text: 'Berikan OTP supaya cepat selesai', safe: false, feedback: 'Sangat berbahaya. OTP adalah kunci akun.' },
      { text: 'Tolak dan hubungi kanal resmi', safe: true, feedback: 'Tepat. OTP tidak boleh diberikan kepada siapa pun.' },
      { text: 'Kirim sebagian angka OTP saja', safe: false, feedback: 'Tetap berbahaya. Jangan kirim angka OTP sedikit pun.' }
    ]
  }
];
let storyIndex = 0;
const storyStep = $('#storyStep');
const storyQuestion = $('#storyQuestion');
const storyFeedback = $('#storyFeedback');
const storyChoices = $('#storyChoices');
function renderStory() {
  const item = storySteps[storyIndex];
  storyStep.textContent = item.step;
  storyQuestion.textContent = item.question;
  storyChoices.innerHTML = '';
  item.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = choice.text;
    btn.addEventListener('click', () => {
      $$('.choice-grid button', storyChoices.parentElement).forEach(button => button.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      storyFeedback.textContent = choice.feedback;
      showToast(choice.safe ? 'Pilihan aman.' : 'Hati-hati, pilihan itu berisiko.');
      if (choice.safe) {
        setTimeout(() => {
          storyIndex = (storyIndex + 1) % storySteps.length;
          renderStory();
        }, 1450);
      }
    });
    storyChoices.appendChild(btn);
  });
}
renderStory();

// Hotspot explanation
$$('.hotspot').forEach(button => {
  button.addEventListener('click', () => {
    $('#hotspotInfo').innerHTML = `<strong>Tanda bahaya</strong><p>${button.dataset.info}</p>`;
    showToast('Tanda bahaya berhasil ditemukan.');
  });
});

// Simulation decisions
$$('.decision-btn').forEach(button => {
  button.addEventListener('click', () => {
    const risk = Number(button.dataset.risk);
    $('#riskFill').style.width = `${risk}%`;
    $('#riskText').textContent = risk >= 80 ? 'Sangat tinggi' : risk >= 50 ? 'Tinggi' : 'Rendah';
    showToast(button.dataset.message);
  });
});

// Checkers
$('#linkBtn').addEventListener('click', () => {
  const value = $('#linkInput').value.trim().toLowerCase();
  const result = $('#linkResult');
  if (!value) {
    result.textContent = 'Masukkan link terlebih dahulu.';
    return;
  }
  const redFlags = ['bit.ly', 'tinyurl', 'gratis', 'hadiah', 'cepat', 'otp', 'login-', 'akun', 'bantuan'];
  const risky = redFlags.some(flag => value.includes(flag));
  result.textContent = risky
    ? 'Waspada. Link ini punya ciri mencurigakan. Jangan klik sebelum cek kanal resmi.'
    : 'Belum terlihat ciri mencurigakan, tetapi tetap cek alamat resmi dan pengirimnya.';
});

$('#fileBtn').addEventListener('click', () => {
  const value = $('#fileInput').value.trim().toLowerCase();
  const result = $('#fileResult');
  if (!value) {
    result.textContent = 'Masukkan nama file terlebih dahulu.';
    return;
  }
  const dangerous = ['.apk', '.exe', '.scr', '.bat', '.js'].some(ext => value.endsWith(ext));
  result.textContent = dangerous
    ? 'Berisiko tinggi. Jangan buka file ini dari pesan tidak dikenal.'
    : 'Lebih aman, tetapi tetap pastikan file berasal dari orang atau website resmi.';
});

// Quiz
const quiz = [
  {
    q: 'Apa yang paling aman saat menerima file APK dari nomor baru?',
    a: ['Buka file', 'Hapus dan blokir', 'Kirim ke teman'],
    correct: 1,
    feedback: 'Benar. File APK dari nomor tidak dikenal harus dihindari.'
  },
  {
    q: 'Bolehkah kode OTP diberikan ke orang yang mengaku petugas?',
    a: ['Tidak boleh', 'Boleh kalau mendesak', 'Boleh sebagian'],
    correct: 0,
    feedback: 'Benar. OTP tidak boleh dibagikan.'
  },
  {
    q: 'Apa rumus aman sebelum klik?',
    a: ['Cepat, klik, selesai', 'STOP, CEK, TANYA', 'Balas, tunggu, klik'],
    correct: 1,
    feedback: 'Benar. STOP, CEK, TANYA.'
  }
];
let quizIndex = 0;
let score = 0;
const quizQuestion = $('#quizQuestion');
const quizChoices = $('#quizChoices');
const quizFeedback = $('#quizFeedback');
const quizScore = $('#quizScore');
function renderQuiz() {
  const item = quiz[quizIndex];
  quizQuestion.textContent = item.q;
  quizChoices.innerHTML = '';
  item.a.forEach((answer, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = answer;
    btn.addEventListener('click', () => {
      if (index === item.correct) {
        score += 1;
        quizFeedback.textContent = item.feedback;
        showToast('Jawaban benar.');
      } else {
        quizFeedback.textContent = 'Belum tepat. Ingat: jangan klik, jangan beri OTP, dan cek sumber resmi.';
        showToast('Coba ingat rumus STOP, CEK, TANYA.');
      }
      quizScore.textContent = `Skor ${score}`;
      setTimeout(() => {
        quizIndex = (quizIndex + 1) % quiz.length;
        renderQuiz();
      }, 1500);
    });
    quizChoices.appendChild(btn);
  });
}
renderQuiz();
