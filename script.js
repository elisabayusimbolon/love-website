const $ = (id) => document.getElementById(id)

function goTo(sceneId) {
  document.querySelectorAll(".scene").forEach((scene) => {
    scene.classList.remove("active")
  })

  const target = $(sceneId)

  if (target) {
    target.scrollTop = 0
    target.classList.add("active")
  }
}

/* BACKGROUND */

const floatingItems = ["♡", "✦", "miss you", "love", "bloom", "dear you", "♡", "✧"]

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

function launchConfetti() {
  const area = $("confettiArea")
  if (!area) return

  const colors = ["#d63384", "#ff9fcb", "#ffd1e3", "#ffffff", "#c42f78"]

  for (let i = 0; i < 100; i++) {
    const item = document.createElement("div")
    const size = 6 + Math.random() * 8

    item.className = "confetti"
    item.style.left = Math.random() * 100 + "vw"
    item.style.width = size + "px"
    item.style.height = size + "px"
    item.style.background = colors[Math.floor(Math.random() * colors.length)]
    item.style.animationDuration = 2.4 + Math.random() * 2.8 + "s"
    item.style.animationDelay = Math.random() * 0.8 + "s"
    item.style.setProperty("--move-x", (Math.random() - 0.5) * 170 + "px")

    area.appendChild(item)

    setTimeout(() => item.remove(), 6000)
  }
}

/* QUIZ */

const quizData = [
  {
    emoji: "🌙 + 💬 + 🕰️",
    question: "Kalau digabung, ini paling dekat artinya apa?",
    options: [
      {
        text: "Lupa tidur karena scrolling",
        correct: false,
        emoji: "🌙",
        response:
          "Hampir, tapi bukan. Ini bukan tentang layar yang bikin susah tidur, ini tentang satu orang yang kabarnya diam-diam ditunggu."
      },
      {
        text: "Nunggu satu chat yang bikin tenang",
        correct: true,
        emoji: "💬",
        response:
          "Iya, benar. Kadang yang ditunggu bukan pesan panjang, cukup satu kabar kecil dari orang yang tepat."
      },
      {
        text: "Jam dinding sedang curhat",
        correct: false,
        emoji: "🕰️",
        response:
          "Lucu juga kalau jam bisa curhat. Tapi kali ini bukan jamnya yang gelisah, melainkan hati yang sedang menunggu."
      },
      {
        text: "Malam yang terlalu sunyi",
        correct: false,
        emoji: "✨",
        response:
          "Dekat, tapi belum tepat. Malamnya bukan cuma sunyi, ada satu nama yang bikin sunyinya terasa lebih panjang."
      }
    ]
  },
  {
    emoji: "☕ + 🌧️ + 📖",
    question: "Kalau suasana ini jadi perasaan, artinya apa?",
    options: [
      {
        text: "Hari yang cocok untuk rebahan",
        correct: false,
        emoji: "☁️",
        response:
          "Memang cocok. Tapi rasanya belum lengkap kalau cuma rebahan tanpa seseorang yang ingin diajak cerita."
      },
      {
        text: "Hujan yang bikin lapar",
        correct: false,
        emoji: "☕",
        response:
          "Hujan memang sering bikin lapar, tapi ini bukan soal makanan. Ini soal perasaan yang datang pelan-pelan."
      },
      {
        text: "Tenang, tapi ingin ditemani",
        correct: true,
        emoji: "🌧️",
        response:
          "Benar. Ada tenang yang indah, tapi tetap lebih hangat kalau dibagi dengan orang yang kita sayang."
      },
      {
        text: "Buku yang belum selesai dibaca",
        correct: false,
        emoji: "📖",
        response:
          "Bisa saja. Tapi cerita yang paling ingin dibaca kali ini bukan di buku, melainkan dari seseorang."
      }
    ]
  },
  {
    emoji: "🌷 + 🏠 + ♡",
    question: "Menurut kamu, ini maksudnya apa?",
    options: [
      {
        text: "Bunga yang lupa jalan pulang",
        correct: false,
        emoji: "🌷",
        response:
          "Bunganya mungkin tersesat. Tapi perasaan ini justru sedang menemukan arah pulang."
      },
      {
        text: "Rumah yang banyak tanaman",
        correct: false,
        emoji: "🏠",
        response:
          "Aesthetic, tapi bukan itu. Ini bukan tentang rumah yang terlihat indah, melainkan seseorang yang terasa seperti rumah."
      },
      {
        text: "Tempat pulang yang paling hangat",
        correct: true,
        emoji: "♡",
        response:
          "Iya. Karena kadang rumah bukan alamat. Kadang rumah adalah seseorang yang membuat hati merasa aman."
      },
      {
        text: "Dekorasi kamar warna pink",
        correct: false,
        emoji: "🎀",
        response:
          "Manis, tapi belum tepat. Warna pink cuma suasananya. Maksud aslinya jauh lebih dalam."
      }
    ]
  }
]

let quizIndex = 0
let wrongCount = 0
const MAX_WRONG = 3

function initQuiz() {
  quizIndex = 0
  wrongCount = 0
  showQuiz()
}

function showQuiz() {
  const quiz = quizData[quizIndex]

  $("quizCounter").textContent = `Tebakan ${quizIndex + 1} dari ${quizData.length}`
  $("quizEmoji").textContent = quiz.emoji
  $("quizQuestion").textContent = quiz.question

  $("responseBox").style.display = "none"
  $("optionGrid").style.display = "grid"

  const grid = $("optionGrid")
  grid.innerHTML = ""

  quiz.options.forEach((option, index) => {
    const button = document.createElement("button")
    button.className = "option-btn"
    button.textContent = option.text
    button.onclick = () => answerQuiz(index)
    grid.appendChild(button)
  })
}

function answerQuiz(optionIndex) {
  const quiz = quizData[quizIndex]
  const selected = quiz.options[optionIndex]

  $("optionGrid").style.display = "none"
  $("responseBox").style.display = "block"
  $("responseEmoji").textContent = selected.emoji

  if (selected.correct) {
    wrongCount = 0

    $("responseText").textContent = selected.response
    $("responseBtn").textContent =
      quizIndex < quizData.length - 1
        ? "Buka tebakan berikutnya"
        : "Lanjut ke bagian yang lebih jujur"

    $("responseBtn").onclick = nextQuiz
    return
  }

  wrongCount++

  if (wrongCount >= MAX_WRONG) {
    $("responseText").textContent =
      `${selected.response} Aku kasih lewat ya. Kamu sudah salah 3 kali, tapi nggak apa-apa. Kadang perasaan memang nggak harus selalu bisa ditebak.`

    $("responseBtn").textContent =
      quizIndex < quizData.length - 1
        ? "Lanjut dulu"
        : "Lanjut ke bagian yang lebih jujur"

    $("responseBtn").onclick = nextQuiz
  } else {
    const remaining = MAX_WRONG - wrongCount

    $("responseText").textContent =
      `${selected.response} Coba sekali lagi ya. Kesempatan salah kamu tinggal ${remaining}.`

    $("responseBtn").textContent = "Coba lagi"
    $("responseBtn").onclick = showQuiz
  }
}

function nextQuiz() {
  quizIndex++
  wrongCount = 0

  if (quizIndex < quizData.length) {
    showQuiz()
  } else {
    goTo("scene-3")
    initMemoryCards()
  }
}

/* MEMORY CARDS */

const memoryTexts = [
  "Hadirmu itu sederhana, tapi efeknya besar. Kamu bisa bikin hari yang biasa saja terasa punya alasan untuk disyukuri.",
  "Senyummu punya cara sendiri untuk tinggal di kepala. Bahkan setelah percakapan selesai, rasanya masih ada yang hangat tertinggal.",
  "Aku mungkin nggak selalu pandai menjelaskan perasaan. Tapi kalau harus jujur, aku suka caramu hadir: pelan, lembut, tapi sulit hilang."
]

let openedCards = new Set()

function initMemoryCards() {
  openedCards = new Set()

  document.querySelectorAll(".letter-btn").forEach((card) => {
    card.classList.remove("opened")
  })

  $("memoryText").textContent = "Pilih salah satu dulu. Aku tungguin."
  $("toScene4Btn").classList.add("hidden")
}

function openMemoryCard(index, element) {
  openedCards.add(index)
  element.classList.add("opened")

  $("memoryText").textContent = memoryTexts[index]

  if (openedCards.size === memoryTexts.length) {
    $("toScene4Btn").classList.remove("hidden")
  }
}

/* LOADING */

const loadingSteps = [
  {
    percent: 9,
    text: "Mengumpulkan alasan kenapa kamu mudah dirindukan..."
  },
  {
    percent: 18,
    text: "Mencari kata yang cukup manis, tapi nggak berlebihan..."
  },
  {
    percent: 31,
    text: "Mengingat caramu membuat hal sederhana terasa berarti..."
  },
  {
    percent: 44,
    text: "Menghitung berapa kali namamu muncul di pikiranku..."
  },
  {
    percent: 58,
    text: "Hasil sementara: terlalu sering untuk dianggap biasa."
  },
  {
    percent: 72,
    text: "Merapikan perasaan supaya tidak tumpah terlalu banyak..."
  },
  {
    percent: 86,
    text: "Menyiapkan bagian yang paling jujur..."
  },
  {
    percent: 100,
    text: "Selesai. Beberapa rasa memang tidak bisa dibuat singkat."
  }
]

let loadingIndex = 0
let loadingTimer = null

function startLoading() {
  clearTimeout(loadingTimer)

  loadingIndex = 0

  $("loadingFill").style.width = "0%"
  $("loadingPercent").textContent = "0%"
  $("loadingStatus").textContent = "Mengumpulkan alasan kenapa kamu mudah dirindukan..."
  $("toFinalBtn").classList.add("hidden")

  runLoading()
}

function runLoading() {
  if (loadingIndex >= loadingSteps.length) {
    setTimeout(() => {
      $("toFinalBtn").classList.remove("hidden")
    }, 500)

    return
  }

  const step = loadingSteps[loadingIndex]

  $("loadingFill").style.width = step.percent + "%"
  $("loadingPercent").textContent = step.percent + "%"
  $("loadingStatus").textContent = step.text

  loadingIndex++

  loadingTimer = setTimeout(runLoading, 850)
}

/* FINAL */

function initFinal() {
  setTimeout(() => {
    launchConfetti()
  }, 700)
}

function restart() {
  goTo("scene-1")
}

/* EVENTS */

document.addEventListener("DOMContentLoaded", () => {
  goTo("scene-1")

  setInterval(spawnFloatingItem, 900)

  for (let i = 0; i < 12; i++) {
    setTimeout(spawnFloatingItem, i * 180)
  }

  $("startBtn").addEventListener("click", () => {
    goTo("scene-2")
    initQuiz()
  })

  document.querySelectorAll(".letter-btn").forEach((card) => {
    card.addEventListener("click", () => {
      const index = Number(card.dataset.card)
      openMemoryCard(index, card)
    })
  })

  $("toScene4Btn").addEventListener("click", () => {
    goTo("scene-4")
    startLoading()
  })

  $("toFinalBtn").addEventListener("click", () => {
    goTo("scene-5")
    initFinal()
  })

  $("celebrateBtn").addEventListener("click", launchConfetti)
  $("restartBtn").addEventListener("click", restart)
})