// --- FITUR LOADING BAR HALAMAN AWAL ---
document.addEventListener("DOMContentLoaded", () => {
    const loadingBar = document.getElementById("loading-bar");
    const loadingText = document.getElementById("loading-text");
    const loadingContainer = document.getElementById("loading-container");
    const startBtn = document.getElementById("start-btn");

    let progress = 0;
    const interval = setInterval(() => {
        progress += 2; // Kecepatan loading
        if (loadingBar) loadingBar.style.width = progress + "%";
        if (loadingText) loadingText.innerText = `Memuat Game... ${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            if (loadingContainer) loadingContainer.style.display = "none";
            if (startBtn) startBtn.style.display = "inline-block";
        }
    }, 30);
});

// --- KODINGAN UTAMA GAME ---
const startBtn = document.getElementById('start-btn');
const menuScreen = document.getElementById('menu-screen');
const playScreen = document.getElementById('play-screen');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const levelTitle = document.getElementById('level-title');
const currentTargetDisplay = document.getElementById('current-target');
const bgMusic = document.getElementById('bg-music');

let skor = 0;
let nyawa = 3;
let currentLevel = 1;
let gameInterval;
let isPaused = false;

// Daftar lengkap huruf Hijaiyah dari Alif sampai Ya
const levels = [
    { level: 1, huruf: 'ا', nama: 'Alif' },
    { level: 2, huruf: 'ب', nama: 'Ba' },
    { level: 3, huruf: 'ت', nama: 'Ta' },
    { level: 4, huruf: 'ث', nama: 'Tsa' },
    { level: 5, huruf: 'ج', nama: 'Jim' },
    { level: 6, huruf: 'ح', nama: 'Ha' },
    { level: 7, huruf: 'خ', nama: 'Kho' },
    { level: 8, huruf: 'د', nama: 'Dal' },
    { level: 9, huruf: 'ذ', nama: 'Dzal' },
    { level: 10, huruf: 'ر', nama: 'Ra' },
    { level: 11, huruf: 'ز', nama: 'Zai' },
    { level: 12, huruf: 'س', nama: 'Sin' },
    { level: 13, huruf: 'ش', nama: 'Syin' },
    { level: 14, huruf: 'ص', nama: 'Shod' },
    { level: 15, huruf: 'ض', nama: 'Dhod' },
    { level: 16, huruf: 'ط', nama: 'Tho' },
    { level: 17, huruf: 'ظ', nama: 'Zho' },
    { level: 18, huruf: 'ع', nama: 'Ain' },
    { level: 19, huruf: 'غ', nama: 'Ghin' },
    { level: 20, huruf: 'ف', nama: 'Fa' },
    { level: 21, huruf: 'ق', nama: 'Qaf' },
    { level: 22, huruf: 'ك', nama: 'Kaf' },
    { level: 23, huruf: 'ل', nama: 'Lam' },
    { level: 24, huruf: 'م', nama: 'Mim' },
    { level: 25, huruf: 'ن', nama: 'Nun' },
    { level: 26, huruf: 'و', nama: 'Wau' },
    { level: 27, huruf: 'ه', nama: 'Ha' },
    { level: 28, huruf: 'ي', nama: 'Ya' }
];

// Fungsi Suara Anak-Anak (Ceria & Pitch Tinggi)
function bicara(teks) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(teks);
        speech.lang = 'id-ID';
        speech.rate = 1.05; 
        speech.pitch = 1.5;  
        window.speechSynthesis.speak(speech);
    }
}

// Saat tombol "Mulai Bermain" diklik, putar musik & ucapkan salam
startBtn.addEventListener('click', function() {
    menuScreen.style.display = 'none';
    playScreen.style.display = 'flex';

    skor = 0;
    nyawa = 3;
    currentLevel = 1;
    isPaused = false;
    updateBoard();

    // Jalankan musik latar belakang dengan volume kecil (20%)
    if (bgMusic) {
        bgMusic.volume = 0.2;
        bgMusic.play().catch(e => console.log("Audio BGM diblokir browser"));
    }

    // Ucapkan salam lengkap
    bicara("Assalamu'alaikum! Yuk belajar ngaji ceria bersama Arfan!");

    // Jeda sebentar sebelum masuk ke instruksi huruf pertama
    setTimeout(() => {
        bicara("Bismillahirrahmanirrahim, kita mulai cari huruf Alif!");
        mulaiGameLoop();
    }, 2500);
});

function updateBoard() {
    scoreDisplay.innerText = skor;
    livesDisplay.innerText = nyawa;
    const dataLevel = levels[currentLevel - 1];
    levelTitle.innerText = `Level ${dataLevel.level}`;
    currentTargetDisplay.innerText = `${dataLevel.nama} ( ${dataLevel.huruf} )`;
}

// Pengatur waktu kemunculan item agar ramai & serentak
function mulaiGameLoop() {
    if (gameInterval) clearInterval(gameInterval);
    
    gameInterval = setInterval(() => {
        spawnItem();
        // Peluang 60% muncul item kedua secara bersamaan
        if (Math.random() < 0.6) {
            spawnItem();
        }
    }, 1200); 
}

function spawnItem() {
    if (nyawa <= 0 || isPaused) return;

    const item = document.createElement('div');
    const dataLevel = levels[currentLevel - 1];
    
    // Rasio Tantangan 8:6 (8 hantu, 6 huruf)
    const isHantu = Math.random() < (8 / 14); 

    if (isHantu) {
        item.classList.add('friendly-ghost');
        item.innerText = '👻';
    } else {
        item.classList.add('falling-letter');
        item.innerText = dataLevel.huruf; 
    }

    const maxX = gameArea.clientWidth - 70;
    const randomX = Math.floor(Math.random() * maxX);
    item.style.left = randomX + 'px';
    item.style.top = '0px';

    gameArea.appendChild(item);

    let posisiY = 0;
    const kecepatanJatuh = 3.2;

    const turunInterval = setInterval(function() {
        if (nyawa <= 0 || isPaused) {
            clearInterval(turunInterval);
            return;
        }

        posisiY += kecepatanJatuh;
        item.style.top = posisiY + 'px';

        if (posisiY > gameArea.clientHeight - 70) {
            clearInterval(turunInterval);
            item.remove();
        }
    }, 20);

    item.addEventListener('click', function() {
        if (isPaused) return;
        clearInterval(turunInterval);

        if (isHantu) {
            // Kena hantu: skor berkurang 10, nyawa berkurang
            skor = Math.max(0, skor - 10);
            nyawa -= 1;
            updateBoard();
            
            bicara("Aduh, kena hantu!");
            item.style.transform = "scale(0.5)";
            item.style.opacity = "0";
            
            if (nyawa <= 0) {
                bicara("Permainan selesai. Coba lagi ya!");
                alert("Permainan Selesai! Coba lagi ya.");
                location.reload();
            }
        } else {
            // Kena huruf: skor nambah 10
            skor += 10;
            updateBoard();
            
            // Tambahkan efek kilatan sinar (flash)
            item.classList.add('clicked-flash');
            
            bicara(dataLevel.nama);

            // Cek target skor kelipatan 100 untuk naik level
            if (skor >= currentLevel * 100) {
                clearInterval(gameInterval);
                isPaused = true; 
                gameArea.innerHTML = '';

                if (currentLevel < levels.length) {
                    // Naikkan level terlebih dahulu agar aman dan akurat
                    currentLevel++; 
                    const nextLevelData = levels[currentLevel - 1]; 
                    
                    bicara("Alhamdulillah, lanjut ke level berikutnya!");

                    setTimeout(() => {
                        tampilkanPopupLanjut(nextLevelData);
                    }, 2200);

                } else {
                    bicara("Alhamdulillah, kamu hebat menyelesaikan seluruh huruf Hijaiyah sampai Ya!");
                    setTimeout(() => {
                        alert("Alhamdulillah! Kamu hebat menamatkan seluruh level dari Alif sampai Ya!");
                        location.reload();
                    }, 1000);
                }
            }
        }

        setTimeout(() => item.remove(), 350);
    });
}

function tampilkanPopupLanjut(nextLevelData) {
    const popup = document.createElement('div');
    popup.style.position = 'absolute';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100%';
    popup.style.height = '100%';
    popup.style.background = 'rgba(15, 5, 30, 0.9)';
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.justifyContent = 'center';
    popup.style.alignItems = 'center';
    popup.style.zIndex = '50';
    popup.style.textAlign = 'center';
    popup.style.padding = '20px';

    popup.innerHTML = `
        <h2 style="color: #ffeb3b; font-size: 1.8rem; margin-bottom: 15px;">Alhamdulillah! 🌟</h2>
        <p style="color: #fff; font-size: 1.1rem; margin-bottom: 25px; line-height: 1.5;">
            Siap masuk ke <b>Level ${nextLevelData.level}</b>?<br>Cari huruf <b>${nextLevelData.nama} (${nextLevelData.huruf})</b>!
        </p>
        <button id="btn-lanjut" style="background: linear-gradient(135deg, #00b09b, #96c93d); color: white; border: none; padding: 14px 40px; font-size: 1.2rem; font-weight: bold; border-radius: 50px; cursor: pointer; box-shadow: 0 5px 15px rgba(0,176,155,0.4);">
            Lanjut Bermain 🚀
        </button>
    `;

    gameArea.appendChild(popup);

    document.getElementById('btn-lanjut').addEventListener('click', function() {
        bicara(`Bismillahirrahmanirrahim, kita mulai cari huruf ${nextLevelData.nama}!`);
        
        updateBoard();
        popup.remove();
        isPaused = false;
        
        mulaiGameLoop();
    });
}
