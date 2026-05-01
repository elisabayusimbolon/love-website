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

/* BACKGROUND FLOATING */

const floatingItems = [
  "♡",
  "✧",
  "💕",
  "gemes",
  "hehe",
  "miss u",
  "🌸",
  "cute",
  "love",
  "💗"
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

/* CONFETTI */

function launchConfetti() {
  const area = $("confettiArea")
  if (!area) return

  const colors = ["#ff7fbd", "#e13691", "#ffd1e6", "#ffffff", "#ffb6d9", "#c92d7c"]

  for (let i = 0; i < 110; i++) {
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

/* SCENE 2: CUTE GAME */

let cuteScore = 0
let heartInterval = null
const maxCuteScore = 5

function initCuteGame() {
  cuteScore = 0
  $("cuteScore").textContent = cuteScore
  $("nextToAngryBtn").classList.add("hidden")
  $("cuteHint").textContent = "Hatinya sebentar lagi muncul... siap-siap yaa."

  const game = $("heartGame")
  game.querySelectorAll(".catch-heart").forEach((heart) => heart.remove())

  clearInterval(heartInterval)

  setTimeout(() => {
    $("cuteHint").textContent = "Klik hati yang muncul. Jangan kasih kabur 😤💕"
    spawnCatchHeart()
    heartInterval = setInterval(spawnCatchHeart, 820)
  }, 600)
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

    setTimeout(() => heart.remove(), 180)

    if (cuteScore >= maxCuteScore) {
      finishCuteGame()
    }
  })

  game.appendChild(heart)

  setTimeout(() => {
    if (heart.parentElement) {
      heart.remove()
    }
  }, 1350)
}

function finishCuteGame() {
  clearInterval(heartInterval)

  const game = $("heartGame")
  game.querySelectorAll(".catch-heart").forEach((heart) => heart.remove())

  $("cuteHint").textContent =
    "Oke, kamu berhasil. Agak nyebelin sih karena jago banget. Tapi yaudah, boleh lanjut 😌"
  $("nextToAngryBtn").classList.remove("hidden")

  launchMiniSparkles()
}

function launchMiniSparkles() {
  for (let i = 0; i < 20; i++) {
    setTimeout(spawnFloatingItem, i * 45)
  }
}

/* SCENE 3: ANGRY */

let angryLevel = 5

const angryMessages = [
  "Hmm... masih ngambek. Bujuk lagi dong, jangan setengah-setengah 😤",
  "Oke, dikit lagi turun. Tapi aku masih pura-pura kesel nih.",
  "Sebenernya udah agak luluh, tapi gengsi dulu boleh kan?",
  "Aduh, jangan lucu-lucu. Nanti aku beneran maafin.",
  "Yaudah deh... ngambeknya kalah sama gemesnya kamu."
]

function initAngryScene() {
  angryLevel = 5
  updateAngryMeter()

  $("calmBtn").classList.remove("hidden")
  $("runawayBtn").classList.remove("hidden")
  $("nextToSadBtn").classList.add("hidden")

  $("angryText").textContent =
    "Soalnya kamu terlalu lucu. Kan jadi nyebelin, aku kepikiran terus. Sekarang tugas kamu: bujuk aku sampai ngambeknya turun."

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

  const messageIndex = Math.min(5 - angryLevel - 1, angryMessages.length - 1)
  $("angryText").textContent = angryMessages[messageIndex]

  if (angryLevel <= 0) {
    $("calmBtn").classList.add("hidden")
    $("runawayBtn").classList.add("hidden")
    $("nextToSadBtn").classList.remove("hidden")
    $("angryText").textContent =
      "Oke, aku udah nggak ngambek. Tapi habis ini jangan ketawa dulu ya, soalnya bagian berikutnya agak pelan."
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
  }, 650)

  for (let i = 0; i < 18; i++) {
    setTimeout(spawnFloatingItem, i * 80)
  }
}

/* SCENE 5: FINAL LETTER */

const finalLetter = `Hai kamu.

Aku awalnya cuma mau bikin sesuatu yang lucu.
Tapi makin lama, aku sadar...
yang paling ingin aku kasih ke kamu bukan cuma game kecil ini.

Aku cuma mau kamu tahu,
hadirmu itu punya tempat sendiri di pikiranku.

Kamu punya cara yang sederhana
buat bikin hari yang biasa aja terasa lebih hangat.

Aku suka caramu muncul.
Aku suka caramu bikin aku senyum tanpa sadar.
Aku suka hal-hal kecil tentang kamu
yang mungkin kamu sendiri nggak sadar kalau itu manis.

Dan kalau website ini terasa agak lucu,
agak nyebelin,
agak sedih,
lalu akhirnya romantis...

itu karena perasaanku juga begitu.

Kadang gemes.
Kadang takut.
Kadang kangen.
Tapi ujung-ujungnya tetap sama:

aku senang mengenal kamu.

Jadi hari ini,
tolong simpan satu hal kecil ini ya...

kamu itu spesial.
bukan karena harus sempurna,
tapi karena kamu adalah kamu. 💗`

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
      }, 500)
    }
  }, 26)
}

function restartWebsite() {
  clearInterval(heartInterval)
  clearInterval(typingTimer)
  goTo("scene-1")
}

/* EVENTS */

document.addEventListener("DOMContentLoaded", () => {
  goTo("scene-1")

  setInterval(spawnFloatingItem, 750)

  for (let i = 0; i < 15; i++) {
    setTimeout(spawnFloatingItem, i * 150)
  }

  $("startBtn").addEventListener("click", () => {
    goTo("scene-2")
    initCuteGame()
  })

  $("nextToAngryBtn").addEventListener("click", () => {
    goTo("scene-3")
    initAngryScene()
  })

  $("calmBtn").addEventListener("click", calmAngry)

  $("runawayBtn").addEventListener("mouseenter", moveRunawayButton)
  $("runawayBtn").addEventListener("touchstart", moveRunawayButton)
  $("runawayBtn").addEventListener("click", () => {
    moveRunawayButton()
    $("angryText").textContent =
      "Loh kok malah milih nggak mau? Tombolnya aja kabur tuh. Bujuk yang bener dong 😤"
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