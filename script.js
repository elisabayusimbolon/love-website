const $ = (id) => document.getElementById(id)

const sceneGuide = {
  "scene-1": { text: "aku nemenin 💛", mood: "pink" },
  "scene-2": { text: "tangkap hatinya 💘", mood: "peach" },
  "scene-3": { text: "siap-siap baper 😚", mood: "lilac" },
  "scene-4": { text: "jangan pura-pura biasa 😳", mood: "yellow" },
  "scene-5": { text: "pelan-pelan dulu 🌙", mood: "mint" },
  "scene-6": { text: "akhirnya sampai sini 💌", mood: "pink" }
}

let activeScene = "scene-1"
let transitionLock = false

function setMascotMood(element, mood) {
  if (!element) return

  element.classList.remove(
    "mood-pink",
    "mood-peach",
    "mood-yellow",
    "mood-lilac",
    "mood-mint"
  )

  element.classList.add(`mood-${mood}`)
}

function updateGuide(sceneId) {
  const data = sceneGuide[sceneId] || sceneGuide["scene-1"]

  if ($("guideBubble")) {
    $("guideBubble").textContent = data.text
  }

  setMascotMood($("guideMascot"), data.mood)
}

function goTo(sceneId) {
  if (transitionLock || activeScene === sceneId) return

  transitionLock = true

  document.querySelectorAll(".scene").forEach((scene) => {
    scene.classList.remove("active")
  })

  const target = $(sceneId)
  if (!target) return

  target.classList.add("active")
  activeScene = sceneId
  updateGuide(sceneId)

  const card = target.querySelector(".cute-card")
  if (card) {
    card.scrollTop = 0
  }

  setTimeout(() => {
    transitionLock = false
  }, 460)
}

function on(id, event, handler) {
  const element = $(id)
  if (!element) return
  element.addEventListener(event, handler)
}

/* floating background */

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
  item.style.animationDuration = 8 + Math.random() * 8 + "s"

  area.appendChild(item)

  setTimeout(() => item.remove(), 17000)
}

/* cursor heart */

let cursorCooldown = false

function spawnCursorHeart(x, y) {
  if (cursorCooldown) return
  cursorCooldown = true

  const area = $("cursorArea")
  if (!area) return

  const heart = document.createElement("div")
  heart.className = "cursor-heart"
  heart.textContent = ["💗", "💕", "🌸", "♡"][Math.floor(Math.random() * 4)]
  heart.style.left = `${x}px`
  heart.style.top = `${y}px`

  area.appendChild(heart)

  setTimeout(() => {
    cursorCooldown = false
  }, 120)

  setTimeout(() => heart.remove(), 900)
}

/* confetti */

function launchConfetti() {
  const area = $("confettiArea")
  if (!area) return

  const colors = ["#ff78b9", "#ffd1e8", "#ffffff", "#ffc94e", "#d9a9ff"]

  for (let i = 0; i < 44; i++) {
    const item = document.createElement("div")
    item.className = "confetti"

    const size = 7 + Math.random() * 8

    item.style.left = Math.random() * 100 + "vw"
    item.style.width = size + "px"
    item.style.height = size + "px"
    item.style.background = colors[Math.floor(Math.random() * colors.length)]
    item.style.animationDuration = 2.8 + Math.random() * 2.8 + "s"
    item.style.animationDelay = Math.random() * 0.5 + "s"
    item.style.setProperty("--move-x", (Math.random() - 0.5) * 180 + "px")

    area.appendChild(item)

    setTimeout(() => item.remove(), 6500)
  }
}

/* intro mascot */

const heroMoods = [
  { mood: "pink", face: "•ᴗ•", bubble: "gemes ya?" },
  { mood: "peach", face: "≧ᴗ≦", bubble: "klik aku" },
  { mood: "yellow", face: "♥ᴗ♥", bubble: "jangan malu" },
  { mood: "lilac", face: "˶ᵔᵕᵔ˶", bubble: "ayo dong" },
  { mood: "mint", face: "◕ᴗ◕", bubble: "siap yaa?" }
]

let heroMoodIndex = 0
let heroMoodTimer = null

function renderHeroMood() {
  const data = heroMoods[heroMoodIndex]

  setMascotMood($("heroMascot"), data.mood)

  if ($("heroFace")) {
    $("heroFace").textContent = data.face
  }

  if ($("mascotBubble")) {
    $("mascotBubble").textContent = data.bubble
  }
}

function startHeroMoodLoop() {
  clearInterval(heroMoodTimer)

  renderHeroMood()

  heroMoodTimer = setInterval(() => {
    heroMoodIndex = (heroMoodIndex + 1) % heroMoods.length
    renderHeroMood()
  }, 1200)
}

function startIntro() {
  if ($("mascotBubble")) {
    $("mascotBubble").textContent = "yeayy mulai 💗"
  }

  setMascotMood($("heroMascot"), "yellow")

  if ($("heroFace")) {
    $("heroFace").textContent = "≧ᴗ≦"
  }

  for (let i = 0; i < 16; i++) {
    setTimeout(spawnFloatingItem, i * 45)
  }

  setTimeout(() => {
    goTo("scene-2")
    initHeartGame()
  }, 650)
}

/* scene 2 */

let cuteScore = 0
let heartInterval = null
const maxCuteScore = 5

function initHeartGame() {
  cuteScore = 0

  if ($("cuteScore")) $("cuteScore").textContent = cuteScore
  if ($("nextToRiddleBtn")) $("nextToRiddleBtn").classList.add("hidden")
  if ($("cuteHint")) $("cuteHint").textContent = "klik hati yang muncul 💕"

  const game = $("heartGame")
  if (game) {
    game.querySelectorAll(".catch-heart").forEach((heart) => heart.remove())
  }

  clearInterval(heartInterval)

  setTimeout(() => {
    spawnCatchHeart()
    heartInterval = setInterval(spawnCatchHeart, 780)
  }, 300)
}

function spawnCatchHeart() {
  const game = $("heartGame")
  if (!game || cuteScore >= maxCuteScore) return

  const heart = document.createElement("button")
  heart.className = "catch-heart"
  heart.type = "button"
  heart.textContent = ["💗", "💕", "💖", "💘", "🌸"][Math.floor(Math.random() * 5)]

  const maxX = Math.max(0, game.clientWidth - 58)
  const maxY = Math.max(0, game.clientHeight - 58)

  heart.style.left = Math.max(8, Math.random() * maxX) + "px"
  heart.style.top = Math.max(8, Math.random() * maxY) + "px"

  heart.addEventListener("click", () => {
    cuteScore++
    if ($("cuteScore")) $("cuteScore").textContent = cuteScore

    heart.textContent = "✨"
    heart.style.pointerEvents = "none"

    setTimeout(() => heart.remove(), 130)

    if (cuteScore >= maxCuteScore) {
      finishHeartGame()
    }
  })

  game.appendChild(heart)

  setTimeout(() => {
    if (heart.parentElement) heart.remove()
  }, 1300)
}

function finishHeartGame() {
  clearInterval(heartInterval)

  const game = $("heartGame")
  if (game) {
    game.querySelectorAll(".catch-heart").forEach((heart) => heart.remove())
  }

  if ($("cuteHint")) {
    $("cuteHint").textContent = "yeay, hatinya ketangkep semua 😚"
  }

  if ($("nextToRiddleBtn")) {
    $("nextToRiddleBtn").classList.remove("hidden")
  }

  for (let i = 0; i < 18; i++) {
    setTimeout(spawnFloatingItem, i * 40)
  }
}

/* scene 3 */

const riddles = [
  {
    question: "Kalau aku disuruh pilih tempat paling nyaman, aku pilih...",
    options: [
      "Kasur empuk",
      "Rumah yang tenang",
      "Kamu",
      "Kafe lucu"
    ],
    correctIndex: 2,
    emoji: "🏡",
    correctText:
      "Iya, kamu. Soalnya nyaman itu bukan selalu tempat. Kadang nyaman itu seseorang yang bikin hati tenang.",
    wrongReplies: [
      "Kasur emang empuk, tapi kalau rebahan pun tetap aja pikiranku larinya ke kamu 😚",
      "Rumah yang tenang memang enak, tapi tenangnya beda kalau ada kamu di dalam ceritanya.",
      "",
      "Kafe lucu boleh, tapi tempat favoritku tetap dekat kamu. Sederhana, tapi bikin betah."
    ]
  },
  {
    question: "Kalau aku jadi notifikasi di HP kamu, aku pengennya muncul pas...",
    options: [
      "Kamu lagi bete",
      "Kamu lagi senyum",
      "Kamu lagi kangen",
      "Setiap kamu butuh alasan buat senyum"
    ],
    correctIndex: 3,
    emoji: "📱",
    correctText:
      "Nah itu. Aku pengen jadi alasan kecil yang muncul pelan-pelan, terus bikin kamu senyum tanpa sadar.",
    wrongReplies: [
      "Kalau kamu lagi bete, aku tetap mau muncul. Tapi bukan buat ganggu, cuma buat bilang: sini, senyum dikit.",
      "Kalau kamu lagi senyum, aku pasti ikut senyum juga. Tapi ada jawaban yang lebih aku banget.",
      "Kalau kamu lagi kangen, bahaya sih. Nanti aku juga ikut kangen beneran.",
      ""
    ]
  },
  {
    question: "Kalau senyum kamu punya efek samping, efeknya ke aku adalah...",
    options: [
      "Biasa aja",
      "Ikut senyum tanpa sadar",
      "Jadi lupa pura-pura cuek",
      "Nomor 2 dan 3 benar"
    ],
    correctIndex: 3,
    emoji: "😳",
    correctText:
      "Benar. Senyum kamu tuh curang. Bisa bikin aku senyum balik, terus lupa kalau tadinya mau pura-pura biasa aja.",
    wrongReplies: [
      "Biasa aja? Hmm, itu jawaban paling bohong. Senyum kamu nggak sesederhana itu.",
      "Iya, aku memang ikut senyum. Tapi efeknya belum lengkap, masih ada satu rahasia lagi.",
      "Nah, ini juga benar. Tapi ada jawaban yang lebih jujur lagi.",
      ""
    ]
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

  if ($("riddleCounter")) {
    $("riddleCounter").textContent = `gombalan ${riddleIndex + 1} dari ${riddles.length}`
  }

  if ($("riddleQuestion")) {
    $("riddleQuestion").textContent = riddle.question
  }

  if ($("riddleFeedback")) $("riddleFeedback").classList.add("hidden")
  if ($("nextRiddleBtn")) $("nextRiddleBtn").classList.add("hidden")

  const options = $("riddleOptions")
  if (!options) return

  options.innerHTML = ""

  riddle.options.forEach((option, index) => {
    const button = document.createElement("button")
    button.className = "riddle-option"
    button.type = "button"
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

  if ($("riddleFeedback")) $("riddleFeedback").classList.remove("hidden")

  if (index === riddle.correctIndex) {
    button.classList.add("correct")

    if ($("feedbackEmoji")) $("feedbackEmoji").textContent = riddle.emoji
    if ($("feedbackText")) $("feedbackText").textContent = riddle.correctText

    if ($("nextRiddleBtn")) {
      $("nextRiddleBtn").classList.remove("hidden")
      $("nextRiddleBtn").textContent =
        riddleIndex < riddles.length - 1
          ? "Gombalan berikutnya"
          : "Lanjut, jangan pura-pura nggak salting"
    }

    for (let i = 0; i < 12; i++) {
      setTimeout(spawnFloatingItem, i * 50)
    }

    return
  }

  riddleWrong++
  button.classList.add("wrong")

  if ($("feedbackEmoji")) {
    $("feedbackEmoji").textContent = riddleWrong >= 2 ? "🤭" : "😚"
  }

  if ($("feedbackText")) {
    $("feedbackText").textContent =
      riddle.wrongReplies[index] ||
      "Hampir, tapi coba pilih yang paling bikin pipi panas."
  }

  setTimeout(() => {
    buttons.forEach((item) => {
      item.disabled = false
      item.classList.remove("wrong")
    })
  }, 850)
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

/* scene 4 */

const moodReplies = {
  baper: {
    emoji: "😳",
    text:
      "Ketahuan. Tapi tenang, bapernya aman. Aku nggak bakal ngeledekin lama-lama kok. Paling cuma senyum dikit.",
    bubble: "salting detected"
  },
  senyum: {
    emoji: "🙈",
    text:
      "Aku tahu. Senyum kecil yang kamu tahan itu biasanya paling lucu. Jadi sekarang aku pura-pura nggak lihat yaa.",
    bubble: "senyumnya ketahuan"
  },
  jail: {
    emoji: "😤",
    text:
      "Iya, websitenya jail. Tapi jailnya bukan buat ngeselin. Cuma biar kamu tinggal sebentar lebih lama di sini.",
    bubble: "ngambeknya lucu"
  }
}

function initMoodScene() {
  if ($("moodOptions")) $("moodOptions").classList.remove("hidden")
  if ($("poutBox")) $("poutBox").classList.add("hidden")
  if ($("toValidationBtn")) $("toValidationBtn").classList.add("hidden")
  if ($("poutMeterFill")) $("poutMeterFill").style.width = "100%"

  if ($("moodText")) {
    $("moodText").textContent =
      "Habis teka-teki tadi, jangan pura-pura biasa aja. Pilih yang paling kamu rasain."
  }
}

function chooseMood(event) {
  const button = event.target.closest(".mood-btn")
  if (!button) return

  const mood = button.dataset.mood
  const data = moodReplies[mood] || moodReplies.baper

  if ($("moodOptions")) $("moodOptions").classList.add("hidden")
  if ($("poutBox")) $("poutBox").classList.remove("hidden")
  if ($("toValidationBtn")) $("toValidationBtn").classList.remove("hidden")

  if ($("moodText")) {
    $("moodText").textContent =
      "Oke, aku ngerti. Sekarang aku bujuk pelan-pelan ya."
  }

  if ($("poutEmoji")) $("poutEmoji").textContent = data.emoji
  if ($("poutMessage")) $("poutMessage").textContent = data.text

  if ($("guideBubble")) $("guideBubble").textContent = data.bubble

  setMascotMood($("guideMascot"), "yellow")

  setTimeout(() => {
    if ($("poutMeterFill")) $("poutMeterFill").style.width = "24%"
  }, 260)

  for (let i = 0; i < 12; i++) {
    setTimeout(spawnFloatingItem, i * 60)
  }
}

/* scene 5 */

function initValidationScene() {
  if ($("startValidationBtn")) $("startValidationBtn").classList.remove("hidden")
  if ($("validationLines")) $("validationLines").classList.add("hidden")
  if ($("nextToFinalBtn")) $("nextToFinalBtn").classList.add("hidden")

  document.querySelectorAll(".validation-line").forEach((line) => {
    line.classList.remove("show")
  })
}

function startValidation() {
  if ($("startValidationBtn")) $("startValidationBtn").classList.add("hidden")
  if ($("validationLines")) $("validationLines").classList.remove("hidden")

  const lines = document.querySelectorAll(".validation-line")

  lines.forEach((line, index) => {
    setTimeout(() => {
      line.classList.add("show")
    }, index * 620)
  })

  setTimeout(() => {
    if ($("nextToFinalBtn")) $("nextToFinalBtn").classList.remove("hidden")
  }, lines.length * 620 + 260)
}

/* scene 6 */

function initFinalScene() {
  if ($("openLetterBtn")) $("openLetterBtn").classList.remove("hidden")
  if ($("finalLetter")) $("finalLetter").classList.add("hidden")
  if ($("finalActions")) $("finalActions").classList.add("hidden")

  document.querySelectorAll(".final-line").forEach((line) => {
    line.classList.remove("show")
  })
}

function openFinalLetter() {
  if ($("openLetterBtn")) $("openLetterBtn").classList.add("hidden")
  if ($("finalLetter")) $("finalLetter").classList.remove("hidden")

  const lines = document.querySelectorAll(".final-line")

  lines.forEach((line, index) => {
    setTimeout(() => {
      line.classList.add("show")
    }, index * 520)
  })

  setTimeout(() => {
    if ($("finalActions")) $("finalActions").classList.remove("hidden")
    launchConfetti()
  }, lines.length * 520 + 500)
}

function restartWebsite() {
  clearInterval(heartInterval)
  initFinalScene()

  goTo("scene-1")
  startHeroMoodLoop()
}

/* events */

document.addEventListener("DOMContentLoaded", () => {
  activeScene = "scene-1"
  updateGuide("scene-1")
  startHeroMoodLoop()

  setInterval(spawnFloatingItem, 900)

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
  }, { passive: true })

  on("startBtn", "click", startIntro)

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