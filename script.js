const card = document.getElementById("card");
const topBadge = document.getElementById("topBadge");
const tinyPill = document.getElementById("tinyPill");
const character = document.getElementById("character");
const miniTitle = document.getElementById("miniTitle");
const mainTitle = document.getElementById("mainTitle");
const heartStack = document.getElementById("heartStack");
const desc = document.getElementById("desc");
const noteBox = document.getElementById("noteBox");
const contentArea = document.getElementById("contentArea");
const mainBtn = document.getElementById("mainBtn");
const ghostBtn = document.getElementById("ghostBtn");
const smallText = document.getElementById("smallText");
const softBg = document.getElementById("softBg");
const buddyText = document.getElementById("buddyText");

let scene = "intro";
let caught = 0;
let quizIndex = 0;
let softUnlocked = false;

const characterMoods = [
  "peach happy",
  "pink shy",
  "yellow excited",
  "lilac sad",
  "mint happy"
];

const riddles = [
  {
    label: "GOMBALAN 1 DARI 3",
    title: "Teka-teki baper",
    question: "Kalau aku disuruh pilih tempat paling nyaman, aku pilih...",
    correct: "Kamu",
    options: [
      {
        text: "Kasur empuk",
        reply: "Kasur emang nyaman, tapi kalau lagi kangen, tetap aja yang dicari bukan bantal. 😚"
      },
      {
        text: "Rumah yang tenang",
        reply: "Rumah itu tempat pulang, tapi kamu tuh rasanya kayak pulang yang lebih hangat. 🤍"
      },
      {
        text: "Kamu",
        reply: "Nah, pinter. Jawaban ini bikin aku senyum duluan. Soalnya tempat ternyaman versi aku ya kamu. 💗"
      },
      {
        text: "Kafe lucu",
        reply: "Kafe lucu boleh, tapi kalau kamu ada di sana, tempatnya langsung jadi favorit. ☕💞"
      }
    ]
  },
  {
    label: "GOMBALAN 2 DARI 3",
    title: "Jawab pakai hati",
    question: "Kalau aku tiba-tiba diem, biasanya karena...",
    correct: "Lagi mikirin kamu",
    options: [
      {
        text: "Lagi lapar",
        reply: "Bisa jadi lapar sih, tapi anehnya yang kebayang malah kamu, bukan makanan. 😭"
      },
      {
        text: "Lagi ngantuk",
        reply: "Ngantuk boleh, tapi kalau kamu muncul di pikiran, mata bisa auto melek lagi. 🤭"
      },
      {
        text: "Lagi mikirin kamu",
        reply: "Iya. Kadang aku diem bukan karena kosong, tapi karena kepala aku lagi penuh sama kamu. 💕"
      },
      {
        text: "Lagi pura-pura sibuk",
        reply: "Pura-pura sibuk itu cuma alibi. Aslinya nyari cara biar kamu senyum. 😌"
      }
    ]
  },
  {
    label: "GOMBALAN 3 DARI 3",
    title: "Terakhir nih",
    question: "Kalau kamu senyum, efeknya ke aku tuh...",
    correct: "Hari aku jadi manis",
    options: [
      {
        text: "Biasa aja",
        reply: "Biasa aja? Waduh, kayaknya hatiku protes. Senyum kamu nggak pernah biasa buat aku. 🥺"
      },
      {
        text: "Bikin bingung",
        reply: "Iya, bingung juga sih. Bingung kenapa ada orang yang senyumnya bisa semanis itu. 😵‍💫"
      },
      {
        text: "Hari aku jadi manis",
        reply: "Nah ini. Kamu nggak sadar, tapi senyum kamu bisa bikin hari aku berubah jadi lebih ringan. ✨"
      },
      {
        text: "Bikin pengen jajan",
        reply: "Jajan boleh, tapi kamu tetap bagian paling manisnya. 🍰"
      }
    ]
  }
];

const scenes = {
  intro() {
    scene = "intro";
    setMood("pink happy");

    topBadge.textContent = "SPECIAL MISSION FOR YOU";
    tinyPill.textContent = "klik aku";
    miniTitle.textContent = "PSSST... SINI DULU";
    mainTitle.textContent = "Haiii kamu";
    heartStack.textContent = "💗💕";
    desc.innerHTML = "Aku bikin sesuatu yang lucu buat kamu.<br>Mau main bentar nggak?";

    noteBox.classList.remove("hide");
    noteBox.innerHTML = `
      <span>🌸</span>
      <p>Awalnya gemes, tengahnya bikin salting, ujungnya manis banget.</p>
    `;

    contentArea.innerHTML = "";
    mainBtn.textContent = "Mauu, mulai";
    mainBtn.classList.remove("hide");
    ghostBtn.classList.add("hide");
    smallText.textContent = "ayo klik, jangan malu-malu 😚";
    buddyText.textContent = "aku nemenin 🤍";

    mainBtn.onclick = () => transitionTo(scenes.catchHeart);
  },

  catchHeart() {
    scene = "catch";
    caught = 0;
    setMood("yellow excited");

    topBadge.textContent = "LEVEL 1";
    tinyPill.textContent = "tangkap dulu";
    miniTitle.textContent = "LEVEL 1";
    mainTitle.textContent = "Tangkap 5 hati";
    heartStack.textContent = "";
    desc.textContent = "Hatinya kabur. Tolong tangkapin dulu.";
    noteBox.classList.add("hide");

    contentArea.innerHTML = `
      <div class="progress-pill">
        <span>hati</span>
        <span id="heartCount">0/5</span>
      </div>

      <div class="play-area" id="playArea">
        <div class="center-hint" id="centerHint">klik hati yang muncul 💞</div>
      </div>
    `;

    mainBtn.classList.add("hide");
    ghostBtn.classList.add("hide");
    smallText.textContent = "";
    buddyText.textContent = "tangkap hatinya 💘";

    const playArea = document.getElementById("playArea");
    spawnHeart(playArea);
  },

  quiz() {
    scene = "quiz";
    quizIndex = 0;
    showQuiz();
  },

  tease() {
    scene = "tease";
    setMood("peach shy");

    topBadge.textContent = "LEVEL 3";
    tinyPill.textContent = "eh kok salting";
    miniTitle.textContent = "LEVEL 3";
    mainTitle.textContent = "Sebentar...";
    heartStack.textContent = "😳💗";
    desc.innerHTML = "Kok kamu bisa jawab sampai sini?<br>Jangan-jangan kamu mulai senyum ya.";

    noteBox.classList.remove("hide");
    noteBox.innerHTML = `
      <span>🤭</span>
      <p>Kalau tadi bikin salting, sekarang aku mau bikin kamu penasaran dikit.</p>
    `;

    contentArea.innerHTML = `
      <div class="quiz-wrap">
        <button class="choice-btn" data-next="soft">Aku lanjut, tapi jangan bikin aku baper banget 😤</button>
        <button class="choice-btn" data-next="soft">Udah terlanjur baper, lanjut aja 😌</button>
        <button class="choice-btn" data-next="soft">Aku cuma penasaran kok... mungkin 😭</button>
      </div>
    `;

    mainBtn.classList.add("hide");
    ghostBtn.classList.add("hide");
    smallText.textContent = "pilih yang paling kamu banget";
    buddyText.textContent = "mulai salting ya 😚";

    document.querySelectorAll(".choice-btn").forEach((btn) => {
      btn.onclick = () => {
        softUnlocked = true;
        makeConfetti(["💗", "✨", "🌸"]);
        transitionTo(scenes.soft);
      };
    });
  },

  soft() {
    scene = "soft";
    setMood("lilac sad");

    topBadge.textContent = "LEVEL 4";
    tinyPill.textContent = "pelan-pelan ya";
    miniTitle.textContent = "LEVEL 4";
    mainTitle.textContent = "Pelanin dulu ya...";
    heartStack.textContent = "🌙";
    desc.innerHTML = "Aku nggak cuma mau bikin kamu ketawa.<br>Aku juga mau bikin kamu ngerasa ditemenin.";

    noteBox.classList.add("hide");

    contentArea.innerHTML = `
      <div class="mood-list">
        <div class="mood-item">Kamu boleh capek.</div>
        <div class="mood-item">Boleh diem dulu.</div>
        <div class="mood-item">Boleh nggak selalu kuat.</div>
        <div class="mood-item">Tapi jangan ngerasa sendirian ya.</div>
        <div class="mood-item">Karena hari ini, aku ada di sini buat kamu 🤍</div>
      </div>
    `;

    mainBtn.classList.remove("hide");
    mainBtn.textContent = "Sekarang bikin ceria lagi";
    ghostBtn.classList.add("hide");
    smallText.textContent = "tenang, bagian manisnya makin dekat";
    buddyText.textContent = "pelan-pelan dulu 🌙";

    mainBtn.onclick = () => transitionTo(scenes.finalGate);
  },

  finalGate() {
    scene = "finalGate";
    setMood("mint excited");

    topBadge.textContent = "FINAL LEVEL";
    tinyPill.textContent = "akhirnya sampai";
    miniTitle.textContent = "FINAL LEVEL";
    mainTitle.textContent = "Ini buat kamu";
    heartStack.textContent = "💌";
    desc.innerHTML = "Bagian terakhirnya manis.<br>Dibuka pelan-pelan yaa.";

    noteBox.classList.add("hide");
    contentArea.innerHTML = "";

    mainBtn.classList.remove("hide");
    mainBtn.textContent = "Buka surat";
    ghostBtn.classList.add("hide");
    smallText.textContent = "";
    buddyText.textContent = "akhirnya sampai 💌";

    mainBtn.onclick = () => transitionTo(scenes.finalLetter);
  },

  finalLetter() {
    scene = "finalLetter";
    setMood("pink happy");

    topBadge.textContent = "FINAL LEVEL";
    tinyPill.textContent = "buat kamu";
    miniTitle.textContent = "FINAL LEVEL";
    mainTitle.textContent = "Ini buat kamu";
    heartStack.textContent = "";
    desc.innerHTML = "Klik tombolnya. Suratnya bakal kebuka pelan-pelan.";

    noteBox.classList.add("hide");

    contentArea.innerHTML = `
      <div class="final-letter">
        <p><b class="colorful">Hai kamu 💗</b></p>

        <p>
          Aku bikin ini bukan biar terlihat keren.
          Aku cuma pengen kamu tahu, hadir kamu itu bikin hariku lebih manis. ✨
        </p>

        <p>
          Aku suka caramu bikin aku senyum.
          Aku suka caramu muncul di pikiranku tanpa diminta. 🌷
        </p>

        <p>
          Mungkin aku sering bercanda, tapi bagian ini serius.
        </p>

        <span class="love-line">Aku suka kamu 💕</span>

        <p>
          Sederhana aja. Nggak ribet. Nggak dibuat-buat.
        </p>

        <p>
          Kalau setelah baca ini kamu senyum,
          berarti misi kecilku berhasil 🌸✨💖
        </p>
      </div>
    `;

    mainBtn.classList.remove("hide");
    mainBtn.textContent = "Hujanin hati";
    ghostBtn.classList.remove("hide");
    ghostBtn.textContent = "Ulang dari awal";
    smallText.textContent = "senyumnya jangan ditahan ya 😚";
    buddyText.textContent = "aku senang kamu sampai sini 💗";

    mainBtn.onclick = () => makeConfetti(["💗", "💕", "💖", "🌸", "✨"]);
    ghostBtn.onclick = () => transitionTo(scenes.intro);
  }
};

function setMood(moodClass) {
  character.className = `character ${moodClass}`;
}

function transitionTo(nextScene) {
  card.classList.remove("switching");
  void card.offsetWidth;
  card.classList.add("switching");

  setTimeout(() => {
    nextScene();
    const inner = document.querySelector(".inner");
    inner.scrollTo({ top: 0, behavior: "smooth" });
  }, 170);
}

function spawnHeart(playArea) {
  const centerHint = document.getElementById("centerHint");
  const heartCount = document.getElementById("heartCount");

  if (caught >= 5) {
    centerHint.textContent = "yeay, hatinya ketangkep semua 😚";
    mainBtn.classList.remove("hide");
    mainBtn.textContent = "Lanjut ke teka-teki";
    smallText.textContent = "";
    mainBtn.onclick = () => transitionTo(scenes.quiz);
    return;
  }

  centerHint.textContent = "klik hati yang muncul 💞";

  const btn = document.createElement("button");
  btn.className = "catch-heart";
  btn.textContent = ["💗", "💕", "💘", "💖", "💝"][caught % 5];

  const areaRect = playArea.getBoundingClientRect();
  const maxX = Math.max(40, areaRect.width - 58);
  const maxY = Math.max(40, areaRect.height - 58);

  btn.style.left = `${Math.floor(Math.random() * maxX)}px`;
  btn.style.top = `${Math.floor(Math.random() * maxY)}px`;

  btn.onclick = () => {
    caught += 1;
    heartCount.textContent = `${caught}/5`;
    btn.remove();

    setMood(characterMoods[caught % characterMoods.length]);

    if (caught === 5) {
      makeConfetti(["💗", "✨", "🌸"]);
    }

    setTimeout(() => spawnHeart(playArea), 180);
  };

  playArea.appendChild(btn);
}

function showQuiz() {
  const item = riddles[quizIndex];
  setMood(["peach shy", "pink happy", "yellow excited"][quizIndex] || "pink happy");

  topBadge.textContent = item.label;
  tinyPill.textContent = "jawab pakai hati";
  miniTitle.textContent = item.label;
  mainTitle.textContent = item.title;
  heartStack.textContent = "💞";
  desc.textContent = item.question;

  noteBox.classList.add("hide");
  mainBtn.classList.add("hide");
  ghostBtn.classList.add("hide");
  smallText.textContent = "jawaban salah juga ada balasannya kok";
  buddyText.textContent = "siap-siap baper 😚";

  contentArea.innerHTML = `
    <div class="quiz-wrap">
      ${item.options.map((opt, index) => `
        <button class="choice-btn" data-index="${index}">
          ${opt.text}
        </button>
      `).join("")}
    </div>
    <div id="feedback"></div>
  `;

  const feedback = document.getElementById("feedback");

  document.querySelectorAll(".choice-btn").forEach((btn) => {
    btn.onclick = () => {
      const selected = item.options[Number(btn.dataset.index)];
      const isCorrect = selected.text === item.correct;

      document.querySelectorAll(".choice-btn").forEach((b) => {
        b.classList.remove("correct");
      });

      if (isCorrect) {
        btn.classList.add("correct");
        setMood("yellow excited");
        makeConfetti(["💗", "✨", "💕"]);
      } else {
        setMood("lilac sad");
      }

      feedback.innerHTML = `
        <div class="feedback">
          ${selected.reply}
        </div>
      `;

      mainBtn.classList.remove("hide");

      if (isCorrect) {
        mainBtn.textContent = quizIndex < riddles.length - 1 ? "Lanjut gombalan berikutnya" : "Lanjut, aku penasaran";
        mainBtn.onclick = () => {
          if (quizIndex < riddles.length - 1) {
            quizIndex += 1;
            transitionTo(showQuiz);
          } else {
            transitionTo(scenes.tease);
          }
        };
      } else {
        mainBtn.textContent = "Coba pilih yang paling bener";
        mainBtn.onclick = () => {
          feedback.innerHTML = `
            <div class="feedback">
              Pelan-pelan. Petunjuknya: jawabannya bukan yang paling logis, tapi yang paling bikin aku senyum. 🤭
            </div>
          `;
        };
      }
    };
  });
}

function makeConfetti(items) {
  const amount = 22;

  for (let i = 0; i < amount; i++) {
    const pop = document.createElement("div");
    pop.className = "pop-confetti";
    pop.textContent = items[Math.floor(Math.random() * items.length)];
    pop.style.left = `${Math.random() * 100}vw`;
    pop.style.top = `${70 + Math.random() * 24}vh`;
    pop.style.animationDelay = `${Math.random() * 180}ms`;

    document.body.appendChild(pop);

    setTimeout(() => {
      pop.remove();
    }, 1100);
  }
}

function buildBackground() {
  const words = ["love", "cute", "hehe", "gemes", "baper"];
  const totalWords = window.innerWidth < 560 ? 14 : 24;
  const totalHearts = window.innerWidth < 560 ? 12 : 20;

  softBg.innerHTML = "";

  for (let i = 0; i < totalWords; i++) {
    const word = document.createElement("span");
    word.className = "float-word";
    word.textContent = words[i % words.length];
    word.style.left = `${Math.random() * 96}%`;
    word.style.top = `${Math.random() * 96}%`;
    word.style.animationDuration = `${8 + Math.random() * 8}s`;
    word.style.animationDelay = `${Math.random() * 5}s`;
    softBg.appendChild(word);
  }

  for (let i = 0; i < totalHearts; i++) {
    const heart = document.createElement("span");
    heart.className = "float-heart";
    heart.textContent = ["♡", "💗", "✧", "❀"][i % 4];
    heart.style.left = `${Math.random() * 96}%`;
    heart.style.top = `${Math.random() * 96}%`;
    heart.style.animationDuration = `${7 + Math.random() * 7}s`;
    heart.style.animationDelay = `${Math.random() * 6}s`;
    softBg.appendChild(heart);
  }
}

window.addEventListener("resize", () => {
  document.documentElement.style.setProperty("--screen-h", `${window.innerHeight}px`);
});

document.documentElement.style.setProperty("--screen-h", `${window.innerHeight}px`);
buildBackground();
scenes.intro();