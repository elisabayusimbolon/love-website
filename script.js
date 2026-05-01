const $ = (id) => document.getElementById(id)
const $$ = (selector) => document.querySelectorAll(selector)

let currentScene = "scene-1"
let isChangingScene = false
let heartInterval = null
let cuteScore = 0
let riddleIndex = 0
let mascotIndex = 0
let mascotTimer = null
let cursorCooldown = false
let vhRaf = null

const sceneTimers = []

function setRealVh() {
  if (vhRaf) cancelAnimationFrame(vhRaf)

  vhRaf = requestAnimationFrame(() => {
    const height = window.visualViewport?.height || window.innerHeight
    const vh = height * 0.01

    document.documentElement.style.setProperty("--vh", `${vh}px`)
    document.documentElement.style.setProperty("--screen-h", `${height}px`)
  })
}

setRealVh()

window.addEventListener("resize", setRealVh, { passive: true })

window.addEventListener("orientationchange", () => {
  setTimeout(setRealVh, 250)
})

if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", setRealVh, { passive: true })
  window.visualViewport.addEventListener("scroll", setRealVh, { passive: true })
}

function delay(fn, ms) {
  const timer = setTimeout(() => {
    const index = sceneTimers.indexOf(timer)
    if (index >= 0) sceneTimers.splice(index, 1)
    fn()
  }, ms)

  sceneTimers.push(timer)
  return timer
}

function clearSceneTimers() {
  while (sceneTimers.length) {
    clearTimeout(sceneTimers.pop())
  }
}

function on(id, event, handler) {
  const element = $(id)
  if (!element) return
  element.addEventListener(event, handler)
}

function goTo(sceneId, callback) {
  if (isChangingScene || sceneId === currentScene) return

  const target = $(sceneId)
  if (!target) return

  isChangingScene = true
  clearSceneTimers()

  const activeScene = $(currentScene)
  if (activeScene) activeScene.classList.remove("active")

  target.classList.add("active")
  currentScene = sceneId

  target.scrollTop = 0

  const card = target.querySelector(".cute-card")
  if (card) card.scrollTop = 0

  updateGuide(sceneId)

  setTimeout(() => {
    isChangingScene = false
    if (typeof callback === "function") callback()
  }, 520)
}

/* GUIDE */

const guideTexts = {
  "scene-1": "aku nemenin dari awal 💛",
  "scene-2": "tangkap hatinya yaa 💘",
  "scene-3": "siap-siap baper 😚",
  "scene-4": "saltingnya ketahuan nih 😳",
  "scene-5": "pelan-pelan dulu 🌙",
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
  item.style.fontSize = 12 + Math.random() * 13 + "px"
  item.style.animationDuration = 7 + Math.random() * 8 + "s"
  item.style.animationDelay = Math.random() * 0.5 + "s"

  area.appendChild(item)

  setTimeout(() => item.remove(), 16000)
}

/* CURSOR HEART */

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

  const isMobileLike = window.matchMedia(
    "(max-width: 560px), (hover: none), (pointer: coarse)"
  ).matches

  const total = isMobileLike ? 70 : 120

  for (let i = 0; i < total; i++) {
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

/* CUTE CHARACTER */

const mascotMoods = [
  {
    theme: "theme-pink",
    face: "ω",
    bubble: "klik aku"
  },
  {
    theme: "theme-yellow",
    face: "ᴗ",
    bubble: "jangan malu"
  },
  {
    theme: "theme-lavender",
    face: "▽",
    bubble: "ayo dong"
  },
  {
    theme: "theme-peach",
    face: "ᴥ",
    bubble: "gemes ya?"
  },
  {
    theme: "theme-mint",
    face: "◡",
    bubble: "buat kamu"
  }
]

function applyMascotMood() {
  const mood = mascotMoods[mascotIndex]
  const mainMascot = $("mainMascot")
  const guideMascot = $("guideMascot")
  const face = $("mascotFace")
  const bubble = $("mascotBubble")

  const themes = ["theme-pink", "theme-yellow", "theme-lavender", "theme-peach", "theme-mint"]

  if (mainMascot) {
    mainMascot.classList.remove(...themes)
    mainMascot.classList.add(mood.theme)
  }

  if (guideMascot) {
    guideMascot.classList.remove(...themes)
    guideMascot.classList.add(mood.theme)
  }

  if (face) face.textContent = mood.face
  if (bubble) bubble.textContent = mood.bubble
}

function startMascotLoop() {
  clearInterval(mascotTimer)
  applyMascotMood()

  mascotTimer = setInterval(() => {
    mascotIndex = (mascotIndex + 1) % mascotMoods.length
    applyMascotMood()
  }, 1200)
}

/* SCENE 1 */

function startIntro() {
  const bubble = $("mascotBubble")
  if (bubble) bubble.textContent = "yeayy, mulai 💗"

  for (let i = 0; i < 18; i++) {
    setTimeout(spawnFloatingItem, i * 45)
  }

  setTimeout(() => {
    goTo("scene-2", initHeartGame)
  }, 430)
}

/* SCENE 2: HEART GAME */

const maxCuteScore = 5

function initHeartGame() {
  cuteScore = 0

  const score = $("cuteScore")
  const next = $("nextToRiddleBtn")
  const hint = $("cuteHint")
  const game = $("heartGame")

  if (score) score.textContent = cuteScore
  if (next) next.classList.add("hidden")
  if (hint) hint.textContent = "siap-siap yaa..."

  if (game) {
    game.querySelectorAll(".catch-heart").forEach((heart) => heart.remove())
  }

  clearInterval(heartInterval)

  delay(() => {
    if (hint) hint.textContent = "klik hati yang muncul 💕"
    spawnCatchHeart()
    heartInterval = setInterval(spawnCatchHeart, 760)
  }, 450)
}

function spawnCatchHeart() {
  const game = $("heartGame")
  if (!game || cuteScore >= maxCuteScore) return

  const heart = document.createElement("button")
  heart.className = "catch-heart"

  const hearts = ["💗", "💕", "💖", "💘", "🌸"]
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)]

  const maxX = Math.max(20, game.clientWidth - 54)
  const maxY = Math.max(20, game.clientHeight - 54)

  heart.style.left = Math.max(10, Math.random() * maxX) + "px"
  heart.style.top = Math.max(10, Math.random() * maxY) + "px"

  heart.addEventListener("click", () => {
    cuteScore++

    const score = $("cuteScore")
    if (score) score.textContent = cuteScore

    heart.textContent = "✨"
    heart.style.pointerEvents = "none"

    setTimeout(() => heart.remove(), 140)

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
  const hint = $("cuteHint")
  const next = $("nextToRiddleBtn")

  if (game) {
    game.querySelectorAll(".catch-heart").forEach((heart) => heart.remove())
  }

  if (hint) hint.textContent = "yeay, hatinya ketangkep semua 🫣"
  if (next) next.classList.remove("hidden")

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
      "Iya, kamu. Soalnya nyaman itu bukan cuma tempat, tapi seseorang yang bikin hati ngerasa pulang.",
    wrongFeedback: [
      "Kasur empuk memang enak, tapi kalau nggak ada kamu rasanya tetap kurang hangat.",
      "Rumah tenang itu nyaman, tapi kamu lebih mirip tempat pulang yang nggak perlu alamat.",
      "",
      "Kafe lucu boleh, tapi aku lebih betah kalau yang lucu itu kamu di depanku."
    ]
  },
  {
    question: "Kalau aku tiba-tiba senyum sendiri, biasanya gara-gara...",
    options: [
      "Lihat meme lucu",
      "Ingat kamu",
      "Lagi menang game",
      "Nggak sengaja"
    ],
    correctIndex: 1,
    emoji: "😳",
    correctText:
      "Benar. Kadang kamu cuma lewat di pikiran, tapi efeknya bisa bikin aku senyum tanpa izin.",
    wrongFeedback: [
      "Meme lucu bisa bikin ketawa, tapi kamu levelnya bikin senyum terus kepikiran.",
      "",
      "Menang game bikin senang sebentar. Ingat kamu bikin senangnya lebih lama.",
      "Nggak sengaja? Hmm... kalau soal kamu, senyumnya kayaknya selalu ada alasannya."
    ]
  },
  {
    question: "Kenapa website kecil ini dibuat pelan-pelan?",
    options: [
      "Biar kamu penasaran",
      "Biar kelihatan niat",
      "Biar kamu senyum",
      "Semua jawaban benar"
    ],
    correctIndex: 3,
    emoji: "💌",
    correctText:
      "Iya, semuanya benar. Aku pengen kamu penasaran, senyum, terus sadar kalau kamu memang dibuat spesial di sini.",
    wrongFeedback: [
      "Penasaran memang tujuannya, tapi bukan cuma itu. Masih ada alasan yang lebih manis.",
      "Niat memang iya, karena kamu nggak cocok dikasih yang asal-asalan.",
      "Senyum kamu memang target utama, tapi ada jawaban yang lebih lengkap.",
      ""
    ]
  }
]

function initRiddle() {
  riddleIndex = 0
  showRiddle()
}

function showRiddle() {
  const riddle = riddles[riddleIndex]

  const counter = $("riddleCounter")
  const question = $("riddleQuestion")
  const feedback = $("riddleFeedback")
  const next = $("nextRiddleBtn")
  const options = $("riddleOptions")

  if (counter) counter.textContent = `gombalan ${riddleIndex + 1} dari ${riddles.length}`
  if (question) question.textContent = riddle.question
  if (feedback) feedback.classList.add("hidden")
  if (next) next.classList.add("hidden")

  if (!options) return
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
  const feedback = $("riddleFeedback")
  const feedbackEmoji = $("feedbackEmoji")
  const feedbackText = $("feedbackText")
  const next = $("nextRiddleBtn")

  buttons.forEach((item) => {
    item.disabled = true
  })

  if (feedback) feedback.classList.remove("hidden")

  if (index === riddle.correctIndex) {
    button.classList.add("correct")

    if (feedbackEmoji) feedbackEmoji.textContent = riddle.emoji
    if (feedbackText) feedbackText.textContent = riddle.correctText

    if (next) {
      next.classList.remove("hidden")
      next.textContent =
        riddleIndex < riddles.length - 1
          ? "Gombalan berikutnya"
          : "Lanjut, jangan pura-pura nggak salting"
    }

    for (let i = 0; i < 8; i++) {
      setTimeout(spawnFloatingItem, i * 70)
    }

    return
  }

  button.classList.add("wrong")

  if (feedbackEmoji) {
    feedbackEmoji.textContent = ["🥺", "😚", "🫣"][Math.floor(Math.random() * 3)]
  }

  if (feedbackText) {
    feedbackText.textContent =
      riddle.wrongFeedback[index] ||
      "Hampir, tapi coba pilih jawaban yang paling bikin hati kamu senyum."
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

  if (riddleIndex < riddles.length) {
    showRiddle()
    return
  }

  goTo("scene-4", initReactionScene)
}

/* SCENE 4: REACTION */

const reactionMessages = {
  biasa:
    "Pura-pura biasa aja boleh. Tapi aku tahu, kalau kamu masih di sini sampai level ini, berarti sedikit banyak kamu penasaran juga kan? 😌",
  gengsi:
    "Salting tapi gengsi itu lucu banget. Tenang, aku nggak bakal ngeledek keras-keras. Aku senyum pelan aja dari sini 😳",
  ngambek:
    "Nah, ngambek manja begini masih aman. Biar aku bujuk ya: jangan ngambek lama-lama, nanti lucunya kebanyakan 🥺"
}

function initReactionScene() {
  const options = $("reactionOptions")
  const box = $("reactionBox")
  const next = $("toValidationBtn")
  const text = $("reactionText")
  const meter = $("poutMeterFill")

  if (options) options.classList.remove("hidden")
  if (box) box.classList.add("hidden")
  if (next) next.classList.add("hidden")
  if (meter) meter.style.width = "100%"

  if (text) {
    text.textContent =
      "Setelah teka-teki tadi, kamu mungkin mau pura-pura biasa aja. Tapi aku curiga kamu sedikit salting."
  }
}

function chooseReaction(event) {
  const button = event.target.closest(".reaction-btn")
  if (!button) return

  const reaction = button.dataset.reaction

  const options = $("reactionOptions")
  const box = $("reactionBox")
  const next = $("toValidationBtn")
  const message = $("reactionMessage")
  const text = $("reactionText")
  const meter = $("poutMeterFill")

  if (options) options.classList.add("hidden")
  if (box) box.classList.remove("hidden")
  if (next) next.classList.remove("hidden")

  if (text) text.textContent = "Oke, reaksinya sudah tercatat. Sekarang aku bujuk pelan-pelan yaa."
  if (message) message.textContent = reactionMessages[reaction] || reactionMessages.gengsi

  if (meter) {
    meter.style.width = "100%"

    setTimeout(() => {
      meter.style.width = reaction === "ngambek" ? "24%" : "38%"
    }, 180)
  }

  for (let i = 0; i < 12; i++) {
    setTimeout(spawnFloatingItem, i * 60)
  }
}

/* SCENE 5: VALIDATION */

function initValidationScene() {
  const start = $("startValidationBtn")
  const lines = $("validationLines")
  const next = $("nextToFinalBtn")

  if (start) start.classList.remove("hidden")
  if (lines) lines.classList.add("hidden")
  if (next) next.classList.add("hidden")

  document.querySelectorAll(".validation-line").forEach((line) => {
    line.classList.remove("show")
  })
}

function startValidation() {
  const start = $("startValidationBtn")
  const linesWrap = $("validationLines")
  const next = $("nextToFinalBtn")
  const lines = document.querySelectorAll(".validation-line")

  if (start) start.classList.add("hidden")
  if (linesWrap) linesWrap.classList.remove("hidden")

  lines.forEach((line, index) => {
    delay(() => {
      line.classList.add("show")
    }, index * 650)
  })

  delay(() => {
    if (next) next.classList.remove("hidden")
  }, lines.length * 650 + 350)
}

/* SCENE 6: FINAL */

function initFinalScene() {
  const open = $("openLetterBtn")
  const letter = $("finalLetter")
  const actions = $("finalActions")

  if (open) open.classList.remove("hidden")
  if (letter) letter.classList.add("hidden")
  if (actions) actions.classList.add("hidden")

  document.querySelectorAll(".final-line").forEach((line) => {
    line.classList.remove("show")
  })
}

function openFinalLetter() {
  const open = $("openLetterBtn")
  const letter = $("finalLetter")
  const actions = $("finalActions")
  const lines = document.querySelectorAll(".final-line")

  if (open) open.classList.add("hidden")

  if (letter) {
    letter.classList.remove("hidden")
    letter.scrollTop = 0
  }

  lines.forEach((line, index) => {
    delay(() => {
      line.classList.add("show")
    }, index * 520)
  })

  delay(() => {
    if (actions) actions.classList.remove("hidden")
    launchConfetti()
  }, lines.length * 520 + 500)
}

function restartWebsite() {
  clearInterval(heartInterval)
  clearSceneTimers()
  initFinalScene()
  goTo("scene-1")
}

/* EVENTS */

document.addEventListener("DOMContentLoaded", () => {
  setRealVh()
  startMascotLoop()
  updateGuide("scene-1")

  const isMobileLike = window.matchMedia(
    "(max-width: 560px), (hover: none), (pointer: coarse)"
  ).matches

  const floatingInterval = isMobileLike ? 1500 : 850
  const initialFloatingItems = isMobileLike ? 7 : 14

  setInterval(spawnFloatingItem, floatingInterval)

  for (let i = 0; i < initialFloatingItems; i++) {
    setTimeout(spawnFloatingItem, i * 140)
  }

  if (!isMobileLike) {
    document.addEventListener("mousemove", (event) => {
      spawnCursorHeart(event.clientX, event.clientY)
    })
  }

  document.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches[0]
      if (!touch) return
      spawnCursorHeart(touch.clientX, touch.clientY)
    },
    { passive: true }
  )

  on("startBtn", "click", startIntro)

  on("nextToRiddleBtn", "click", () => {
    goTo("scene-3", initRiddle)
  })

  on("nextRiddleBtn", "click", nextRiddle)

  const reactionOptions = $("reactionOptions")
  if (reactionOptions) {
    reactionOptions.addEventListener("click", chooseReaction)
  }

  on("toValidationBtn", "click", () => {
    goTo("scene-5", initValidationScene)
  })

  on("startValidationBtn", "click", startValidation)

  on("nextToFinalBtn", "click", () => {
    goTo("scene-6", initFinalScene)
  })

  on("openLetterBtn", "click", openFinalLetter)
  on("celebrateBtn", "click", launchConfetti)
  on("restartBtn", "click", restartWebsite)
})