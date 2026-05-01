const $ = (id) => document.getElementById(id)

function goTo(sceneId) {
  document.querySelectorAll(".scene").forEach((scene) => {
    scene.classList.remove("active")
  })

  const target = $(sceneId)
  if (!target) return

  target.scrollTop = 0
  target.classList.add("active")
}

/* FLOATING BACKGROUND */

const floatingItems = ["♡", "💗", "💕", "cute", "hehe", "🌸", "love", "✧"]

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

/* CURSOR / TAP HEART */

let cursorCooldown = false

function spawnCursorHeart(x, y) {
  if (cursorCooldown) return
  cursorCooldown = true

  const area = $("cursorArea")
  if (!area) return

  const heart = document.createElement("div")
  heart.className = "cursor-heart"
  heart.textContent = ["♡", "💗", "💕", "✦"][Math.floor(Math.random() * 4)]
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

  const colors = ["#ff7fbd", "#e13691", "#ffd1e6", "#ffffff", "#ffb6d9", "#c92d7c"]

  for (let i = 0; i < 100; i++) {
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

/* INTRO MASCOT */

const mascotMoods = [
  { left: "•", right: "•", mouth: "ᴗ", text: "haiii 💗" },
  { left: "◕", right: "◕", mouth: "ω", text: "klik amplop" },
  { left: "˶", right: "˶", mouth: "ᴗ", text: "gemes ya?" },
  { left: "≧", right: "≦", mouth: "o", text: "ayo dong" },
  { left: "♥", right: "♥", mouth: "ᴗ", text: "buat kamu" }
]

let mascotIndex = 0
let mascotTimer = null

function renderMascotMood() {
  const mood = mascotMoods[mascotIndex]

  $("leftEye").textContent = mood.left
  $("rightEye").textContent = mood.right
  $("mascotMouth").textContent = mood.mouth
  $("mascotBubble").textContent = mood.text
}

function startMascotLoop() {
  clearInterval(mascotTimer)
  renderMascotMood()

  mascotTimer = setInterval(() => {
    mascotIndex = (mascotIndex + 1) % mascotMoods.length
    renderMascotMood()
  }, 1300)
}

function openIntroEnvelope() {
  const envelope = $("secretEnvelope")
  envelope.classList.add("open")

  $("mascotBubble").textContent = "yeayy kebuka 💌"

  for (let i = 0; i < 18; i++) {
    setTimeout(spawnFloatingItem, i * 45)
  }

  setTimeout(() => {
    goTo("scene-2")
    initCuteGame()
  }, 1050)
}

/* SCENE 2: HEART GAME */

let cuteScore = 0
let heartInterval = null
const maxCuteScore = 5

function initCuteGame() {
  cuteScore = 0
  $("cuteScore").textContent = cuteScore
  $("nextToAngryBtn").classList.add("hidden")
  $("cuteHint").textContent = "siap-siap yaa..."

  const game = $("heartGame")
  game.querySelectorAll(".catch-heart").forEach((heart) => heart.remove())

  clearInterval(heartInterval)

  setTimeout(() => {
    $("cuteHint").textContent = "klik hati yang muncul 💕"
    spawnCatchHeart()
    heartInterval = setInterval(spawnCatchHeart, 780)
  }, 500)
}

function spawnCatchHeart() {
  const game = $("heartGame")
  if (!game || cuteScore >= maxCuteScore) return

  const heart = document.createElement("button")
  heart.className = "catch-heart"

  const hearts = ["💗", "💕", "💖", "💘", "🌸"]
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)]

  const maxX = game.clientWidth - 52
  const maxY = game.clientHeight - 52

  heart.style.left = Math.max(10, Math.random() * maxX) + "px"
  heart.style.top = Math.max(10, Math.random() * maxY) + "px"

  heart.addEventListener("click", () => {
    cuteScore++
    $("cuteScore").textContent = cuteScore

    heart.textContent = "✨"
    heart.style.pointerEvents = "none"

    setTimeout(() => heart.remove(), 150)

    if (cuteScore >= maxCuteScore) {
      finishCuteGame()
    }
  })

  game.appendChild(heart)

  setTimeout(() => {
    if (heart.parentElement) {
      heart.remove()
    }
  }, 1250)
}

function finishCuteGame() {
  clearInterval(heartInterval)

  const game = $("heartGame")
  game.querySelectorAll(".catch-heart").forEach((heart) => heart.remove())

  $("cuteHint").textContent = "yeay, kamu menang 😚"
  $("nextToAngryBtn").classList.remove("hidden")

  for (let i = 0; i < 15; i++) {
    setTimeout(spawnFloatingItem, i * 45)
  }
}

/* SCENE 3: ANGRY */

let angryLevel = 5

const angryMessages = [
  "hmm... masih ngambek 😤",
  "dikit lagi luluh...",
  "iya iya, mulai adem...",
  "aduh, jangan gemesin gitu...",
  "yaudah deh, maafinnn 😌"
]

function initAngryScene() {
  angryLevel = 5
  updateAngryMeter()

  $("calmBtn").classList.remove("hidden")
  $("runawayBtn").classList.remove("hidden")
  $("nextToSadBtn").classList.add("hidden")

  $("angryText").textContent = "Soalnya kamu terlalu gemes. Sekarang bujuk aku dulu."
  $("runawayBtn").style.transform = "translate(0, 0)"
}

function updateAngryMeter() {
  const percent = (angryLevel / 5) * 100
  $("angryMeterFill").style.width = percent + "%"
}

function calmAngry() {
  if (angryLevel <= 0) return

  angryLevel--
  updateAngryMeter()

  const index = Math.min(5 - angryLevel - 1, angryMessages.length - 1)
  $("angryText").textContent = angryMessages[index]

  if (angryLevel <= 0) {
    $("calmBtn").classList.add("hidden")
    $("runawayBtn").classList.add("hidden")
    $("nextToSadBtn").classList.remove("hidden")
    $("angryText").textContent = "Oke, aku udah gak ngambek 🤍"
  }
}

function moveRunawayButton() {
  const btn = $("runawayBtn")
  if (!btn) return

  const x = Math.floor(Math.random() * 130) - 65
  const y = Math.floor(Math.random() * 70) - 35
  const rotate = Math.floor(Math.random() * 18) - 9

  btn.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`
}

/* SCENE 4: SAD */

function initSadScene() {
  $("sadReveal").classList.add("hidden")
  $("nextToFinalBtn").classList.add("hidden")
  $("hugBtn").classList.remove("hidden")
}

function virtualHug() {
  $("hugBtn").classList.add("hidden")
  $("sadReveal").classList.remove("hidden")

  setTimeout(() => {
    $("nextToFinalBtn").classList.remove("hidden")
  }, 500)

  for (let i = 0; i < 12; i++) {
    setTimeout(spawnFloatingItem, i * 60)
  }
}

/* SCENE 5: FINAL */

const finalLetter = `Hai kamu 💗

Aku bikin ini bukan biar terlihat keren.

Aku cuma pengen kamu tahu,
hadir kamu itu bikin hariku lebih manis.

Aku suka caramu bikin aku senyum.
Aku suka caramu muncul di pikiranku
tanpa diminta.

Mungkin aku sering bercanda,
tapi bagian ini serius.

Aku suka kamu.

Sederhana aja.
Nggak ribet.
Nggak dibuat-buat.

Kalau setelah baca ini kamu senyum,
berarti misi kecilku berhasil. ✨`

let typingTimer = null
let isTyping = false

function initFinalScene() {
  $("letterBox").classList.add("hidden")
  $("typedLetter").textContent = ""
  $("finalActions").classList.add("hidden")
  $("openLetterBtn").classList.remove("hidden")

  clearInterval(typingTimer)
  isTyping = false
}

function openFinalLetter() {
  if (isTyping) return

  isTyping = true
  $("openLetterBtn").classList.add("hidden")
  $("letterBox").classList.remove("hidden")

  let index = 0
  $("typedLetter").textContent = ""

  typingTimer = setInterval(() => {
    $("typedLetter").textContent += finalLetter[index]
    index++

    if (index >= finalLetter.length) {
      clearInterval(typingTimer)
      isTyping = false

      setTimeout(() => {
        $("finalActions").classList.remove("hidden")
        launchConfetti()
      }, 400)
    }
  }, 23)
}

function restartWebsite() {
  clearInterval(heartInterval)
  clearInterval(typingTimer)

  const envelope = $("secretEnvelope")
  if (envelope) envelope.classList.remove("open")

  goTo("scene-1")
}

/* EVENTS */

document.addEventListener("DOMContentLoaded", () => {
  goTo("scene-1")
  startMascotLoop()

  setInterval(spawnFloatingItem, 800)

  for (let i = 0; i < 12; i++) {
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

  $("startBtn").addEventListener("click", openIntroEnvelope)

  $("nextToAngryBtn").addEventListener("click", () => {
    goTo("scene-3")
    initAngryScene()
  })

  $("calmBtn").addEventListener("click", calmAngry)

  $("runawayBtn").addEventListener("mouseenter", moveRunawayButton)
  $("runawayBtn").addEventListener("touchstart", moveRunawayButton)
  $("runawayBtn").addEventListener("click", () => {
    moveRunawayButton()
    $("angryText").textContent = "ihh kok gitu, bujuk yang bener dong 😝"
  })

  $("nextToSadBtn").addEventListener("click", () => {
    goTo("scene-4")
    initSadScene()
  })

  $("hugBtn").addEventListener("click", virtualHug)

  $("nextToFinalBtn").addEventListener("click", () => {
    goTo("scene-5")
    initFinalScene()
  })

  $("openLetterBtn").addEventListener("click", openFinalLetter)
  $("celebrateBtn").addEventListener("click", launchConfetti)
  $("restartBtn").addEventListener("click", restartWebsite)
})