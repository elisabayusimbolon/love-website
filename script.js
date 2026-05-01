const $ = (id) => document.getElementById(id)

function goTo(sceneId) {
  document.querySelectorAll(".scene").forEach((scene) => {
    scene.classList.remove("active")
  })

  const target = $(sceneId)
  if (!target) return

  target.classList.add("active")

  const card = target.querySelector(".cute-card")
  if (card) card.scrollTop = 0

  updateGuide(sceneId)
}

function on(id, event, handler) {
  const element = $(id)
  if (!element) return

  element.addEventListener(event, handler)
}

/* GUIDE */

const guideTexts = {
  "scene-1": "aku nemenin dari awal 💛",
  "scene-2": "tangkap hatinya yaa 💘",
  "scene-3": "siap-siap baper 😚",
  "scene-4": "ngambeknya lucu aja 😤",
  "scene-5": "pelan-pelan dulu ya 🌙",
  "scene-6": "akhirnya sampai sini 💌"
}

function updateGuide(sceneId) {
  const bubble = $("guideBubble")
  if (!bubble) return

  bubble.textContent = guideTexts[sceneId] || "aku di sini 💛"
}

/* FLOATING BACKGROUND */

const floatingItems = [
  "♡",
  "💗",
  "💕",
  "hehe",
  "cute",
  "love",
  "🌸",
  "baper",
  "gemes",
  "✧"
]

function spawnFloatingItem() {
  const area = $("floatingArea")
  if (!area) return

  const item = document.createElement("div")
  item.className = "float-item"
  item.textContent = floatingItems[Math.floor(Math.random() * floatingItems.length)]

  item.style.left = Math.random() * 100 + "vw"
  item.style.fontSize = 12 + Math.random() * 12 + "px"
  item.style.animationDuration = 7 + Math.random() * 8 + "s"

  area.appendChild(item)

  setTimeout(() => item.remove(), 16000)
}

/* CURSOR HEART */

let cursorCooldown = false

function spawnCursorHeart(x, y) {
  if (cursorCooldown) return

  cursorCooldown = true

  const area = $("cursorArea")
  if (!area) return

  const heart = document.createElement("div")
  heart.className = "cursor-heart"
  heart.textContent = ["♡", "💗", "💕", "✦", "🌸"][Math.floor(Math.random() * 5)]
  heart.style.left = x + "px"
  heart.style.top = y + "px"

  area.appendChild(heart)

  setTimeout(() => heart.remove(), 900)

  setTimeout(() => {
    cursorCooldown = false
  }, 90)
}

/* CONFETTI */

function launchConfetti() {
  const area = $("confettiArea")
  if (!area) return

  const colors = [
    "#ff7fbd",
    "#e13691",
    "#ffd1e6",
    "#ffffff",
    "#ffb6d9",
    "#c92d7c",
    "#ffe58a",
    "#cfa8ff"
  ]

  for (let i = 0; i < 120; i++) {
    const item = document.createElement("div")
    const size = 5 + Math.random() * 8

    item.className = "confetti"
    item.style.left = Math.random() * 100 + "vw"
    item.style.width = size + "px"
    item.style.height = size + "px"
    item.style.background = colors[Math.floor(Math.random() * colors.length)]
    item.style.animationDuration = 2.4 + Math.random() * 2.8 + "s"
    item.style.animationDelay = Math.random() * 0.7 + "s"
    item.style.setProperty("--move-x", (Math.random() - 0.5) * 180 + "px")

    area.appendChild(item)

    setTimeout(() => item.remove(), 6000)
  }
}

/* NAILONG INTRO */

const nailongMoods = [
  { face: "♥ᴗ♥", text: "buat kamu" },
  { face: "•ᴗ•", text: "klik amplop" },
  { face: "◕ᴗ◕", text: "jangan malu" },
  { face: "≧ᴗ≦", text: "ayo dong" },
  { face: "˶ᵔᵕᵔ˶", text: "gemes ya?" }
]

let nailongIndex = 0
let nailongTimer = null

function renderNailongMood() {
  const mood = nailongMoods[nailongIndex]

  const face = $("nailongFace")
  const bubble = $("mascotBubble")

  if (face) face.textContent = mood.face
  if (bubble) bubble.textContent = mood.text
}

function startNailongLoop() {
  clearInterval(nailongTimer)

  renderNailongMood()

  nailongTimer = setInterval(() => {
    nailongIndex = (nailongIndex + 1) % nailongMoods.length
    renderNailongMood()
  }, 1300)
}

function openIntroEnvelope() {
  const envelope = $("secretEnvelope")

  if (envelope) envelope.classList.add("open")

  const bubble = $("mascotBubble")
  if (bubble) bubble.textContent = "yeayy kebuka 💌"

  for (let i = 0; i < 18; i++) {
    setTimeout(spawnFloatingItem, i * 45)
  }

  setTimeout(() => {
    goTo("scene-2")
    initHeartGame()
  }, 1050)
}

/* SCENE 2: HEART GAME */

let cuteScore = 0
let heartInterval = null
const maxCuteScore = 5

function initHeartGame() {
  cuteScore = 0

  $("cuteScore").textContent = cuteScore
  $("nextToRiddleBtn").classList.add("hidden")
  $("cuteHint").textContent = "siap-siap yaa..."

  const game = $("heartGame")
  game.querySelectorAll(".catch-heart").forEach((heart) => heart.remove())

  clearInterval(heartInterval)

  setTimeout(() => {
    $("cuteHint").textContent = "klik hati yang muncul 💕"
    spawnCatchHeart()
    heartInterval = setInterval(spawnCatchHeart, 760)
  }, 500)
}

function spawnCatchHeart() {
  const game = $("heartGame")
  if (!game || cuteScore >= maxCuteScore) return

  const heart = document.createElement("button")
  heart.className = "catch-heart"

  const hearts = ["💗", "💕", "💖", "💘", "🌸"]
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)]

  const maxX = game.clientWidth - 54
  const maxY = game.clientHeight - 54

  heart.style.left = Math.max(10, Math.random() * maxX) + "px"
  heart.style.top = Math.max(10, Math.random() * maxY) + "px"

  heart.addEventListener("click", () => {
    cuteScore++
    $("cuteScore").textContent = cuteScore

    heart.textContent = "✨"
    heart.style.pointerEvents = "none"

    setTimeout(() => heart.remove(), 150)

    if (cuteScore >= maxCuteScore) {
      finishHeartGame()
    }
  })

  game.appendChild(heart)

  setTimeout(() => {
    if (heart.parentElement) heart.remove()
  }, 1250)
}

function finishHeartGame() {
  clearInterval(heartInterval)

  const game = $("heartGame")
  game.querySelectorAll(".catch-heart").forEach((heart) => heart.remove())

  $("cuteHint").textContent = "yeay, hatinya ketangkep semua 😚"
  $("nextToRiddleBtn").classList.remove("hidden")

  for (let i = 0; i < 18; i++) {
    setTimeout(spawnFloatingItem, i * 45)
  }
}

/* SCENE 3: RIDDLE */

const riddles = [
  {
    question: "Kalau aku disuruh pilih tempat paling nyaman, aku pilih...",
    options: [
      "Kasur yang empuk",
      "Rumah yang tenang",
      "Kamu",
      "Kafe lucu"
    ],
    correctIndex: 2,
    emoji: "🏡",
    correctText:
      "Iya, kamu. Soalnya kadang rumah bukan tempat, tapi seseorang yang bikin hati ngerasa aman."
  },
  {
    question: "Kenapa aku bikin website kecil ini?",
    options: [
      "Karena lagi gabut",
      "Karena kamu spesial",
      "Karena disuruh Nailong",
      "Karena internet lancar"
    ],
    correctIndex: 1,
    emoji: "💌",
    correctText:
      "Benar. Karena kamu terlalu spesial buat cuma dikasih chat biasa."
  },
  {
    question: "Kalau kamu senyum, efeknya ke aku apa?",
    options: [
      "Biasa aja",
      "Loading sebentar",
      "Ikut senyum tanpa sadar",
      "Error 404"
    ],
    correctIndex: 2,
    emoji: "😳",
    correctText:
      "Benar. Senyum kamu tuh bahaya, bisa bikin aku lupa pura-pura biasa aja."
  }
]

let riddleIndex = 0
let riddleWrong = 0

function initRiddle() {
  riddleIndex = 0
  riddleWrong = 0
  showRiddle()
}

function showRiddle() {
  const riddle = riddles[riddleIndex]

  $("riddleCounter").textContent = `gombalan ${riddleIndex + 1} dari ${riddles.length}`
  $("riddleQuestion").textContent = riddle.question
  $("riddleFeedback").classList.add("hidden")
  $("nextRiddleBtn").classList.add("hidden")

  const options = $("riddleOptions")
  options.innerHTML = ""

  riddle.options.forEach((option, index) => {
    const button = document.createElement("button")
    button.className = "riddle-option"
    button.textContent = option
    button.addEventListener("click", () => chooseRiddleOption(index, button))

    options.appendChild(button)
  })
}

function chooseRiddleOption(index, button) {
  const riddle = riddles[riddleIndex]
  const buttons = document.querySelectorAll(".riddle-option")

  buttons.forEach((item) => {
    item.disabled = true
  })

  $("riddleFeedback").classList.remove("hidden")

  if (index === riddle.correctIndex) {
    button.classList.add("correct")

    $("feedbackEmoji").textContent = riddle.emoji
    $("feedbackText").textContent = riddle.correctText

    $("nextRiddleBtn").classList.remove("hidden")
    $("nextRiddleBtn").textContent =
      riddleIndex < riddles.length - 1
        ? "Gombalan berikutnya"
        : "Lanjut, tapi jangan pura-pura nggak baper"

    return
  }

  button.classList.add("wrong")
  riddleWrong++

  $("feedbackEmoji").textContent = "😚"

  if (riddleWrong >= 2) {
    $("feedbackText").textContent =
      "Aku kasih clue ya: pilih jawaban yang paling bikin pipi panas."
  } else {
    $("feedbackText").textContent =
      "Hmm hampir, tapi coba pikir pakai hati, jangan pakai logika dulu."
  }

  setTimeout(() => {
    buttons.forEach((item) => {
      item.disabled = false
      item.classList.remove("wrong")
    })
  }, 900)
}

function nextRiddle() {
  riddleIndex++
  riddleWrong = 0

  if (riddleIndex < riddles.length) {
    showRiddle()
  } else {
    goTo("scene-4")
    initMoodScene()
  }
}

/* SCENE 4: USER POUT */

function initMoodScene() {
  $("moodOptions").classList.remove("hidden")
  $("poutBox").classList.add("hidden")
  $("toValidationBtn").classList.add("hidden")
  $("poutMeterFill").style.width = "100%"

  $("moodText").textContent =
    "Pilih alasan ngambek kamu. Tapi ngambeknya yang lucu aja ya."
}

function chooseMood(event) {
  const button = event.target.closest(".mood-btn")
  if (!button) return

  const mood = button.dataset.mood

  const messages = {
    baper:
      "Aduh, kamu mulai baper ya? Nggak apa-apa. Baper yang ini aman kok.",
    jail:
      "Iya, websitenya memang jail. Tapi jailnya sayang-sayang, bukan jahat.",
    senyum:
      "Ketahuan senyum sendiri. Lucu banget sih, jadi aku ikut senyum juga."
  }

  $("moodOptions").classList.add("hidden")
  $("poutBox").classList.remove("hidden")
  $("toValidationBtn").classList.remove("hidden")
  $("moodText").textContent = "Oke, sekarang kamu boleh ngambek manja."

  $("poutMessage").textContent = messages[mood] || messages.baper

  setTimeout(() => {
    $("poutMeterFill").style.width = "18%"
  }, 250)

  for (let i = 0; i < 10; i++) {
    setTimeout(spawnFloatingItem, i * 70)
  }
}

/* SCENE 5: VALIDATION */

function initValidationScene() {
  $("startValidationBtn").classList.remove("hidden")
  $("validationLines").classList.add("hidden")
  $("nextToFinalBtn").classList.add("hidden")

  document.querySelectorAll(".validation-line").forEach((line) => {
    line.classList.remove("show")
  })
}

function startValidation() {
  $("startValidationBtn").classList.add("hidden")
  $("validationLines").classList.remove("hidden")

  const lines = document.querySelectorAll(".validation-line")

  lines.forEach((line, index) => {
    setTimeout(() => {
      line.classList.add("show")
    }, index * 650)
  })

  setTimeout(() => {
    $("nextToFinalBtn").classList.remove("hidden")
  }, lines.length * 650 + 300)
}

/* SCENE 6: FINAL */

function initFinalScene() {
  $("openLetterBtn").classList.remove("hidden")
  $("finalLetter").classList.add("hidden")
  $("finalActions").classList.add("hidden")

  document.querySelectorAll(".final-line").forEach((line) => {
    line.classList.remove("show")
  })
}

function openFinalLetter() {
  $("openLetterBtn").classList.add("hidden")
  $("finalLetter").classList.remove("hidden")

  const lines = document.querySelectorAll(".final-line")

  lines.forEach((line, index) => {
    setTimeout(() => {
      line.classList.add("show")
    }, index * 520)
  })

  setTimeout(() => {
    $("finalActions").classList.remove("hidden")
    launchConfetti()
  }, lines.length * 520 + 500)
}

function restartWebsite() {
  clearInterval(heartInterval)

  const envelope = $("secretEnvelope")
  if (envelope) envelope.classList.remove("open")

  initFinalScene()
  goTo("scene-1")
}

/* EVENTS */

document.addEventListener("DOMContentLoaded", () => {
  goTo("scene-1")
  startNailongLoop()

  setInterval(spawnFloatingItem, 850)

  for (let i = 0; i < 14; i++) {
    setTimeout(spawnFloatingItem, i * 140)
  }

  document.addEventListener("mousemove", (event) => {
    spawnCursorHeart(event.clientX, event.clientY)
  })

  document.addEventListener("touchstart", (event) => {
    const touch = event.touches[0]
    if (!touch) return

    spawnCursorHeart(touch.clientX, touch.clientY)
  })

  on("startBtn", "click", openIntroEnvelope)

  on("nextToRiddleBtn", "click", () => {
    goTo("scene-3")
    initRiddle()
  })

  on("nextRiddleBtn", "click", nextRiddle)

  const moodOptions = $("moodOptions")
  if (moodOptions) {
    moodOptions.addEventListener("click", chooseMood)
  }

  on("toValidationBtn", "click", () => {
    goTo("scene-5")
    initValidationScene()
  })

  on("startValidationBtn", "click", startValidation)

  on("nextToFinalBtn", "click", () => {
    goTo("scene-6")
    initFinalScene()
  })

  on("openLetterBtn", "click", openFinalLetter)
  on("celebrateBtn", "click", launchConfetti)
  on("restartBtn", "click", restartWebsite)
})