const $ = (id) => document.getElementById(id)
const $$ = (selector) => document.querySelectorAll(selector)

let isSwitching = false
let currentScene = "scene-1"

const moodClasses = [
  "mood-happy",
  "mood-spark",
  "mood-love",
  "mood-shy",
  "mood-wow",
  "mood-soft",
  "mood-proud"
]

function setPetMood(mood, buddyText = "aku nemenin 💛", bubbleText = "") {
  $$("[data-pet]").forEach((pet) => {
    pet.classList.remove(...moodClasses)
    pet.classList.add(mood)
  })

  const buddyPet = $("buddyPet")
  if (buddyPet) {
    buddyPet.classList.remove(...moodClasses)
    buddyPet.classList.add(mood)
  }

  if ($("buddyText")) $("buddyText").textContent = buddyText
  if ($("mascotBubble") && bubbleText) $("mascotBubble").textContent = bubbleText
}

function goTo(sceneId) {
  const target = $(sceneId)
  const current = document.querySelector(".scene.active")

  if (!target || target === current || isSwitching) return

  isSwitching = true

  if (current) current.classList.add("leaving")

  setTimeout(() => {
    if (current) current.classList.remove("active", "leaving")

    target.classList.add("active")
    target.scrollTop = 0

    const card = target.querySelector(".card")
    if (card) card.scrollTop = 0

    currentScene = sceneId
    isSwitching = false
  }, 220)
}

/* BACKGROUND */

const floatingItems = [
  "love",
  "gemes",
  "baper",
  "hehe",
  "cute",
  "♡",
  "✦",
  "manis",
  "salting"
]

function spawnFloatingItem() {
  const area = $("floatingArea")
  if (!area) return

  const total = document.querySelectorAll(".float-item").length
  if (total > 24) return

  const item = document.createElement("div")
  item.className = "float-item"
  item.textContent = floatingItems[Math.floor(Math.random() * floatingItems.length)]

  item.style.left = Math.random() * 100 + "vw"
  item.style.fontSize = 12 + Math.random() * 14 + "px"
  item.style.animationDuration = 8 + Math.random() * 8 + "s"
  item.style.opacity = 0.25 + Math.random() * 0.35

  area.appendChild(item)

  setTimeout(() => item.remove(), 17000)
}

function launchConfetti() {
  const area = $("confettiArea")
  if (!area) return

  const colors = ["#ec3f93", "#ff7fbd", "#ffc6df", "#ffffff", "#d8bdff", "#fff5a8"]
  const icons = ["♡", "💗", "✦", "🌸", "✨"]

  for (let i = 0; i < 90; i++) {
    const item = document.createElement("div")
    const size = 8 + Math.random() * 12

    item.className = "confetti"
    item.textContent = Math.random() > 0.45 ? icons[Math.floor(Math.random() * icons.length)] : ""

    item.style.left = Math.random() * 100 + "vw"
    item.style.width = size + "px"
    item.style.height = size + "px"
    item.style.background = item.textContent
      ? "transparent"
      : colors[Math.floor(Math.random() * colors.length)]
    item.style.color = colors[Math.floor(Math.random() * colors.length)]
    item.style.fontSize = 14 + Math.random() * 10 + "px"
    item.style.animationDuration = 2.5 + Math.random() * 2.9 + "s"
    item.style.animationDelay = Math.random() * 0.6 + "s"
    item.style.setProperty("--move-x", (Math.random() - 0.5) * 180 + "px")

    area.appendChild(item)

    setTimeout(() => item.remove(), 6200)
  }
}

/* INTRO */

const introMoods = [
  { mood: "mood-happy", bubble: "jangan malu", buddy: "aku nemenin 💛" },
  { mood: "mood-shy", bubble: "klik aku", buddy: "pelan-pelan aja 🫣" },
  { mood: "mood-wow", bubble: "ada kejutan", buddy: "siap-siap yaa ✨" },
  { mood: "mood-love", bubble: "buat kamu", buddy: "ini rahasia kecil 💗" }
]

let introMoodIndex = 0

function cycleIntroMood() {
  if (currentScene !== "scene-1") return

  const data = introMoods[introMoodIndex % introMoods.length]
  setPetMood(data.mood, data.buddy, data.bubble)
  introMoodIndex++
}

function startJourney() {
  initCatchGame()
  setPetMood("mood-spark", "tangkap hatinya 💘")
  goTo("scene-2")
}

/* LEVEL 1: CATCH HEART */

let heartCount = 0
const heartTargets = ["💘", "💗", "💕", "💞", "💓"]

const heartPositions = [
  { left: 12, top: 18 },
  { left: 73, top: 20 },
  { left: 50, top: 42 },
  { left: 20, top: 67 },
  { left: 78, top: 68 }
]

function initCatchGame() {
  heartCount = 0

  const box = $("catchBox")
  const score = $("heartScore")
  const btn = $("toRiddleBtn")
  const hint = $("catchHint")

  if (!box || !score || !btn) return

  score.textContent = "0/5"
  btn.classList.add("hidden")
  hint.textContent = "klik hati yang muncul 💕"

  box.querySelectorAll(".heart-target").forEach((heart) => heart.remove())

  heartPositions.forEach((pos, index) => {
    const heart = document.createElement("button")
    heart.className = "heart-target"
    heart.type = "button"
    heart.textContent = heartTargets[index]
    heart.style.left = pos.left + "%"
    heart.style.top = pos.top + "%"
    heart.style.animationDelay = index * 0.13 + "s"

    heart.addEventListener("click", () => collectHeart(heart))

    box.appendChild(heart)
  })
}

function collectHeart(heart) {
  if (heart.classList.contains("collected")) return

  heart.classList.add("collected")
  heartCount++

  $("heartScore").textContent = `${heartCount}/5`

  if (heartCount === 1) {
    $("catchHint").textContent = "nah gitu, satu udah ketangkap 🫶"
    setPetMood("mood-wow", "yeay satu 💗")
  }

  if (heartCount === 3) {
    $("catchHint").textContent = "dikit lagi, jangan kabur dulu yaa 😤"
    setPetMood("mood-proud", "kamu jago juga 😌")
  }

  if (heartCount >= 5) {
    $("catchHint").textContent = "yeay, hatinya ketangkep semua 🫣"
    $("toRiddleBtn").classList.remove("hidden")
    setPetMood("mood-love", "lanjut baper ya 💘")
    launchMiniBurst()
  }
}

function launchMiniBurst() {
  const area = $("confettiArea")
  if (!area) return

  for (let i = 0; i < 22; i++) {
    const item = document.createElement("div")
    item.className = "confetti"
    item.textContent = ["💗", "💕", "✨", "♡"][Math.floor(Math.random() * 4)]
    item.style.left = 42 + Math.random() * 16 + "vw"
    item.style.color = ["#ec3f93", "#ff7fbd", "#d8bdff"][Math.floor(Math.random() * 3)]
    item.style.background = "transparent"
    item.style.fontSize = 16 + Math.random() * 12 + "px"
    item.style.animationDuration = 2 + Math.random() * 1.5 + "s"
    item.style.setProperty("--move-x", (Math.random() - 0.5) * 120 + "px")

    area.appendChild(item)
    setTimeout(() => item.remove(), 4200)
  }
}

/* LEVEL 2: RIDDLES */

const riddles = [
  {
    title: "Teka-teki baper",
    question: "Kalau aku disuruh pilih tempat paling nyaman, aku pilih...",
    emoji: "💞",
    options: [
      {
        text: "Kasur empuk",
        correct: false,
        emoji: "🛏️",
        response:
          "Kasur memang nyaman buat badan. Tapi yang bisa bikin pikiranku ikut tenang itu bukan kasur... coba pikir lagi pakai hati."
      },
      {
        text: "Rumah yang tenang",
        correct: false,
        emoji: "🏡",
        response:
          "Rumah memang tenang. Tapi kadang yang terasa seperti rumah bukan tempat, melainkan seseorang."
      },
      {
        text: "Kamu",
        correct: true,
        emoji: "🫶",
        response:
          "Bener. Karena ada orang yang nggak perlu ngapa-ngapain, tapi rasanya sudah bikin nyaman."
      },
      {
        text: "Kafe lucu",
        correct: false,
        emoji: "☕",
        response:
          "Kafe lucu boleh, tapi kalau nggak ada kamu, tetap aja kurang satu hal kecil yang bikin manis."
      }
    ]
  },
  {
    title: "Teka-teki kecil",
    question: "Kalau aku jadi kalender, tanggal yang paling aku tunggu itu...",
    emoji: "🌷",
    options: [
      {
        text: "Tanggal merah",
        correct: false,
        emoji: "📅",
        response:
          "Tanggal merah memang bikin senang. Tapi ada tanggal yang lebih bikin aku nunggu: tanggal ketemu kamu."
      },
      {
        text: "Tanggal gajian",
        correct: false,
        emoji: "💸",
        response:
          "Gajian bikin lega, tapi kabar dari kamu bisa bikin lega dengan cara yang beda."
      },
      {
        text: "Tanggal ketemu kamu",
        correct: true,
        emoji: "🥹",
        response:
          "Iya. Karena beberapa hari terasa lebih ditunggu kalau ada kamu di dalam rencananya."
      },
      {
        text: "Tanggal libur panjang",
        correct: false,
        emoji: "🌙",
        response:
          "Libur panjang enak, tapi rasanya tetap kurang kalau nggak ada momen kecil bareng kamu."
      }
    ]
  },
  {
    title: "Teka-teki terakhir",
    question: "Hal kecil yang bisa bikin aku senyum tanpa alasan adalah...",
    emoji: "💌",
    options: [
      {
        text: "Diskon besar",
        correct: false,
        emoji: "🛍️",
        response:
          "Diskon memang menggoda, tapi senyumku nggak semurah itu. Ada satu hal yang lebih ampuh."
      },
      {
        text: "Makanan enak",
        correct: false,
        emoji: "🍰",
        response:
          "Makanan enak bisa bikin bahagia sebentar. Tapi ada yang bisa bikin senyumku muncul tiba-tiba."
      },
      {
        text: "Kamu muncul di chat",
        correct: true,
        emoji: "💗",
        response:
          "Nah ini. Kadang satu notifikasi dari orang yang tepat bisa ngubah mood satu hari."
      },
      {
        text: "Tidur panjang",
        correct: false,
        emoji: "😴",
        response:
          "Tidur panjang bikin segar. Tapi kalau yang muncul di layar itu kamu, segarnya beda."
      }
    ]
  }
]

let riddleIndex = 0

function initRiddle() {
  riddleIndex = 0
  renderRiddle()
  setPetMood("mood-love", "siap-siap baper 🫣")
}

function renderRiddle() {
  const data = riddles[riddleIndex]

  $("riddleCounter").textContent = `gombalan ${riddleIndex + 1} dari ${riddles.length}`
  $("riddleTitle").textContent = data.title
  $("riddleQuestion").textContent = data.question

  const options = $("riddleOptions")
  const response = $("riddleResponse")

  options.innerHTML = ""
  response.classList.add("hidden")
  response.classList.remove("success", "oops")

  data.options.forEach((option) => {
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "choice-btn"
    btn.textContent = option.text

    btn.addEventListener("click", () => chooseRiddleAnswer(option, btn))

    options.appendChild(btn)
  })
}

function chooseRiddleAnswer(option, clickedButton) {
  const response = $("riddleResponse")
  const responseEmoji = $("riddleEmoji")
  const responseText = $("riddleText")
  const responseBtn = $("riddleResponseBtn")

  response.classList.remove("hidden", "success", "oops")
  responseEmoji.textContent = option.emoji
  responseText.textContent = option.response

  $$("#riddleOptions .choice-btn").forEach((btn) => {
    btn.classList.remove("correct", "wrong")
  })

  if (option.correct) {
    response.classList.add("success")
    clickedButton.classList.add("correct")

    $$("#riddleOptions .choice-btn").forEach((btn) => {
      btn.disabled = true
    })

    setPetMood("mood-love", "jawabannya manis 💗")

    responseBtn.textContent =
      riddleIndex < riddles.length - 1
        ? "Buka gombalan berikutnya"
        : "Lanjut, aku mau lihat reaksimu"

    responseBtn.onclick = () => {
      riddleIndex++

      if (riddleIndex < riddles.length) {
        renderRiddle()
        setPetMood("mood-shy", "masih ada lagi 🫣")
      } else {
        initVibe()
        goTo("scene-4")
      }
    }

    return
  }

  response.classList.add("oops")
  clickedButton.classList.add("wrong")
  setPetMood("mood-wow", "hampir kok 😚")

  responseBtn.textContent = "Aku coba pilih yang lain"
  responseBtn.onclick = () => {
    response.classList.add("hidden")
    clickedButton.classList.remove("wrong")
  }
}

/* LEVEL 3: VIBE */

const vibeResponses = {
  salting: {
    emoji: "🫠",
    text:
      "Salting dikit nggak apa-apa. Yang penting jangan pura-pura nggak senyum, soalnya dari sini keliatan vibes-nya udah mulai manis."
  },
  gengsi: {
    emoji: "😌",
    text:
      "Biasa aja katanya. Tapi biasanya yang bilang biasa aja itu justru lagi paling berusaha kelihatan kalem."
  },
  curiga: {
    emoji: "👀",
    text:
      "Curiganya benar. Dari awal arahnya memang ke kamu. Pelan-pelan, biar nggak terlalu kelihatan aku niat banget."
  },
  senyum: {
    emoji: "🙈",
    text:
      "Senyum tapi gengsi itu lucu. Nggak usah ditahan terus, nanti pipinya protes karena kebanyakan pura-pura."
  }
}

function initVibe() {
  $("vibeResult").classList.add("hidden")
  $$(".vibe-btn").forEach((btn) => btn.classList.remove("correct"))

  setPetMood("mood-shy", "salting dikit? 🫣")
}

function chooseVibe(key, btn) {
  const data = vibeResponses[key]
  const result = $("vibeResult")

  $$(".vibe-btn").forEach((button) => button.classList.remove("correct"))
  btn.classList.add("correct")

  $("vibeEmoji").textContent = data.emoji
  $("vibeText").textContent = data.text
  result.classList.remove("hidden")

  setPetMood("mood-love", "ketahuan senyum 💗")
}

/* LEVEL 4: SOFT VALIDATION */

const softPieces = [
  {
    label: "Buka pelan 1 🌙",
    text: "Kamu boleh capek. Nggak harus selalu kelihatan kuat di depan semua orang."
  },
  {
    label: "Buka pelan 2 ☁️",
    text: "Kamu boleh diam dulu. Kadang hati juga butuh ruang buat napas."
  },
  {
    label: "Buka pelan 3 🫶",
    text: "Kamu boleh manja sedikit. Nggak semua hal harus kamu tahan sendiri."
  },
  {
    label: "Buka pelan 4 💌",
    text: "Tapi jangan ngerasa sendirian ya. Hari ini aku ada di sini buat nemenin kamu."
  },
  {
    label: "Buka pelan 5 ✨",
    text: "Dan setelah ini, aku mau balikin senyum kamu lagi. Pelan-pelan, tapi manis."
  }
]

let openedSoftPieces = new Set()

function initSoftLevel() {
  openedSoftPieces = new Set()

  const grid = $("softGrid")
  const note = $("softNote")
  const finalBtn = $("toFinalBtn")

  grid.innerHTML = ""
  note.classList.add("hidden")
  note.textContent = ""
  finalBtn.classList.add("hidden")

  softPieces.forEach((piece, index) => {
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "soft-piece"
    btn.textContent = piece.label

    btn.addEventListener("click", () => openSoftPiece(index, btn))

    grid.appendChild(btn)
  })

  setPetMood("mood-soft", "pelan-pelan dulu 🌙")
}

function openSoftPiece(index, btn) {
  const note = $("softNote")
  const piece = softPieces[index]

  openedSoftPieces.add(index)
  btn.classList.add("opened")
  btn.textContent = piece.text

  note.classList.remove("hidden")
  note.textContent = piece.text

  if (openedSoftPieces.size >= softPieces.length) {
    note.innerHTML =
      "Nah... sekarang hatinya udah lebih hangat sedikit kan? " +
      "Ini bukan bagian sedih yang lama. Ini cuma cara halus buat bilang: " +
      "<strong>kamu berharga, dan kamu pantas ditemenin dengan manis.</strong> 💗"

    $("toFinalBtn").classList.remove("hidden")
    setPetMood("mood-proud", "sekarang manis lagi ✨")
  }
}

/* FINAL */

function initFinal() {
  $("letterWrap").classList.add("hidden")
  $("openLetterBtn").classList.remove("hidden")
  setPetMood("mood-love", "akhirnya sampai 💌")
}

function openFinalLetter() {
  $("openLetterBtn").classList.add("hidden")
  $("letterWrap").classList.remove("hidden")

  const card = document.querySelector("#scene-6 .card")
  setTimeout(() => {
    $("letterWrap").scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, 120)

  setPetMood("mood-love", "aku suka kamu 💗")
  launchConfetti()

  if (card) {
    setTimeout(() => {
      card.scrollTop = card.scrollHeight
    }, 500)
  }
}

function restart() {
  initCatchGame()
  initRiddle()
  initVibe()
  initSoftLevel()
  initFinal()

  setPetMood("mood-happy", "aku nemenin 💛", "jangan malu")
  goTo("scene-1")
}

/* EVENTS */

document.addEventListener("DOMContentLoaded", () => {
  setPetMood("mood-happy", "aku nemenin 💛", "jangan malu")

  setInterval(spawnFloatingItem, 950)
  setInterval(cycleIntroMood, 1600)

  for (let i = 0; i < 14; i++) {
    setTimeout(spawnFloatingItem, i * 160)
  }

  $("introEnvelope").addEventListener("click", startJourney)

  $("toRiddleBtn").addEventListener("click", () => {
    initRiddle()
    goTo("scene-3")
  })

  $$(".vibe-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      chooseVibe(btn.dataset.vibe, btn)
    })
  })

  $("toSoftBtn").addEventListener("click", () => {
    initSoftLevel()
    goTo("scene-5")
  })

  $("toFinalBtn").addEventListener("click", () => {
    initFinal()
    goTo("scene-6")
  })

  $("openLetterBtn").addEventListener("click", openFinalLetter)
  $("celebrateBtn").addEventListener("click", launchConfetti)
  $("restartBtn").addEventListener("click", restart)
})