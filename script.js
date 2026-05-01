const $ = (id) => document.getElementById(id)

let currentScene = "scene-1"
let isSwitching = false
let heartInterval = null
let sceneTimers = []
let dinoMoodInterval = null

function setAppHeight() {
  document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`)
}

function safeTimeout(callback, delay) {
  const timer = setTimeout(callback, delay)
  sceneTimers.push(timer)
  return timer
}

function clearSceneTimers() {
  sceneTimers.forEach((timer) => clearTimeout(timer))
  sceneTimers = []

  clearInterval(heartInterval)
  heartInterval = null
}

function goTo(sceneId, callback) {
  if (isSwitching || sceneId === currentScene) return

  isSwitching = true
  clearSceneTimers()

  const current = $(currentScene)
  const next = $(sceneId)

  if (!next) {
    isSwitching = false
    return
  }

  if (current) {
    current.classList.remove("active")
  }

  requestAnimationFrame(() => {
    next.classList.add("active")

    const card = next.querySelector(".phone-card")
    if (card) card.scrollTop = 0

    currentScene = sceneId
    updateGuide(sceneId)

    safeTimeout(() => {
      isSwitching = false
      if (typeof callback === "function") callback()
    }, 440)
  })
}

function updateGuide(sceneId) {
  const texts = {
    "scene-1": "aku nemenin 💛",
    "scene-2": "tangkap hatinya 💘",
    "scene-3": "siap-siap baper 😚",
    "scene-4": "ngambeknya lucu aja 😤",
    "scene-5": "pelan-pelan dulu 🌙",
    "scene-6": "akhirnya sampai 💌"
  }

  const bubble = $("guideBubble")
  if (bubble) bubble.textContent = texts[sceneId] || "aku di sini 💛"
}

/* BACKGROUND */

const floatingItems = ["♡", "💗", "💕", "hehe", "cute", "love", "🌸", "baper", "gemes", "✧"]

function spawnFloatingItem() {
  const area = $("floatLayer")
  if (!area) return

  const item = document.createElement("div")
  item.className = "float-item"
  item.textContent = floatingItems[Math.floor(Math.random() * floatingItems.length)]
  item.style.left = Math.random() * 100 + "vw"
  item.style.fontSize = 11 + Math.random() * 11 + "px"
  item.style.animationDuration = 7 + Math.random() * 7 + "s"

  area.appendChild(item)

  setTimeout(() => item.remove(), 15000)
}

function spawnTapHeart(x, y) {
  const area = $("tapLayer")
  if (!area) return

  const heart = document.createElement("div")
  heart.className = "tap-heart"
  heart.textContent = ["♡", "💗", "💕", "🌸", "✦"][Math.floor(Math.random() * 5)]
  heart.style.left = x + "px"
  heart.style.top = y + "px"

  area.appendChild(heart)

  setTimeout(() => heart.remove(), 900)
}

function launchConfetti() {
  const area = $("confettiLayer")
  if (!area) return

  const colors = ["#ff7fbd", "#e13691", "#ffd1e6", "#ffffff", "#ffb6d9", "#ffe58a", "#cfa8ff"]

  for (let i = 0; i < 110; i++) {
    const item = document.createElement("div")
    const size = 5 + Math.random() * 7

    item.className = "confetti"
    item.style.left = Math.random() * 100 + "vw"
    item.style.width = size + "px"
    item.style.height = size + "px"
    item.style.background = colors[Math.floor(Math.random() * colors.length)]
    item.style.animationDuration = 2.2 + Math.random() * 2.8 + "s"
    item.style.animationDelay = Math.random() * 0.6 + "s"
    item.style.setProperty("--move-x", (Math.random() - 0.5) * 170 + "px")

    area.appendChild(item)

    setTimeout(() => item.remove(), 6000)
  }
}

/* MASCOT */

const mascotTexts = ["haiii 💗", "klik amplop", "jangan malu", "ayo dong", "gemes ya?"]

let mascotIndex = 0

function startMascotLoop() {
  clearInterval(dinoMoodInterval)

  dinoMoodInterval = setInterval(() => {
    mascotIndex = (mascotIndex + 1) % mascotTexts.length

    const bubble = $("mascotBubble")
    if (bubble) bubble.textContent = mascotTexts[mascotIndex]
  }, 1300)
}

/* SCENE 1 */

function openEnvelope() {
  const envelope = $("envelope")
  const bubble = $("mascotBubble")

  if (envelope) envelope.classList.add("open")
  if (bubble) bubble.textContent = "yeayy kebuka 💌"

  for (let i = 0; i < 16; i++) {
    setTimeout(spawnFloatingItem, i * 45)
  }

  setTimeout(() => {
    goTo("scene-2", initHeartGame)
  }, 850)
}

/* SCENE 2 - HEART GAME */

let heartScore = 0
const maxHeartScore = 5

function initHeartGame() {
  heartScore = 0

  const score = $("heartScore")
  const hint = $("heartHint")
  const button = $("toRiddleBtn")
  const game = $("heartGame")

  if (score) score.textContent = "0"
  if (hint) hint.textContent = "siap-siap yaa..."
  if (button) button.classList.add("hidden")
  if (game) game.querySelectorAll(".catch-heart").forEach((heart) => heart.remove())

  safeTimeout(() => {
    if ($("heartHint")) $("heartHint").textContent = "klik hati yang muncul 💕"
    spawnCatchHeart()
    heartInterval = setInterval(spawnCatchHeart, 780)
  }, 480)
}

function spawnCatchHeart() {
  const game = $("heartGame")
  if (!game || heartScore >= maxHeartScore) return

  const heart = document.createElement("button")
  heart.className = "catch-heart"
  heart.type = "button"
  heart.textContent = ["💗", "💕", "💖", "💘", "🌸"][Math.floor(Math.random() * 5)]

  const maxX = Math.max(10, game.clientWidth - 50)
  const maxY = Math.max(10, game.clientHeight - 50)

  heart.style.left = Math.max(10, Math.random() * maxX) + "px"
  heart.style.top = Math.max(10, Math.random() * maxY) + "px"

  heart.addEventListener("click", () => {
    heartScore++

    if ($("heartScore")) $("heartScore").textContent = heartScore

    heart.textContent = "✨"
    heart.style.pointerEvents = "none"

    setTimeout(() => heart.remove(), 120)

    if (heartScore >= maxHeartScore) {
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
  heartInterval = null

  const game = $("heartGame")
  if (game) game.querySelectorAll(".catch-heart").forEach((heart) => heart.remove())

  if ($("heartHint")) $("heartHint").textContent = "yeay, hatinya ketangkep semua 😚"
  if ($("toRiddleBtn")) $("toRiddleBtn").classList.remove("hidden")

  for (let i = 0; i < 16; i++) {
    setTimeout(spawnFloatingItem, i * 45)
  }
}

/* SCENE 3 - RIDDLE */

const riddles = [
  {
    question: "Kalau aku disuruh pilih tempat paling nyaman, aku pilih...",
    options: ["Kasur empuk", "Rumah yang tenang", "Kamu", "Kafe lucu"],
    correct: 2,
    emoji: "🏡",
    text: "Iya, kamu. Soalnya kadang rumah bukan tempat, tapi seseorang yang bikin hati ngerasa aman."
  },
  {
    question: "Kenapa aku bikin website kecil ini?",
    options: ["Karena gabut", "Karena kamu spesial", "Karena disuruh dino", "Karena internet lancar"],
    correct: 1,
    emoji: "💌",
    text: "Benar. Karena kamu terlalu spesial buat cuma dikasih chat biasa."
  },
  {
    question: "Kalau kamu senyum, efeknya ke aku apa?",
    options: ["Biasa aja", "Loading sebentar", "Ikut senyum tanpa sadar", "Error 404"],
    correct: 2,
    emoji: "😳",
    text: "Benar. Senyum kamu tuh bahaya, bisa bikin aku lupa pura-pura biasa aja."
  }
]

let riddleIndex = 0
let wrongCount = 0

function initRiddle() {
  riddleIndex = 0
  wrongCount = 0
  showRiddle()
}

function showRiddle() {
  const riddle = riddles[riddleIndex]
  const options = $("riddleOptions")

  if ($("riddleCount")) $("riddleCount").textContent = `gombalan ${riddleIndex + 1} dari ${riddles.length}`
  if ($("riddleQuestion")) $("riddleQuestion").textContent = riddle.question
  if ($("riddleResult")) $("riddleResult").classList.add("hidden")
  if ($("nextRiddleBtn")) $("nextRiddleBtn").classList.add("hidden")

  if (!options) return

  options.innerHTML = ""

  riddle.options.forEach((text, index) => {
    const button = document.createElement("button")
    button.className = "riddle-option"
    button.type = "button"
    button.textContent = text
    button.addEventListener("click", () => chooseRiddle(index, button))
    options.appendChild(button)
  })
}

function chooseRiddle(index, selectedButton) {
  const riddle = riddles[riddleIndex]
  const buttons = document.querySelectorAll(".riddle-option")

  buttons.forEach((button) => {
    button.disabled = true
  })

  if ($("riddleResult")) $("riddleResult").classList.remove("hidden")

  if (index === riddle.correct) {
    selectedButton.classList.add("correct")

    if ($("riddleEmoji")) $("riddleEmoji").textContent = riddle.emoji
    if ($("riddleText")) $("riddleText").textContent = riddle.text

    const nextButton = $("nextRiddleBtn")
    if (nextButton) {
      nextButton.classList.remove("hidden")
      nextButton.textContent =
        riddleIndex < riddles.length - 1
          ? "Gombalan berikutnya"
          : "Lanjut, jangan pura-pura nggak baper"
    }

    return
  }

  wrongCount++
  selectedButton.classList.add("wrong")

  if ($("riddleEmoji")) $("riddleEmoji").textContent = "😚"
  if ($("riddleText")) {
    $("riddleText").textContent =
      wrongCount >= 2
        ? "Clue-nya: pilih jawaban yang paling bikin pipi panas."
        : "Hmm hampir, tapi coba pikir pakai hati, jangan pakai logika dulu."
  }

  safeTimeout(() => {
    buttons.forEach((button) => {
      button.disabled = false
      button.classList.remove("wrong")
    })
  }, 780)
}

function nextRiddle() {
  riddleIndex++
  wrongCount = 0

  if (riddleIndex < riddles.length) {
    showRiddle()
  } else {
    goTo("scene-4", initMood)
  }
}

/* SCENE 4 - MOOD */

function initMood() {
  if ($("moodOptions")) $("moodOptions").classList.remove("hidden")
  if ($("poutBox")) $("poutBox").classList.add("hidden")
  if ($("toValidationBtn")) $("toValidationBtn").classList.add("hidden")
  if ($("poutFill")) $("poutFill").style.width = "100%"
  if ($("moodIntro")) {
    $("moodIntro").textContent = "Pilih alasan ngambek kamu. Tapi ngambeknya yang lucu aja ya."
  }
}

function chooseMood(event) {
  const button = event.target.closest(".choice-button")
  if (!button) return

  const messages = {
    baper: "Aduh, kamu mulai baper ya? Nggak apa-apa. Baper yang ini aman kok.",
    jail: "Iya, websitenya memang jail. Tapi jailnya sayang-sayang, bukan jahat.",
    senyum: "Ketahuan senyum sendiri. Lucu banget sih, jadi aku ikut senyum juga."
  }

  if ($("moodOptions")) $("moodOptions").classList.add("hidden")
  if ($("poutBox")) $("poutBox").classList.remove("hidden")
  if ($("toValidationBtn")) $("toValidationBtn").classList.remove("hidden")
  if ($("moodIntro")) $("moodIntro").textContent = "Oke, sekarang kamu boleh ngambek manja."
  if ($("poutText")) $("poutText").textContent = messages[button.dataset.mood] || messages.baper

  safeTimeout(() => {
    if ($("poutFill")) $("poutFill").style.width = "18%"
  }, 180)
}

/* SCENE 5 - VALIDATION */

function initValidation() {
  if ($("startValidationBtn")) $("startValidationBtn").classList.remove("hidden")
  if ($("validationLines")) $("validationLines").classList.add("hidden")
  if ($("toFinalBtn")) $("toFinalBtn").classList.add("hidden")

  document.querySelectorAll(".validation-line").forEach((line) => {
    line.classList.remove("show")
  })
}

function startValidation() {
  if ($("startValidationBtn")) $("startValidationBtn").classList.add("hidden")
  if ($("validationLines")) $("validationLines").classList.remove("hidden")

  const lines = document.querySelectorAll(".validation-line")

  lines.forEach((line, index) => {
    safeTimeout(() => {
      line.classList.add("show")
    }, index * 520)
  })

  safeTimeout(() => {
    if ($("toFinalBtn")) $("toFinalBtn").classList.remove("hidden")
  }, lines.length * 520 + 260)
}

/* SCENE 6 - FINAL */

function initFinal() {
  if ($("openLetterBtn")) $("openLetterBtn").classList.remove("hidden")
  if ($("letterBox")) $("letterBox").classList.add("hidden")
  if ($("finalActions")) $("finalActions").classList.add("hidden")

  document.querySelectorAll(".letter-line").forEach((line) => {
    line.classList.remove("show")
  })
}

function openLetter() {
  if ($("openLetterBtn")) $("openLetterBtn").classList.add("hidden")
  if ($("letterBox")) $("letterBox").classList.remove("hidden")

  const lines = document.querySelectorAll(".letter-line")

  lines.forEach((line, index) => {
    safeTimeout(() => {
      line.classList.add("show")
    }, index * 420)
  })

  safeTimeout(() => {
    if ($("finalActions")) $("finalActions").classList.remove("hidden")
    launchConfetti()
  }, lines.length * 420 + 420)
}

function restart() {
  clearSceneTimers()

  const envelope = $("envelope")
  if (envelope) envelope.classList.remove("open")

  goTo("scene-1")
}

/* EVENTS */

document.addEventListener("DOMContentLoaded", () => {
  setAppHeight()
  updateGuide("scene-1")
  startMascotLoop()

  window.addEventListener("resize", setAppHeight)
  window.addEventListener("orientationchange", () => {
    setTimeout(setAppHeight, 250)
  })

  setInterval(spawnFloatingItem, 980)

  for (let i = 0; i < 12; i++) {
    setTimeout(spawnFloatingItem, i * 140)
  }

  document.addEventListener("pointerdown", (event) => {
    spawnTapHeart(event.clientX, event.clientY)
  })

  $("startBtn").addEventListener("click", openEnvelope)

  $("toRiddleBtn").addEventListener("click", () => {
    goTo("scene-3", initRiddle)
  })

  $("nextRiddleBtn").addEventListener("click", nextRiddle)

  $("moodOptions").addEventListener("click", chooseMood)

  $("toValidationBtn").addEventListener("click", () => {
    goTo("scene-5", initValidation)
  })

  $("startValidationBtn").addEventListener("click", startValidation)

  $("toFinalBtn").addEventListener("click", () => {
    goTo("scene-6", initFinal)
  })

  $("openLetterBtn").addEventListener("click", openLetter)
  $("celebrateBtn").addEventListener("click", launchConfetti)
  $("restartBtn").addEventListener("click", restart)
})