const $ = (id) => document.getElementById(id)

function goTo(sceneId) {
  document.querySelectorAll('.scene').forEach(scene => {
    scene.classList.remove('active')
  })

  const target = $(sceneId)

  if (target) {
    target.scrollTop = 0
    target.classList.add('active')
  }
}

/* =========================
   BACKGROUND HEARTS
========================= */

const heartEmojis = ['💕', '💖', '💗', '💓', '💞', '🌸', '✨', '💝', '🩷', '🎀']

function spawnHeart() {
  const bg = $('heartsContainer')
  if (!bg) return

  const el = document.createElement('div')
  el.className = 'float-heart'
  el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)]
  el.style.left = Math.random() * 100 + 'vw'
  el.style.fontSize = (12 + Math.random() * 20) + 'px'
  el.style.animationDuration = (7 + Math.random() * 8) + 's'
  el.style.animationDelay = (Math.random() * 1.5) + 's'

  bg.appendChild(el)

  setTimeout(() => {
    el.remove()
  }, 17000)
}

function launchConfetti() {
  const container = $('confettiContainer')
  if (!container) return

  const colors = ['#d63384', '#ff69b4', '#ffb3d1', '#ffd700', '#ff6b9d', '#a78bfa', '#f472b6']

  for (let i = 0; i < 120; i++) {
    const piece = document.createElement('div')
    const size = 7 + Math.random() * 10

    piece.className = 'c-piece'
    piece.style.left = Math.random() * 100 + 'vw'
    piece.style.width = size + 'px'
    piece.style.height = size + 'px'
    piece.style.background = colors[Math.floor(Math.random() * colors.length)]
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '4px'
    piece.style.animationDuration = (2.2 + Math.random() * 3) + 's'
    piece.style.animationDelay = Math.random() * 1.1 + 's'
    piece.style.setProperty('--cx', ((Math.random() - 0.5) * 160) + 'px')

    container.appendChild(piece)

    setTimeout(() => {
      piece.remove()
    }, 6500)
  }
}

/* =========================
   INTRO EMOJI
========================= */

const introEmojis = ['👀', '😳', '💌', '🎀', '😏', '🫣', '💕']
let introEmojiIndex = 0
let introInterval = null

function startIntroEmoji() {
  stopIntroEmoji()

  introInterval = setInterval(() => {
    const el = $('introEmoji')
    if (!el) return

    introEmojiIndex = (introEmojiIndex + 1) % introEmojis.length

    el.style.opacity = '0'
    el.style.transform = 'scale(0.5) rotate(-10deg)'

    setTimeout(() => {
      el.textContent = introEmojis[introEmojiIndex]
      el.style.opacity = '1'
      el.style.transform = 'scale(1) rotate(0deg)'
    }, 180)
  }, 1500)
}

function stopIntroEmoji() {
  if (introInterval) {
    clearInterval(introInterval)
    introInterval = null
  }
}

/* =========================
   SCENE 2 QUIZ LUCU
========================= */

const quizList = [
  {
    emoji: '🐸 + 🌙 + 🧋',
    correct: 2,
    pilihan: [
      'Katak minum boba malem-malem 🌃',
      'Ramuan sihir nenek yang gagal 🧪',
      'Aku nunggu chat kamu 😴',
      'Mimpi aneh abis begadang 😵'
    ],
    wrong: [
      'Wkwk kataknya anak Jaksel banget, malem-malem nyari boba 😭 Tapi bukan itu, coba lagi yaa.',
      'Nenek sihirnya mungkin aesthetic, tapi masa ramuannya pake boba? 😭 Salah sayang.',
      'Mimpi aneh emang sering terjadi kalau tidur jam 3 pagi. Tapi bukan ini jawabannya 😭'
    ],
    success: 'Nahhh ini baru peka 😳 Jawabannya emang: aku nunggu chat kamu. Tapi tenang, aku nggak nyindir kok. Dikit doang 🤭'
  },
  {
    emoji: '🦆 + 📚 + 🔥',
    correct: 0,
    pilihan: [
      'Bebek kutu buku yang ambisius 🎓',
      'PR-ku terbakar, bebek jadi saksi 😱',
      'Bebek belajar survival di alam liar 🏕️',
      'Semangat belajar yang akhirnya padam 💨'
    ],
    wrong: [
      'HAHAHA bebek jadi saksi kriminal 😭 Plot twist-nya bagus, tapi salah.',
      'Bebek survival? Ini Discovery Channel versi unggas ya 😭 Salah tapi kreatif.',
      'Ini terlalu relate sama anak sekolah/kuliah 😔 Tapi tetap salah, maaf yaa.'
    ],
    success: 'Betulll! Bebeknya ambis banget sampai belajar dekat api. Dia capek, tapi tetap berusaha. Kayak kamu kalau lagi sok kuat 😌'
  },
  {
    emoji: '🌵 + 💤 + 🎻',
    correct: 1,
    pilihan: [
      'Kaktus tidur sambil main biola 🎶',
      'Konser membosankan di gurun 🏜️',
      'Aku nunggu kamu bales WA 📱',
      'Drama Korea episode terakhir 😭'
    ],
    wrong: [
      'Kaktus main biola gimana caranya? Tangannya berduri, busurnya nangis 😭 Salah.',
      'Lagi-lagi nunggu WA? Hmm mencurigakan. Tapi kali ini bukan itu yaa 👀',
      'Drama Korea episode terakhir emang menyakitkan, tapi bukan jawaban ini 😭'
    ],
    success: 'Iyaaa bener! Konser membosankan di gurun. Nggak masuk akal, tapi lucu. Kayak kita kadang random tapi tetap seru 🤭'
  }
]

let quizIndex = 0
let quizTry = 0
const MAX_TRY = 2

function initQuiz() {
  quizIndex = 0
  quizTry = 0
  showQuiz()
}

function showQuiz() {
  const quiz = quizList[quizIndex]

  $('quizProgress').textContent = `Soal ${quizIndex + 1} dari ${quizList.length} 🎯`
  $('quizTitle').textContent = 'Tebak artinya!'
  $('emojiDisplay').textContent = quiz.emoji
  $('quizSub').textContent = 'Pilih jawaban yang menurutmu paling bener~'

  $('reactionBox').style.display = 'none'
  $('optionsGrid').style.display = 'grid'

  const grid = $('optionsGrid')
  grid.innerHTML = ''

  quiz.pilihan.forEach((text, index) => {
    const btn = document.createElement('button')
    btn.className = 'opt-btn'
    btn.textContent = text
    btn.onclick = () => answerQuiz(index)
    grid.appendChild(btn)
  })
}

function answerQuiz(selectedIndex) {
  const quiz = quizList[quizIndex]
  const isCorrect = selectedIndex === quiz.correct

  $('optionsGrid').style.display = 'none'
  $('reactionBox').style.display = 'block'

  if (isCorrect) {
    $('reactionEmoji').textContent = '💘'
    $('reactionText').textContent = quiz.success
    $('reactionBtn').textContent = quizIndex < quizList.length - 1
      ? 'Soal berikutnya dong ➡️'
      : 'Lanjut, aku siap 😤'

    $('reactionBtn').onclick = nextQuiz
    return
  }

  quizTry++

  const wrongText = quiz.wrong[(quizTry - 1) % quiz.wrong.length]

  $('reactionEmoji').textContent = quizTry >= MAX_TRY ? '😭' : '😂'
  $('reactionText').textContent = quizTry >= MAX_TRY
    ? `${wrongText} Yaudah aku kasih lewat, soalnya kalau nunggu kamu bener nanti keburu tahun depan 😭`
    : wrongText

  if (quizTry >= MAX_TRY) {
    $('reactionBtn').textContent = quizIndex < quizList.length - 1
      ? 'Yaudah lanjut aja 😭'
      : 'Oke lanjut, jangan marah 😭'

    $('reactionBtn').onclick = nextQuiz
  } else {
    $('reactionBtn').textContent = 'Coba lagi, jangan asal 😤'
    $('reactionBtn').onclick = showQuiz
  }
}

function nextQuiz() {
  quizIndex++
  quizTry = 0

  if (quizIndex < quizList.length) {
    showQuiz()
  } else {
    goTo('scene-3')
    initNgambek()
  }
}

/* =========================
   SCENE 3 NGAMBEK
========================= */

let moodValue = 0
let teaseCount = 0

const moodMessages = [
  {
    value: 20,
    emoji: '😒',
    text: 'Hmm... maafnya diterima 20%. Tapi aku masih pura-pura jutek dulu.'
  },
  {
    value: 40,
    emoji: '😑',
    text: 'Oke naik jadi 40%. Tapi jangan merasa menang dulu ya.'
  },
  {
    value: 60,
    emoji: '🥺',
    text: 'Aduh kok jadi kasihan... tapi aku masih gengsi.'
  },
  {
    value: 80,
    emoji: '🫠',
    text: 'Oke hampir luluh. Tapi kamu harus klik sekali lagi biar dramatis.'
  },
  {
    value: 100,
    emoji: '🥹',
    text: 'Yaudah aku luluh. Susah juga ngambek sama orang selucu kamu.'
  }
]

function initNgambek() {
  moodValue = 0
  teaseCount = 0

  $('moodCard').style.display = 'block'
  $('ngambekDone').style.display = 'none'
  $('moodEmoji').textContent = '😤'
  $('moodText').textContent = 'Kamu tadi salah-salah mulu. Aku ngambek dikit boleh kan? 😒'
  $('moodFill').style.width = '0%'
  $('moodPercent').textContent = 'Luluh: 0%'
  $('apologyBtn').textContent = 'Maafin aku dong 🥺'
}

function makeMoodBetter() {
  if (moodValue >= 100) return

  moodValue += 20
  const current = moodMessages.find(item => item.value === moodValue)

  $('moodFill').style.width = moodValue + '%'
  $('moodPercent').textContent = `Luluh: ${moodValue}%`

  if (current) {
    $('moodEmoji').textContent = current.emoji
    $('moodText').textContent = current.text
  }

  if (moodValue >= 100) {
    setTimeout(() => {
      $('moodCard').style.display = 'none'
      $('ngambekDone').style.display = 'block'
    }, 500)
  }
}

function teaseMood() {
  teaseCount++

  const card = $('moodCard')
  card.classList.remove('shake')
  void card.offsetWidth
  card.classList.add('shake')

  $('moodEmoji').textContent = teaseCount % 2 === 0 ? '😡' : '🙄'
  $('moodText').textContent = teaseCount % 2 === 0
    ? 'Lah kok nggak salah? Makin ngambek nih aku 😤'
    : 'Hadeh... kamu malah nantangin aku ya? Klik maaf yang bener dong 😒'
}

/* =========================
   SCENE 4 SEDIH
========================= */

let sadStep = 0

const sadMessages = [
  {
    emoji: '☁️',
    text: 'Kadang aku suka bercanda terus, biar kamu ketawa...'
  },
  {
    emoji: '🌧️',
    text: 'Tapi jujur, di balik bercandaku, aku juga sering takut. Takut kurang baik buat kamu, takut bikin kamu capek, takut nggak bisa jadi orang yang kamu butuhin.'
  },
  {
    emoji: '🥺',
    text: 'Aku mungkin nggak selalu sempurna. Tapi aku selalu pengen belajar jadi lebih baik, terutama buat kamu.'
  },
  {
    emoji: '🤍',
    text: 'Karena kamu bukan cuma orang yang aku suka. Kamu adalah orang yang selalu aku syukuri hadirnya.'
  }
]

function initSad() {
  sadStep = 0
  $('sadDone').style.display = 'none'
  $('sadEmoji').textContent = sadMessages[0].emoji
  $('sadText').textContent = sadMessages[0].text
  $('sadNextBtn').style.display = 'inline-block'
  $('sadNextBtn').textContent = 'Buka lanjutannya 💌'
}

function nextSad() {
  sadStep++

  if (sadStep < sadMessages.length) {
    $('sadEmoji').textContent = sadMessages[sadStep].emoji
    $('sadText').textContent = sadMessages[sadStep].text

    if (sadStep === sadMessages.length - 1) {
      $('sadNextBtn').textContent = 'Aku udah baca semuanya 🤍'
    }
  } else {
    $('sadNextBtn').style.display = 'none'
    $('sadDone').style.display = 'block'
  }
}

/* =========================
   SCENE 5 LOADING
========================= */

const loadingSteps = [
  { percent: 5, status: 'Menginisialisasi rasa kangen... 💻' },
  { percent: 12, status: 'Mencari kata yang nggak terlalu cringe... 📝' },
  { percent: 20, status: 'Gagal. Semua kata jadi cringe kalau tentang kamu 😭' },
  { percent: 31, status: 'Menghitung berapa kali aku mikirin kamu hari ini... 🧠' },
  { percent: 43, status: 'Error: jumlahnya kebanyakan 😵' },
  { percent: 55, status: 'Mengumpulkan alasan kenapa kamu gemesin... 🎀' },
  { percent: 68, status: 'Storage hampir penuh karena alasannya terlalu banyak 💥' },
  { percent: 77, status: 'Memverifikasi: kamu sebaik itu beneran? ✅' },
  { percent: 89, status: 'Hasil verifikasi: iya, kamu sebaik itu. Bahkan lebih. 💕' },
  { percent: 96, status: 'Hampir selesai... siap-siap ya 🌸' },
  { percent: 100, status: 'Selesai. Rasa sayangnya tidak bisa dihitung. 💖' }
]

let loadingIndex = 0
let loadingTimeout = null

function startLoading() {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout)
  }

  loadingIndex = 0

  $('loadingFill').style.width = '0%'
  $('loadingPercent').textContent = '0%'
  $('loadingStatus').textContent = 'Memulai...'
  $('loadingResult').style.display = 'none'

  runLoadingStep()
}

function runLoadingStep() {
  if (loadingIndex >= loadingSteps.length) {
    loadingTimeout = setTimeout(() => {
      $('loadingResult').style.display = 'block'
    }, 700)
    return
  }

  const step = loadingSteps[loadingIndex]

  $('loadingFill').style.width = step.percent + '%'
  $('loadingPercent').textContent = step.percent + '%'
  $('loadingStatus').textContent = step.status

  loadingIndex++

  const delay = loadingIndex === 3 ? 900 : 650

  loadingTimeout = setTimeout(runLoadingStep, delay)
}

/* =========================
   FINAL
========================= */

function initFinal() {
  const card = document.querySelector('.letter-card')

  if (card) {
    card.style.opacity = '0'
    card.style.transform = 'translateY(28px)'
    card.style.transition = 'opacity 0.8s ease, transform 0.8s ease'

    setTimeout(() => {
      card.style.opacity = '1'
      card.style.transform = 'translateY(0)'
    }, 350)
  }

  setTimeout(launchConfetti, 600)
}

function restartWebsite() {
  stopIntroEmoji()
  startIntroEmoji()
  goTo('scene-1')
}

/* =========================
   EVENTS
========================= */

document.addEventListener('DOMContentLoaded', () => {
  setInterval(spawnHeart, 750)

  for (let i = 0; i < 14; i++) {
    setTimeout(spawnHeart, i * 160)
  }

  startIntroEmoji()
  goTo('scene-1')

  $('scene1Btn').addEventListener('click', () => {
    stopIntroEmoji()
    goTo('scene-2')
    initQuiz()
  })

  $('apologyBtn').addEventListener('click', makeMoodBetter)
  $('teaseBtn').addEventListener('click', teaseMood)

  $('toSadBtn').addEventListener('click', () => {
    goTo('scene-4')
    initSad()
  })

  $('sadNextBtn').addEventListener('click', nextSad)

  $('toLoadingBtn').addEventListener('click', () => {
    goTo('scene-5')
    startLoading()
  })

  $('toFinalBtn').addEventListener('click', () => {
    goTo('scene-6')
    initFinal()
  })

  $('confettiBtn').addEventListener('click', launchConfetti)

  $('restartBtn').addEventListener('click', restartWebsite)
})