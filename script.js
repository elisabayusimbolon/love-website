function goTo(sceneId) {
  document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'))
  const target = document.getElementById(sceneId)
  if (target) { target.scrollTop = 0; target.classList.add('active') }
}

const heartEmojis = ['💕','💖','💗','💓','💞','🌸','✨','💝']
function spawnHeart() {
  const bg = document.getElementById('heartsContainer')
  if (!bg) return
  const el = document.createElement('div')
  el.className = 'float-heart'
  el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)]
  el.style.left = Math.random() * 100 + 'vw'
  el.style.fontSize = (11 + Math.random() * 14) + 'px'
  el.style.animationDuration = (6 + Math.random() * 9) + 's'
  el.style.animationDelay = (Math.random() * 2) + 's'
  bg.appendChild(el)
  setTimeout(() => el.remove(), 16000)
}

function launchConfetti() {
  const container = document.getElementById('confettiContainer')
  const colors = ['#d63384','#ff69b4','#ffb3d1','#ffd700','#ff6b6b','#a78bfa','#34d399','#f472b6']
  for (let i = 0; i < 90; i++) {
    const p = document.createElement('div')
    p.className = 'c-piece'
    const size = 7 + Math.random() * 9
    p.style.cssText = `left:${Math.random()*100}vw;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>0.5?'50%':'2px'};animation-duration:${2+Math.random()*3}s;animation-delay:${Math.random()*1.2}s;--cx:${(Math.random()-0.5)*120}px;`
    container.appendChild(p)
    setTimeout(() => p.remove(), 6000)
  }
}

const introEmojis = ['👀','😳','💌','🎁','😏']
let introEmojiIdx = 0, introInterval = null
function startIntroEmoji() {
  const el = document.getElementById('introEmoji')
  introInterval = setInterval(() => {
    introEmojiIdx = (introEmojiIdx + 1) % introEmojis.length
    el.style.opacity = '0'; el.style.transform = 'scale(0.5) rotate(-10deg)'
    setTimeout(() => {
      el.textContent = introEmojis[introEmojiIdx]
      el.style.opacity = '1'; el.style.transform = 'scale(1) rotate(0deg)'
    }, 200)
  }, 1800)
}
function stopIntroEmoji() { clearInterval(introInterval) }

const soalList = [
  {
    emoji: '🐸 + 🌙 + 🧋',
    pilihan: [
      'Katak minum boba malem-malem 🌃',
      'Ramuan sihir nenek yang gagal 🧪',
      'Aku nunggu chat kamu 😴',
      'Mimpi aneh abis begadang 😵'
    ],
    reaksi: [
      { emoji: '🐸', teks: 'Wkwk hampir masuk akal! Tapi kenapa katak harus minum boba malem-malem sih? SALAH tapi aku suka vibe-nya 😂' },
      { emoji: '🧙', teks: 'Ooh misterius~ Tapi nenek sihirnya nggak pake boba buat ramuannya. SALAH, coba lagi!' },
      { emoji: '👀', teks: '...Ini jawaban yang sangat spesifik dan mencurigakan. Kamu sering nunggu chat seseorang ya? SALAH btw 😏' },
      { emoji: '😵', teks: 'Mimpi aneh? Emang kamu tidur jam berapa sih?! SALAH tapi aku khawatir sama jadwal tidurmu 😂' }
    ]
  },
  {
    emoji: '🦆 + 📚 + 🔥',
    pilihan: [
      'Bebek kutu buku yang ambisius 🎓',
      'PR ku terbakar, bebek jadi saksi 😱',
      'Bebek belajar survival di alam liar 🏕️',
      'Semangat belajar yang akhirnya padam 💨'
    ],
    reaksi: [
      { emoji: '🎓', teks: 'Bebek lagi S2 kali ya... ambis banget. SALAH tapi aku respect sama bebek itu 🫡' },
      { emoji: '😱', teks: 'HAHAHA bebek jadi saksi kejahatan?! Plot twist! Kreatif banget tapi tetep SALAH 😭' },
      { emoji: '🏕️', teks: 'Bebek Bear Grylls versi unggas... SALAH tapi konsepnya 10/10 🏕️' },
      { emoji: '💨', teks: 'Ini terlalu relate sama kehidupan nyata... SALAH tapi dapet poin empati dariku 😔' }
    ]
  },
  {
    emoji: '🌵 + 💤 + 🎻',
    pilihan: [
      'Kaktus tidur sambil main biola 🎶',
      'Konser membosankan di gurun 🏜️',
      'Aku nunggu kamu bales WA 📱',
      'Drama korea episode terakhir 😭'
    ],
    reaksi: [
      { emoji: '🌵', teks: 'Kaktus main biola?! Tangannya berduri gimana megang busurnya? SALAH tapi lucu banget 😂' },
      { emoji: '🏜️', teks: 'Konser di gurun dengan penonton unta... SALAH tapi aku mau beli tiketnya kalau beneran ada 🐪' },
      { emoji: '📱', teks: 'LAGI?! Dari tadi jawabannya relate sama nunggu seseorang terus... SALAH 👀 tapi aku curiga 😏' },
      { emoji: '😭', teks: 'DRAMA KOREA?! Nggak ada hubungannya sama sekali tapi aku ikut nangis duluan. SALAH!' }
    ]
  }
]

let soalIndex = 0, salahStreak = 0
const MAX_SALAH = 2

function initTebak() { soalIndex = 0; salahStreak = 0; tampilSoal() }

function tampilSoal() {
  const soal = soalList[soalIndex]
  salahStreak = 0
  document.getElementById('optionsGrid').style.display = 'grid'
  document.getElementById('reactionBox').style.display = 'none'
  document.getElementById('tebakTitle').textContent = 'Tebak artinya!'
  document.getElementById('tebakSub').textContent = 'Pilih jawaban yang menurutmu paling bener~'
  document.getElementById('emojiDisplay').textContent = soal.emoji
  document.getElementById('tebakProgress').textContent = `Soal ${soalIndex + 1} dari ${soalList.length} 🎯`
  const grid = document.getElementById('optionsGrid'); grid.innerHTML = ''
  soal.pilihan.forEach((teks, i) => {
    const btn = document.createElement('button'); btn.className = 'opt-btn'; btn.textContent = teks
    btn.onclick = () => jawab(i); grid.appendChild(btn)
  })
}

function jawab(pilihanIdx) {
  const soal = soalList[soalIndex]
  salahStreak++
  const reaksi = soal.reaksi[pilihanIdx]
  document.getElementById('optionsGrid').style.display = 'none'
  document.getElementById('reactionBox').style.display = 'block'
  document.getElementById('reactionEmoji').textContent = reaksi.emoji
  document.getElementById('reactionText').textContent = reaksi.teks
  const btn = document.getElementById('reactionBtn')
  if (salahStreak >= MAX_SALAH) {
    if (soalIndex < soalList.length - 1) {
      btn.textContent = 'Soal berikutnya 😤'
      btn.onclick = () => { soalIndex++; tampilSoal() }
    } else {
      document.getElementById('reactionEmoji').textContent = '🎊'
      document.getElementById('reactionText').textContent = 'Kamu salah semua... TAPI cara salahnya lucu banget! Oke, ada sesuatu yang lebih serius nih~ 👀'
      btn.textContent = 'Lanjut! ➡️'
      btn.onclick = () => { goTo('scene-3'); initKepribadian() }
    }
  } else {
    btn.textContent = 'Coba lagi 😤'
    btn.onclick = () => tampilSoal()
  }
}

const pertanyaanList = [
  {
    emoji: '🤔',
    teks: 'Kalau kamu bisa milih satu kekuatan super, kamu pilih apa?',
    pilihan: ['Bisa baca pikiran orang 🧠','Terbang ke mana aja ✈️','Waktu berhenti saat kamu mau ⏸️','Bisa invisible kapan aja 👻'],
    hasil: [
      '🧠 Kamu pilih baca pikiran? Hati-hati... kalau kamu bisa baca pikiranku sekarang, kamu bakal malu sendiri. Isinya kamu semua. 💕',
      '✈️ Terbang ya~ Kamu tipe yang pengen bebas tapi tetap punya tempat buat pulang. Dan "pulang" itu seseorang, bukan tempat. 🌸',
      '⏸️ Kamu mau hentikan waktu? Aku juga mau — saat momen-momen bareng kamu. Karena rasanya selalu terlalu cepat berlalu. 💫',
      '👻 Invisible... kamu introvert atau lagi capek jadi pusat perhatian? Either way, aku selalu bisa "lihat" kamu bahkan saat kamu merasa nggak terlihat siapapun. 🌸'
    ]
  },
  {
    emoji: '🌧️',
    teks: 'Tiba-tiba hujan deras. Kamu lagi di luar sendirian. Reaksimu?',
    pilihan: ['Lari cari tempat berteduh 🏃','Diem aja, nikmatin hujannya 🌧️','Panik nyariin payung 😰','Telepon seseorang minta jemput 📞'],
    hasil: [
      '🏃 Kamu tipe yang selalu cari solusi cepat. Praktis dan tangguh. Di tengah hujan sekalipun, kamu nggak menyerah. Aku suka itu dari kamu.',
      '🌧️ Kamu nikmatin hujan... berarti kamu bisa nemuin keindahan di hal yang orang lain anggap masalah. Itu langka banget. Dan itu kamu banget. 💙',
      '😰 Panik dulu mikir belakangan — hey relatable! Tapi tau nggak, di tengah kepanikanmu, kamu tetap kelihatan lucu. Itu jujur bukan rayuan.',
      '📞 Kamu telepon seseorang... siapa? 👀 Apapun jawabannya, aku selalu mau jadi orang yang kamu telepon duluan itu. Selalu. 💕'
    ]
  },
  {
    emoji: '💌',
    teks: 'Kalau kamu nerima surat cinta anonim, reaksi pertamamu?',
    pilihan: ['Senyum-senyum sendiri 😊','Penasaran siapa pengirimnya 🔍','Malu tapi suka 🙈','Pura-pura biasa aja padahal seneng 😏'],
    hasil: [
      '😊 Kamu senyum-senyum sendiri... itu artinya hatimu mudah tersentuh. Dan orang yang tuliskan surat itu tau persis cara bikin kamu bahagia. Percaya deh 💕',
      '🔍 Penasaran pengirimnya? Oke aku kasih clue: orangnya nggak jauh dari kamu. Dan sekarang lagi deg-degan nunggu reaksimu baca ini 🫣',
      '🙈 Malu tapi suka — reaksi paling jujur! Kamu nggak bisa sembunyiin perasaanmu sepenuhnya dan itu justru yang bikin kamu menggemaskan 😄',
      '😏 Pura-pura biasa aja tapi dalem hati seneng... kamu susah ditebak. Tapi aku udah lama belajar "bahasa" kamu — dan aku tau kamu suka 😊'
    ]
  },
  {
    emoji: '🌟',
    teks: 'Hal kecil apa yang bisa bikin harimu langsung lebih baik?',
    pilihan: ['Makanan enak 🍜','Chat dari seseorang 💬','Tidur siang 😴','Langit sore yang cantik 🌅'],
    hasil: [
      '🍜 Makanan enak ya~ Aku noted. Suatu saat aku akan pastikan kamu selalu punya makanan enak di hari-hari yang berat. Itu janji. 🤝',
      '💬 Chat dari seseorang... semoga aku termasuk seseorang itu. Dan kalau belum, mulai sekarang aku mau jadi yang pertama ngechat kamu setiap hari. 💕',
      '😴 Tidur siang — orang yang bilang ini biasanya lagi kelelahan tapi tetap kuat. Kamu boleh istirahat. Kamu udah cukup berjuang hari ini. 🌸',
      '🌅 Langit sore yang cantik... kamu punya selera yang indah. Dan tau nggak? Setiap kali aku lihat langit sore, aku selalu pengen ngajak kamu lihat bareng. 🌇'
    ]
  }
]

let pertanyaanIndex = 0
function initKepribadian() { pertanyaanIndex = 0; tampilPertanyaan() }

function tampilPertanyaan() {
  const p = pertanyaanList[pertanyaanIndex]
  document.getElementById('tesProgress').textContent = `Pertanyaan ${pertanyaanIndex + 1} dari ${pertanyaanList.length} 🧠`
  document.getElementById('tesEmoji').textContent = p.emoji
  document.getElementById('tesQuestion').textContent = p.teks
  const grid = document.getElementById('tesGrid'); grid.innerHTML = ''
  grid.style.gridTemplateColumns = '1fr 1fr'
  p.pilihan.forEach((teks, i) => {
    const btn = document.createElement('button'); btn.className = 'opt-btn'; btn.textContent = teks
    btn.onclick = () => pilihJawaban(i); grid.appendChild(btn)
  })
}

function pilihJawaban(idx) {
  const p = pertanyaanList[pertanyaanIndex]
  document.getElementById('tesGrid').innerHTML = ''
  document.getElementById('tesQuestion').textContent = p.hasil[idx]
  document.getElementById('tesEmoji').textContent = '✨'
  const grid = document.getElementById('tesGrid')
  grid.style.gridTemplateColumns = '1fr'
  const btn = document.createElement('button')
  btn.className = 'btn-main'; btn.style.marginTop = '20px'
  if (pertanyaanIndex < pertanyaanList.length - 1) {
    btn.textContent = 'Pertanyaan berikutnya ➡️'
    btn.onclick = () => { pertanyaanIndex++; tampilPertanyaan() }
  } else {
    btn.textContent = 'Oke aku penasaran... lanjut! 🎮'
    btn.onclick = () => { goTo('scene-4'); initGame() }
  }
  grid.appendChild(btn)
}

let gameScore = 0, gameTimer = 10, gameInterval = null, heartInterval = null
let escapeInterval = null, gameRunning = false, escapeHeart = null

function initGame() {
  gameScore = 0; gameTimer = 10; gameRunning = false
  document.getElementById('scoreDisplay').textContent = '0'
  document.getElementById('timerDisplay').textContent = '10'
  document.getElementById('timerDisplay').style.color = '#d63384'
  document.getElementById('gameArea').innerHTML = ''
  document.getElementById('startGameBtn').style.display = 'inline-block'
  document.getElementById('gameResult').style.display = 'none'
}

function startGame() {
  document.getElementById('startGameBtn').style.display = 'none'
  gameScore = 0; gameTimer = 10; gameRunning = true
  document.getElementById('scoreDisplay').textContent = '0'
  heartInterval = setInterval(spawnHeartGame, 700)
  spawnEscapeHeart()
  gameInterval = setInterval(() => {
    gameTimer--
    document.getElementById('timerDisplay').textContent = gameTimer
    if (gameTimer <= 3) document.getElementById('timerDisplay').style.color = '#ff4444'
    if (gameTimer <= 0) endGame()
  }, 1000)
}

function spawnHeartGame() {
  if (!gameRunning) return
  const area = document.getElementById('gameArea')
  const el = document.createElement('div'); el.className = 'heart-target'; el.textContent = '💗'
  el.style.left = (10 + Math.random() * (area.offsetWidth - 40)) + 'px'
  el.style.top  = (10 + Math.random() * (area.offsetHeight - 40)) + 'px'
  el.onclick = () => {
    if (!gameRunning) return
    gameScore++; document.getElementById('scoreDisplay').textContent = gameScore
    el.style.transform = 'scale(1.5)'; el.style.opacity = '0'
    setTimeout(() => el.remove(), 200)
  }
  area.appendChild(el)
  setTimeout(() => { if (el.parentNode) el.remove() }, 1500)
}

function spawnEscapeHeart() {
  const area = document.getElementById('gameArea')
  escapeHeart = document.createElement('div')
  escapeHeart.className = 'escape-heart'
  escapeHeart.textContent = '💖'
  escapeHeart.style.left = '50%'; escapeHeart.style.top = '50%'
  escapeHeart.style.fontSize = '2rem'
  area.appendChild(escapeHeart)
  escapeInterval = setInterval(() => {
    if (!escapeHeart || !gameRunning) return
    const area = document.getElementById('gameArea')
    escapeHeart.style.left = (10 + Math.random() * (area.offsetWidth - 50)) + 'px'
    escapeHeart.style.top  = (10 + Math.random() * (area.offsetHeight - 50)) + 'px'
  }, 600)
}

function endGame() {
  gameRunning = false
  clearInterval(gameInterval); clearInterval(heartInterval); clearInterval(escapeInterval)
  document.getElementById('gameArea').innerHTML = ''
  let emoji, text
  if (gameScore >= 15) {
    emoji = '🏆'; text = `Gila ${gameScore} hati berhasil ditangkap! Tapi satu hati yang terus kabur — yang 💖 itu — itu hatiku. Dan sekarang aku mau jujur: hatiku udah lama jadi milik kamu. Dari dulu. 💕`
  } else if (gameScore >= 8) {
    emoji = '🎉'; text = `${gameScore} hati! Lumayan! Tapi notice nggak, ada satu hati yang nggak pernah bisa ditangkap? Yang 💖 itu... itu hatiku. Dan walaupun kelihatannya kabur, sebenernya hatiku udah di tangan kamu dari lama. 🥺`
  } else {
    emoji = '😂'; text = `Cuma ${gameScore}? Haha nggak papa! Tapi tau nggak, hati yang paling susah ditangkap itu — yang 💖 terus lari-lari — itu hatiku. Dan lucunya... meski susah ditangkap, hatiku udah jadi milik kamu tanpa kamu sadari. 💖`
  }
  document.getElementById('resultEmoji').textContent = emoji
  document.getElementById('resultText').textContent = text
  document.getElementById('gameResult').style.display = 'block'
  document.getElementById('nextFromGame').onclick = () => { goTo('scene-5'); startLoading() }
}

const loadingSteps = [
  { persen: 3,   status: 'Menginisialisasi perasaan... 💻' },
  { persen: 10,  status: 'Mencari kata yang tepat buat kamu... 📝' },
  { persen: 18,  status: 'Menghitung seberapa sering kamu senyum... 😊' },
  { persen: 27,  status: 'Overflow error: terlalu manis untuk diproses 🍬' },
  { persen: 35,  status: 'Menganalisis kenapa senyummu bisa bahaya gini... 😵' },
  { persen: 44,  status: 'Loading momen-momen yang bikin kangen... 📸' },
  { persen: 52,  status: 'WARNING: kadar kangen melebihi batas normal ⚠️' },
  { persen: 61,  status: 'Menghitung alasan kenapa aku suka kamu... 📋' },
  { persen: 69,  status: 'ERROR: terlalu banyak alasan, storage penuh 💥' },
  { persen: 75,  status: 'Restarting dengan kapasitas tak terbatas... 🔄' },
  { persen: 83,  status: 'Memverifikasi: kamu emang sebaik itu beneran? ✅' },
  { persen: 90,  status: 'Hasil verifikasi: IYA. Kamu lebih baik dari yang kamu kira. 💕' },
  { persen: 96,  status: 'Hampir selesai... siap-siap ya~ 🌸' },
  { persen: 99,  status: 'Kalkulasi final: tidak dapat dihitung dengan angka... 🔢' },
  { persen: 100, status: 'Selesai. Hasilnya: tidak terhingga. 💖' }
]

let loadingIdx = 0
function startLoading() {
  loadingIdx = 0
  document.getElementById('loadingFill').style.width = '0%'
  document.getElementById('loadingPercent').textContent = '0%'
  document.getElementById('loadingStatus').textContent = 'Memulai...'
  document.getElementById('loadingResult').style.display = 'none'
  runLoadingStep()
}

function runLoadingStep() {
  if (loadingIdx >= loadingSteps.length) {
    setTimeout(() => { document.getElementById('loadingResult').style.display = 'block' }, 700)
    return
  }
  const step = loadingSteps[loadingIdx]
  document.getElementById('loadingFill').style.width = step.persen + '%'
  document.getElementById('loadingPercent').textContent = step.persen + '%'
  document.getElementById('loadingStatus').textContent = step.status
  loadingIdx++
  const delays = [300,500,600,700,800,700,1000,800,900,700,800,700,1200,1500,1000]
  setTimeout(runLoadingStep, delays[loadingIdx - 1] || 600)
}

function initFinal() {
  const card = document.querySelector('.letter-card')
  if (card) {
    card.style.opacity = '0'; card.style.transform = 'translateY(30px)'
    card.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)' }, 400)
  }
  setTimeout(launchConfetti, 800)
}

function initAll() { stopIntroEmoji(); startIntroEmoji() }

document.addEventListener('DOMContentLoaded', () => {
  setInterval(spawnHeart, 900)
  for (let i = 0; i < 8; i++) spawnHeart()
  startIntroEmoji()
  goTo('scene-1')
  document.getElementById('scene1Btn').addEventListener('click', () => {
    stopIntroEmoji(); goTo('scene-2'); initTebak()
  })
  document.getElementById('startGameBtn').addEventListener('click', startGame)
  document.getElementById('confettiBtn').addEventListener('click', launchConfetti)
  document.getElementById('toFinalBtn').addEventListener('click', () => {
    goTo('scene-6'); initFinal()
  })
})