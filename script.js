const screenEl = document.getElementById("screen");
const ribbonText = document.getElementById("ribbonText");
const toastEl = document.getElementById("toast");
const buddy = document.getElementById("cornerBuddy");

let heartCount = 0;
let currentQuiz = 0;
let selectedCorrect = false;
let flowerCount = 0;

function setRealHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

setRealHeight();
window.addEventListener("resize", setRealHeight);
window.addEventListener("orientationchange", () => {
  setTimeout(setRealHeight, 350);
});

function setRibbon(text) {
  ribbonText.textContent = text;
}

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 1600);
}

function bunny(color = "pink", mood = "") {
  return `
    <div class="bunny ${color} ${mood}">
      <span class="ears"></span>
      <span class="head"></span>
      <span class="eye"></span>
      <span class="cheek"></span>
      <span class="cheek right"></span>
      <span class="mouth"></span>
    </div>
  `;
}

function setBuddyMood(mood = "normal") {
  if (!buddy) return;

  if (mood === "love") {
    buddy.querySelector(".eye").style.width = "18px";
    buddy.querySelector(".eye").style.height = "12px";
    buddy.querySelector(".eye").style.borderRadius = "0";
    buddy.querySelector(".eye").style.background = "transparent";
    buddy.querySelector(".eye").textContent = "♥";
    buddy.querySelector(".eye").style.color = "#7b164f";
    buddy.querySelector(".eye").style.fontWeight = "900";
    buddy.querySelector(".eye").style.fontSize = "18px";
    buddy.querySelector(".eye").style.lineHeight = "10px";
  } else {
    buddy.querySelector(".eye").removeAttribute("style");
    buddy.querySelector(".eye").textContent = "";
  }
}

function render(html) {
  screenEl.innerHTML = html;
}

function popHeart(x, y, emoji = "💗") {
  const item = document.createElement("div");
  item.className = "heart-pop";
  item.textContent = emoji;
  item.style.left = `${x}px`;
  item.style.top = `${y}px`;
  document.body.appendChild(item);

  setTimeout(() => item.remove(), 900);
}

function rainHearts(total = 18) {
  for (let i = 0; i < total; i++) {
    setTimeout(() => {
      popHeart(
        Math.random() * window.innerWidth,
        window.innerHeight - 80 - Math.random() * 120,
        ["💗", "💖", "🌸", "✨"][Math.floor(Math.random() * 4)]
      );
    }, i * 65);
  }
}

function showOpening() {
  heartCount = 0;
  currentQuiz = 0;
  selectedCorrect = false;
  flowerCount = 0;
  setBuddyMood("normal");
  setRibbon("SPECIAL MISSION FOR YOU");

  render(`
    <div class="view">
      <div class="click-pill">klik aku</div>
      ${bunny("pink")}
      <p class="kicker">pssst... sini dulu</p>
      <h1 class="title">Haiii kamu</h1>
      <div class="emoji-row">💗💕</div>
      <p class="desc">
        Aku bikin sesuatu yang lucu buat kamu.<br>
        Mau main bentar nggak?
      </p>
      <div class="note-box">
        <span>🌸</span>
        <span>Awalnya gemes, tengahnya bikin salting, ujungnya manis banget.</span>
      </div>
      <button class="primary-btn" onclick="showHeartGame()">Mauu, mulai</button>
      <p class="hint">ayo klik, jangan malu-malu 😚</p>
    </div>
  `);
}

function showHeartGame() {
  heartCount = 0;
  setRibbon("LEVEL 1");
  setBuddyMood("normal");

  render(`
    <div class="view">
      ${bunny("orange")}
      <p class="kicker">level 1</p>
      <h1 class="title compact">Tangkap 5 hati</h1>
      <p class="desc small">Hatinya kabur. Tolong tangkapin dulu.</p>

      <div class="progress-pill">
        <span>hati</span>
        <span id="heartScore">0/5</span>
      </div>

      <div class="game-area" id="gameArea">
        <div class="game-instruction" id="gameInstruction">klik hati yang muncul 💕</div>
      </div>

      <p class="hint" id="heartHint">pelan aja, jangan panik yaa</p>
    </div>
  `);

  spawnHearts();
}

function spawnHearts() {
  const area = document.getElementById("gameArea");
  if (!area) return;

  area.querySelectorAll(".heart-target").forEach((el) => el.remove());

  const positions = [
    { left: "22%", top: "42%" },
    { left: "54%", top: "48%" },
    { left: "78%", top: "31%" },
    { left: "36%", top: "23%" },
    { left: "18%", top: "66%" },
  ];

  positions.forEach((pos, index) => {
    const btn = document.createElement("button");
    btn.className = "heart-target";
    btn.textContent = "💖";
    btn.style.left = pos.left;
    btn.style.top = pos.top;
    btn.style.animationDelay = `${index * 0.12}s`;

    btn.addEventListener("click", (event) => {
      if (btn.classList.contains("hide")) return;

      btn.classList.add("hide");
      heartCount += 1;

      const rect = btn.getBoundingClientRect();
      popHeart(rect.left + 20, rect.top + 10);

      document.getElementById("heartScore").textContent = `${heartCount}/5`;
      updateHeartHint();

      if (heartCount >= 5) {
        completeHeartGame();
      }
    });

    area.appendChild(btn);
  });
}

function updateHeartHint() {
  const hint = document.getElementById("heartHint");
  if (!hint) return;

  const hints = [
    "pelan aja, jangan panik yaa",
    "nah, satu hati berhasil diamankan 😚",
    "wah, makin jago nih kamu",
    "tinggal dikit, jangan kabur dulu",
    "satu lagi... hati-hati salting",
  ];

  hint.textContent = hints[Math.min(heartCount, hints.length - 1)];
}

function completeHeartGame() {
  const area = document.getElementById("gameArea");
  if (!area) return;

  setBuddyMood("love");
  rainHearts(12);

  area.innerHTML = `
    <div class="feedback">
      yeay, hatinya ketangkep semua 😚
    </div>
  `;
  area.classList.add("done");

  const view = screenEl.querySelector(".view");
  const button = document.createElement("button");
  button.className = "primary-btn";
  button.textContent = "Lanjut ke teka-teki";
  button.onclick = showQuiz;
  view.appendChild(button);
}

const quizzes = [
  {
    tag: "Gombalan 1 dari 3",
    title: "Teka-teki baper",
    question: "Kalau aku disuruh pilih tempat paling nyaman, aku pilih...",
    options: [
      {
        text: "Kasur empuk",
        correct: false,
        response: "Kasur empuk memang nyaman, tapi dia nggak bisa bikin aku senyum cuma gara-gara muncul notif. 😌",
      },
      {
        text: "Rumah yang tenang",
        correct: false,
        response: "Rumah tenang itu enak, tapi rasanya belum lengkap kalau nggak ada kamu di pikiranku. 🤭",
      },
      {
        text: "Kamu",
        correct: true,
        response: "Nah, itu. Jawaban paling bahaya: sederhana, tapi bikin saltingnya lama. 💗",
      },
      {
        text: "Kafe lucu",
        correct: false,
        response: "Kafe lucu boleh, tapi kalau duduknya bukan sama kamu, tetap aja kurang manis. ☕",
      },
    ],
  },
  {
    tag: "Gombalan 2 dari 3",
    title: "Masih lanjut ya",
    question: "Yang paling sering bikin aku senyum diam-diam itu...",
    options: [
      {
        text: "Makanan enak",
        correct: false,
        response: "Iya. Kadang pendek, tapi efeknya bisa bikin mood aku naik lama. 🥺",
      },
      {
        text: "Chat dari kamu",
        correct: true,
        response: "Betul. Kadang cuma sebentar, tapi bisa bikin hariku lebih manis dari yang aku kira. 💕",
      },
      {
        text: "Tidur siang",
        correct: false,
        response: "Tidur siang bikin segar, tapi nggak bikin aku senyum-senyum sendiri kayak kamu. 😭",
      },
      {
        text: "Lagu lucu",
        correct: false,
        response: "Lagu lucu bisa keulang di kepala, tapi kamu lebih sering nyangkut di sana. 🎧",
      },
    ],
  },
  {
    tag: "Gombalan 3 dari 3",
    title: "Terakhir nih",
    question: "Kalau hati aku lagi loading, tombol yang harus dipencet adalah...",
    options: [
      {
        text: "Refresh",
        correct: false,
        response: "Refresh bisa bantu halaman, tapi hati aku butuh yang lebih gemes dari itu. 😚",
      },
      {
        text: "Restart",
        correct: false,
        response: "Restart terlalu teknis. Ini urusan hati, bukan laptop error. 😭",
      },
      {
        text: "Skip",
        correct: false,
        response: "Jangan diskip dong. Bagian ini justru mulai manis-manisnya. 🥺",
      },
      {
        text: "Senyum kamu",
        correct: true,
        response: "Betul. Satu senyum kamu cukup buat hati aku jalan lagi. 💞",
      },
    ],
  },
];

function showQuiz() {
  selectedCorrect = false;
  setRibbon("TEKA-TEKI BAPER");

  const quiz = quizzes[currentQuiz];

  render(`
    <div class="view">
      ${bunny(currentQuiz % 2 === 0 ? "pink" : "orange")}
      <p class="kicker">${quiz.tag}</p>
      <h1 class="title compact">${quiz.title}</h1>
      <p class="desc small">${quiz.question}</p>

      <div class="options">
        ${quiz.options
          .map((option, index) => {
            return `<button class="answer-btn" onclick="chooseAnswer(${index})">${option.text}</button>`;
          })
          .join("")}
      </div>

      <p class="hint" id="quizHint">pilih pakai hati, jangan pakai logika dulu 🤭</p>
      <div id="feedbackSlot"></div>
    </div>
  `);
}

function chooseAnswer(index) {
  const quiz = quizzes[currentQuiz];
  const option = quiz.options[index];
  const slot = document.getElementById("feedbackSlot");

  selectedCorrect = option.correct;

  slot.innerHTML = `
    <div class="feedback">${option.response}</div>
    ${
      option.correct
        ? `<button class="primary-btn" onclick="nextQuiz()">Lanjut</button>`
        : ``
    }
  `;

  if (option.correct) {
    setBuddyMood("love");
    rainHearts(8);
  } else {
    setBuddyMood("normal");
  }
}

function nextQuiz() {
  currentQuiz += 1;

  if (currentQuiz >= quizzes.length) {
    showReactionLevel();
  } else {
    showQuiz();
  }
}

function showReactionLevel() {
  setRibbon("LEVEL 3");
  setBuddyMood("normal");

  render(`
    <div class="view">
      ${bunny("blue")}
      <p class="kicker">level 3</p>
      <h1 class="title compact">Sekarang giliran kamu</h1>
      <p class="desc small">
        Tadi aku yang jailin kamu.<br>
        Jadi kamu boleh ngambek lucu sebentar.
      </p>

      <div class="options">
        <button class="answer-btn" onclick="chooseReaction(0)">Aku mulai baper 🥺</button>
        <button class="answer-btn" onclick="chooseReaction(1)">Websitenya jail banget 😤</button>
        <button class="answer-btn" onclick="chooseReaction(2)">Aku senyum sendiri 🙈</button>
      </div>

      <p class="hint">pilih yang paling kamu rasain sekarang 😚</p>
      <div id="feedbackSlot"></div>
    </div>
  `);
}

function chooseReaction(index) {
  const responses = [
    "Aduh iya, maaf. Efek sampingnya memang bikin pipi agak panas. 😭💗",
    "Iya, websitenya agak jail. Tapi jujur, aku cuma pengen bikin kamu senyum. 🫶",
    "Kalau kamu senyum sendiri, berarti aku menang dikit dong? Tapi tetap maaf yaa. 🤭",
  ];

  const slot = document.getElementById("feedbackSlot");
  slot.innerHTML = `
    <div class="feedback">${responses[index]}</div>
    <button class="primary-btn" onclick="showSoftLevel()">Oke, lanjut pelan-pelan</button>
  `;

  setBuddyMood("love");
  rainHearts(10);
}

function showSoftLevel() {
  setRibbon("LEVEL 4");

  render(`
    <div class="view">
      ${bunny("blue")}
      <p class="kicker">level 4</p>
      <h1 class="title compact">Pelanin dulu ya...</h1>

      <div class="soft-scene">
        <span class="sun"></span>
        <span class="cloud"></span>
      </div>

      <p class="desc small">
        Aku nggak cuma mau bikin kamu ketawa.<br>
        Aku juga mau bikin kamu ngerasa ditemenin.
      </p>

      <div class="message-list">
        <div class="message-item">Kamu boleh capek.</div>
        <div class="message-item">Boleh diem dulu.</div>
        <div class="message-item">Boleh nggak selalu kuat.</div>
        <div class="message-item">Tapi jangan ngerasa sendirian ya.</div>
      </div>

      <button class="primary-btn" onclick="showBonusLevel()">Sekarang ceria lagi</button>
    </div>
  `);
}

function showBonusLevel() {
  flowerCount = 0;
  setRibbon("BONUS LEVEL");
  setBuddyMood("normal");

  render(`
    <div class="view">
      ${bunny("orange", "love")}
      <p class="kicker">bonus level</p>
      <h1 class="title compact">Balik senyum dulu</h1>
      <p class="desc small">
        Aku punya bunga kecil buat mood kamu.<br>
        Klik bunganya biar makin rame.
      </p>

      <div class="flower-box" id="flowerBox">
        <button class="flower-btn" onclick="growFlower()">klik bunganya pelan-pelan ✨</button>
      </div>

      <p class="hint" id="flowerHint">minimal 3 kali yaa, biar manjur 😚</p>
      <div id="bonusAction"></div>
    </div>
  `);
}

function growFlower() {
  const box = document.getElementById("flowerBox");
  const hint = document.getElementById("flowerHint");
  const action = document.getElementById("bonusAction");

  flowerCount += 1;

  const flower = document.createElement("span");
  flower.className = "flower";
  flower.textContent = ["🌷", "🌸", "🌼", "💐"][Math.floor(Math.random() * 4)];
  flower.style.left = `${20 + Math.random() * 60}%`;
  flower.style.top = `${24 + Math.random() * 42}%`;
  box.appendChild(flower);

  if (flowerCount === 1) {
    hint.textContent = "nah, satu bunga dulu 🌷";
  } else if (flowerCount === 2) {
    hint.textContent = "wah mulai rame nih 🌸";
  } else if (flowerCount >= 3) {
    hint.textContent = "nah, senyumnya udah balik kan? 💗";
    action.innerHTML = `<button class="primary-btn" onclick="showFinalGate()">Buka yang terakhir</button>`;
    setBuddyMood("love");
  }
}

function showFinalGate() {
  setRibbon("FINAL LEVEL");

  render(`
    <div class="view">
      ${bunny("orange", "love")}
      <p class="kicker">final level</p>
      <h1 class="title final">Ini buat kamu</h1>
      <p class="desc">
        Bagian terakhirnya manis.<br>
        Dibuka pelan-pelan yaa.
      </p>
      <button class="primary-btn" onclick="showLetter()">Buka surat</button>
    </div>
  `);
}

function showLetter() {
  setRibbon("FINAL LEVEL");
  setBuddyMood("love");

  render(`
    <div class="view">
      ${bunny("orange", "love")}
      <p class="kicker">surat kecil</p>
      <h1 class="title final">Hai kamu</h1>

      <div class="letter">
        <p>💌 Aku bikin ini bukan biar terlihat keren.</p>
        <p>Aku cuma pengen kamu tahu, hadir kamu itu bikin hariku lebih manis.</p>
        <p>Aku suka caramu bikin aku senyum. Aku suka caramu muncul di pikiranku tanpa diminta.</p>
        <p class="big-love">Aku suka kamu 💞</p>
        <p>Sederhana aja. Nggak ribet. Nggak dibuat-buat.</p>
        <p>Kalau setelah baca ini kamu senyum, berarti misi kecilku berhasil. 🌸✨💗</p>
      </div>

      <button class="primary-btn" onclick="rainHearts(28)">Hujanin hati</button>
      <button class="secondary-btn" onclick="showOpening()">Ulang dari awal</button>
    </div>
  `);

  rainHearts(18);
}

showOpening();