const scene = document.getElementById("scene");
const card = document.getElementById("card");
const ribbon = document.getElementById("ribbon");
const sideBubble = document.getElementById("sideBubble");
const softBg = document.getElementById("softBg");

const state = {
  page: "intro",
  locked: false,
  hearts: [false, false, false, false, false],
  quizIndex: 0,
  quizFeedback: null,
  quizCorrect: false,
  ngambekChoice: null,
  cheerTap: 0
};

const heartPositions = [
  { x: "18%", y: "70%" },
  { x: "78%", y: "30%" },
  { x: "48%", y: "58%" },
  { x: "30%", y: "28%" },
  { x: "70%", y: "76%" }
];

const quiz = [
  {
    label: "GOMBALAN 1 DARI 3",
    title: "Teka-teki baper",
    question: "Kalau aku disuruh pilih tempat paling nyaman, aku pilih...",
    correct: 2,
    options: [
      {
        text: "Kasur empuk",
        response: "Kasur empuk memang nyaman, tapi dia nggak bisa bikin aku senyum cuma gara-gara muncul notif. 😌"
      },
      {
        text: "Rumah yang tenang",
        response: "Rumah tenang itu enak, tapi rasanya belum lengkap kalau nggak ada kamu di pikiranku. 🫣"
      },
      {
        text: "Kamu",
        response: "Nah, itu. Jawaban paling bahaya: sederhana, tapi bikin saltingnya lama. 💗"
      },
      {
        text: "Kafe lucu",
        response: "Kafe lucu boleh, tapi kalau duduknya bukan sama kamu, tetap aja kurang manis. ☕"
      }
    ]
  },
  {
    label: "GOMBALAN 2 DARI 3",
    title: "Masih lanjut ya",
    question: "Yang paling sering bikin aku senyum diam-diam itu...",
    correct: 1,
    options: [
      {
        text: "Makanan enak",
        response: "Makanan enak bikin kenyang, tapi belum tentu bikin hati aku tiba-tiba hangat. 🍰"
      },
      {
        text: "Chat dari kamu",
        response: "Iya. Kadang pendek, tapi efeknya bisa bikin mood aku naik lama. 🥺"
      },
      {
        text: "Tidur siang",
        response: "Tidur siang bikin segar, tapi nggak bikin aku senyum-senyum sendiri kayak kamu. 😭"
      },
      {
        text: "Lagu lucu",
        response: "Lagu lucu bisa keulang di kepala, tapi kamu lebih sering nyangkut di sana. 🎧"
      }
    ]
  },
  {
    label: "GOMBALAN 3 DARI 3",
    title: "Terakhir nih",
    question: "Kalau hati aku lagi loading, tombol yang harus dipencet adalah...",
    correct: 3,
    options: [
      {
        text: "Refresh",
        response: "Refresh bisa bantu halaman, tapi hati aku butuh yang lebih gemes dari itu. 😗"
      },
      {
        text: "Restart",
        response: "Restart terlalu teknis. Ini urusan hati, bukan laptop error. 😭"
      },
      {
        text: "Skip",
        response: "Jangan diskip dong. Bagian ini justru mulai manis-manisnya. 🫢"
      },
      {
        text: "Senyum kamu",
        response: "Betul. Satu senyum kamu cukup buat hati aku jalan lagi. 💞"
      }
    ]
  }
];

function setAppHeight() {
  const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  document.documentElement.style.setProperty("--app-h", `${height}px`);
}

window.addEventListener("resize", setAppHeight);
window.addEventListener("orientationchange", setAppHeight);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", setAppHeight);
}
setAppHeight();

function buildBackground() {
  const items = ["love", "cute", "gemes", "hehe", "♡", "✧", "❀"];
  const total = window.innerWidth < 520 ? 22 : 34;

  softBg.innerHTML = "";

  for (let i = 0; i < total; i++) {
    const item = document.createElement("span");
    const type = Math.random();

    if (type < 0.55) {
      item.className = "float-item float-word";
      item.textContent = items[Math.floor(Math.random() * items.length)];
      item.style.setProperty("--size", `${Math.random() * 0.55 + 0.72}rem`);
    } else if (type < 0.82) {
      item.className = "float-item float-heart";
      item.textContent = Math.random() > 0.5 ? "♡" : "💗";
      item.style.setProperty("--size", `${Math.random() * 0.7 + 0.75}rem`);
    } else {
      item.className = "float-item float-dot";
      item.style.setProperty("--size", `${Math.random() * 4.2 + 2.8}rem`);
    }

    item.style.left = `${Math.random() * 96}%`;
    item.style.top = `${Math.random() * 96}%`;
    item.style.setProperty("--dur", `${Math.random() * 4 + 4}s`);
    item.style.setProperty("--mx", `${Math.random() * 24 - 12}px`);
    item.style.setProperty("--my", `${Math.random() * 28 - 14}px`);
    item.style.setProperty("--rot", `${Math.random() * 30 - 15}deg`);

    softBg.appendChild(item);
  }
}

buildBackground();

function charHTML(mood = "happy") {
  return `
    <div class="char mood-${mood}" aria-hidden="true">
      <div class="ear left"></div>
      <div class="ear right"></div>
      <div class="hand left"></div>
      <div class="hand right"></div>
      <div class="face">
        <span class="eye left"></span>
        <span class="eye right"></span>
        <span class="cheek left"></span>
        <span class="cheek right"></span>
        <span class="mouth"></span>
      </div>
    </div>
  `;
}

function setTexts(ribbonText, bubbleText) {
  ribbon.textContent = ribbonText;
  sideBubble.textContent = bubbleText;
}

function go(page) {
  if (state.locked) return;

  state.locked = true;
  card.classList.add("is-leaving");

  setTimeout(() => {
    state.page = page;
    card.classList.remove("is-leaving");
    render();

    setTimeout(() => {
      state.locked = false;
    }, 260);
  }, 190);
}

function render() {
  if (state.page === "intro") renderIntro();
  if (state.page === "hearts") renderHearts();
  if (state.page === "quiz") renderQuiz();
  if (state.page === "ngambek") renderNgambek();
  if (state.page === "validasi") renderValidasi();
  if (state.page === "ceria") renderCeria();
  if (state.page === "finalGate") renderFinalGate();
  if (state.page === "letter") renderLetter();
}

function renderIntro() {
  setTexts("SPECIAL MISSION FOR YOU", "aku nemenin 💛");

  scene.innerHTML = `
    <div class="scene-inner">
      <div class="tiny-pill">klik aku</div>
      ${charHTML("shy")}

      <div class="eyebrow">Pssst... sini dulu</div>

      <h1 class="title">Haiii kamu</h1>

      <div class="heart-pair">
        <span class="big-heart">💗</span>
        <span class="big-heart">💞</span>
      </div>

      <p class="subtitle">
        Aku bikin sesuatu yang lucu buat kamu.<br>
        Mau main bentar nggak?
      </p>

      <div class="note">
        <span class="emoji">🌸</span>
        <span>Awalnya gemes, tengahnya bikin salting, ujungnya manis banget.</span>
      </div>

      <button class="main-btn" onclick="startGame()">Mauu, mulai</button>
      <p class="caption">ayo klik, jangan malu-malu 😚</p>
    </div>
  `;
}

function startGame() {
  state.hearts = [false, false, false, false, false];
  state.quizIndex = 0;
  state.quizFeedback = null;
  state.quizCorrect = false;
  state.ngambekChoice = null;
  state.cheerTap = 0;
  go("hearts");
}

function renderHearts() {
  setTexts("LEVEL 1", "tangkap hatinya 💘");

  const count = state.hearts.filter(Boolean).length;
  const allDone = count === 5;

  const heartsHTML = heartPositions.map((pos, index) => {
    if (state.hearts[index]) return "";

    return `
      <button
        class="heart-target"
        style="--x:${pos.x}; --y:${pos.y};"
        onclick="catchHeart(${index})"
        aria-label="Tangkap hati"
      >
        💖
      </button>
    `;
  }).join("");

  scene.innerHTML = `
    <div class="scene-inner">
      ${charHTML(allDone ? "excited" : "happy")}

      <div class="eyebrow">Level 1</div>
      <h2 class="title small-title">Tangkap 5 hati</h2>
      <p class="subtitle">Hatinya kabur. Tolong tangkapin dulu.</p>

      <div class="progress-pill">
        <span>hati</span>
        <b>${count}/5</b>
      </div>

      <div class="heart-field">
        ${
          allDone
            ? `<div class="success-box" style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);">
                yeay, hatinya ketangkep semua 😚
              </div>`
            : heartsHTML + `<p class="caption" style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);">klik hati yang muncul 💕</p>`
        }
      </div>

      ${
        allDone
          ? `<button class="main-btn" onclick="nextQuiz()">Lanjut ke teka-teki</button>`
          : `<p class="caption">pelan aja, jangan panik yaa</p>`
      }
    </div>
  `;
}

function catchHeart(index) {
  if (state.hearts[index]) return;
  state.hearts[index] = true;
  popBurst(["💗", "💞", "🌸"]);
  renderHearts();
}

function nextQuiz() {
  state.quizIndex = 0;
  state.quizFeedback = null;
  state.quizCorrect = false;
  go("quiz");
}

function renderQuiz() {
  const q = quiz[state.quizIndex];
  setTexts("TEKA-TEKI BAPER", "siap-siap salting 😚");

  const optionsHTML = q.options.map((option, index) => {
    return `
      <button class="choice-btn" onclick="answerQuiz(${index})">
        ${option.text}
      </button>
    `;
  }).join("");

  scene.innerHTML = `
    <div class="scene-inner">
      ${charHTML(state.quizCorrect ? "love" : "shy")}

      <div class="eyebrow">${q.label}</div>
      <h2 class="title small-title">${q.title}</h2>
      <p class="subtitle">${q.question}</p>

      <div class="choice-list">
        ${optionsHTML}
      </div>

      ${
        state.quizFeedback
          ? `<div class="feedback ${state.quizCorrect ? "good" : ""}">
              ${state.quizFeedback}
            </div>`
          : `<p class="caption">pilih pakai hati, jangan pakai logika dulu 🫣</p>`
      }

      ${
        state.quizCorrect
          ? `<button class="main-btn" onclick="continueQuiz()">Lanjut</button>`
          : ""
      }
    </div>
  `;
}

function answerQuiz(index) {
  const q = quiz[state.quizIndex];
  const option = q.options[index];

  state.quizFeedback = option.response;
  state.quizCorrect = index === q.correct;

  if (state.quizCorrect) {
    popBurst(["💗", "✨", "🌷"]);
  }

  renderQuiz();
}

function continueQuiz() {
  if (state.quizIndex < quiz.length - 1) {
    state.quizIndex += 1;
    state.quizFeedback = null;
    state.quizCorrect = false;
    renderQuiz();
  } else {
    go("ngambek");
  }
}

function renderNgambek() {
  setTexts("LEVEL 3", "ngambeknya lucu aja 🥺");

  const responseMap = {
    baper: "Aduh iya, maaf. Efek sampingnya memang bikin pipi agak panas. 😭💗",
    jail: "Iya, websitenya agak jail. Tapi jujur, aku cuma pengen bikin kamu senyum. 🫶",
    senyum: "Kalau kamu senyum sendiri, berarti aku menang dikit dong? Tapi tetap maaf yaa. 🫣"
  };

  scene.innerHTML = `
    <div class="scene-inner">
      ${charHTML(state.ngambekChoice ? "sad" : "shy")}

      <div class="eyebrow">Level 3</div>
      <h2 class="title small-title">Sekarang giliran kamu</h2>
      <p class="subtitle">
        Tadi aku yang jailin kamu.<br>
        Jadi kamu boleh ngambek lucu sebentar.
      </p>

      <div class="choice-list">
        <button class="choice-btn" onclick="chooseNgambek('baper')">Aku mulai baper 🥺</button>
        <button class="choice-btn" onclick="chooseNgambek('jail')">Websitenya jail banget 😤</button>
        <button class="choice-btn" onclick="chooseNgambek('senyum')">Aku senyum sendiri 🙈</button>
      </div>

      ${
        state.ngambekChoice
          ? `<div class="feedback good">${responseMap[state.ngambekChoice]}</div>
             <button class="main-btn" onclick="go('validasi')">Oke, lanjut pelan-pelan</button>`
          : `<p class="caption">pilih yang paling kamu rasain sekarang 😚</p>`
      }
    </div>
  `;
}

function chooseNgambek(type) {
  state.ngambekChoice = type;
  popBurst(["🥺", "💗", "🌸"]);
  renderNgambek();
}

function renderValidasi() {
  setTexts("LEVEL 4", "pelan-pelan dulu 🌙");

  scene.innerHTML = `
    <div class="scene-inner">
      ${charHTML("sad")}

      <div class="eyebrow">Level 4</div>
      <h2 class="title small-title">Pelanin dulu ya...</h2>

      <div class="mini-scenery">
        <span class="cloud"></span>
        <span class="cloud two"></span>
        <span class="scenery-heart">♡</span>
      </div>

      <p class="subtitle">
        Aku nggak cuma mau bikin kamu ketawa.<br>
        Aku juga mau bikin kamu ngerasa ditemenin.
      </p>

      <div class="soft-list">
        <div class="soft-line" style="--delay:0s;">Kamu boleh capek.</div>
        <div class="soft-line" style="--delay:.08s;">Boleh diem dulu.</div>
        <div class="soft-line" style="--delay:.16s;">Boleh nggak selalu kuat.</div>
        <div class="soft-line" style="--delay:.24s;">Tapi jangan ngerasa sendirian ya.</div>
      </div>

      <button class="main-btn" onclick="go('ceria')">Sekarang ceria lagi</button>
    </div>
  `;
}

function renderCeria() {
  setTexts("BONUS LEVEL", "balik ceria 🌷");

  scene.innerHTML = `
    <div class="scene-inner">
      ${charHTML("excited")}

      <div class="eyebrow">Bonus level</div>
      <h2 class="title small-title">Balik senyum dulu</h2>
      <p class="subtitle">
        Aku punya bunga kecil buat mood kamu.<br>
        Klik bunganya biar makin rame.
      </p>

      <div class="heart-field">
        <button
          class="heart-target"
          style="--x:50%; --y:50%; font-size:2.5rem;"
          onclick="tapFlower()"
          aria-label="Klik bunga"
        >
          🌷
        </button>

        <div class="success-box" style="position:absolute; left:50%; bottom:18px; transform:translateX(-50%); width:82%;">
          ${state.cheerTap < 3 ? "klik bunganya pelan-pelan ✨" : "nah, senyumnya udah balik kan? 💗"}
        </div>
      </div>

      ${
        state.cheerTap >= 3
          ? `<button class="main-btn" onclick="go('finalGate')">Buka yang terakhir</button>`
          : `<p class="caption">minimal 3 kali yaa, biar manjur 😚</p>`
      }
    </div>
  `;
}

function tapFlower() {
  state.cheerTap += 1;
  popBurst(["🌷", "💗", "✨", "🫶"]);
  renderCeria();
}

function renderFinalGate() {
  setTexts("FINAL LEVEL", "akhirnya sampai 💌");

  scene.innerHTML = `
    <div class="scene-inner">
      ${charHTML("love")}

      <div class="eyebrow">Final level</div>
      <h2 class="title small-title">Ini buat kamu</h2>
      <p class="subtitle">
        Bagian terakhirnya manis.<br>
        Dibuka pelan-pelan yaa.
      </p>

      <button class="main-btn" onclick="go('letter')">Buka surat</button>
    </div>
  `;
}

function renderLetter() {
  setTexts("FINAL LEVEL", "jangan lupa senyum 💗");

  scene.innerHTML = `
    <div class="scene-inner">
      ${charHTML("love")}

      <div class="eyebrow">Surat kecil</div>
      <h2 class="title small-title">Hai kamu</h2>

      <div class="letter-panel">
        <p>💌 Aku bikin ini bukan biar terlihat keren.</p>

        <p>
          Aku cuma pengen kamu tahu,
          hadir kamu itu bikin hariku lebih manis.
        </p>

        <p>
          Aku suka caramu bikin aku senyum.
          Aku suka caramu muncul di pikiranku tanpa diminta.
        </p>

        <span class="love-line">Aku suka kamu 💞</span>

        <p>
          Sederhana aja. Nggak ribet. Nggak dibuat-buat.
        </p>

        <p>
          Kalau setelah baca ini kamu senyum,
          berarti misi kecilku berhasil. 🌸✨💗
        </p>
      </div>

      <div class="final-actions">
        <button class="main-btn" onclick="loveRain()">Hujanin hati</button>
        <button class="ghost-btn" onclick="startGame()">Ulang dari awal</button>
      </div>
    </div>
  `;
}

function popBurst(list = ["💗"]) {
  const amount = 12;

  for (let i = 0; i < amount; i++) {
    const span = document.createElement("span");
    span.className = "burst";
    span.textContent = list[Math.floor(Math.random() * list.length)];
    span.style.setProperty("--x", `${Math.random() * 260 - 130}px`);
    span.style.setProperty("--y", `${Math.random() * 260 - 130}px`);
    document.body.appendChild(span);

    setTimeout(() => {
      span.remove();
    }, 1000);
  }
}

function loveRain() {
  popBurst(["💗", "💞", "🌷", "✨", "🫶"]);
}

document.addEventListener("touchmove", function (event) {
  event.preventDefault();
}, { passive: false });

render();