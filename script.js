const micBtn = document.getElementById('micBtn');
const flames = document.querySelectorAll('.flame');
const candlePhase = document.getElementById('candle-phase');
const gatePhase = document.getElementById('gate-phase');
const gamePhase = document.getElementById('game-phase');
const cardPhase = document.getElementById('card-phase');
const music = document.getElementById("lagu");
const modal = document.getElementById("bonusModal");
const bonusVideo = document.getElementById("bonusVideo");
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const candles = document.querySelectorAll('.candle');

let isCandleOut = false;
let audioContext = null;
let microphoneStream = null;

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => { preloader.style.display = 'none'; }, 500);
});

function createBackgroundHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerHTML = '❤️'; 
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
    const duration = Math.random() * 3 + 4; 
    heart.style.animationDuration = duration + 's';
    document.getElementById('bgHearts').appendChild(heart);
    setTimeout(() => { heart.remove(); }, duration * 1000);
}
setInterval(createBackgroundHeart, 500); 

function checkAllCandles() {
    const allOff = Array.from(flames).every(flame => flame.classList.contains('flame-off'));
    if (allOff && !isCandleOut) {
        isCandleOut = true;
        micBtn.style.display = "none";
        stopMicrophone(); 
        if (music) { music.play().catch(() => console.log("Autoplay blocked")); }
        var duration = 2 * 1000;
        var end = Date.now() + duration;
        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());

        setTimeout(() => {
            candlePhase.style.opacity = "0"; 
            setTimeout(() => {
                candlePhase.style.display = "none"; 
                showGate();
            }, 1000);
        }, 2000);
    }
}

function matikanLilin(flame) {
    if (flame && !flame.classList.contains('flame-off')) {
        flame.classList.add('flame-off');
        checkAllCandles();
    }
}
candles.forEach(candle => {
    const flame = candle.querySelector('.flame');
    candle.addEventListener('click', (e) => {
        e.stopPropagation(); 
        matikanLilin(flame);
    });
    if (flame) {
        flame.addEventListener('click', (e) => {
            e.stopPropagation();
            matikanLilin(flame);
        });
    }
});

function showGate() { gatePhase.style.display = 'flex'; }
function moveBtnNo() {
    if (btnNo.parentNode !== document.body) {
        document.body.appendChild(btnNo);
    }
    const x = Math.random() * (window.innerWidth - btnNo.offsetWidth - 20);
    const y = Math.random() * (window.innerHeight - btnNo.offsetHeight - 20);
    btnNo.style.position = 'fixed'; 
    btnNo.style.left = x + 'px';
    btnNo.style.top = y + 'px';
    btnNo.style.zIndex = "9999"; 
}
btnNo.addEventListener('mouseover', moveBtnNo);
btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); moveBtnNo(); });
btnNo.addEventListener('click', (e) => { e.preventDefault(); moveBtnNo(); });
btnYes.addEventListener('click', () => { 
    gatePhase.style.display = 'none'; 
    btnNo.style.display = "none"; 
    startGame(); 
});
const mazeMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 3, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let playerPos = { x: 1, y: 1 };
const mazeContainer = document.getElementById('maze-container');

function startGame() {
    gamePhase.style.display = 'flex';
    drawMaze();
    document.addEventListener('keydown', handleKeyPress);
}

function drawMaze() {
    mazeContainer.innerHTML = '';
    for (let y = 0; y < mazeMap.length; y++) {
        for (let x = 0; x < mazeMap[y].length; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (mazeMap[y][x] === 1) cell.classList.add('wall');
            if (x === playerPos.x && y === playerPos.y) {
                cell.classList.add('player');
                cell.innerHTML = '👧';
            }
            if (mazeMap[y][x] === 3) {
                cell.classList.add('goal');
                cell.innerHTML = '👦';
            }
            mazeContainer.appendChild(cell);
        }
    }
}

function movePlayer(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    if (mazeMap[newY][newX] !== 1) {
        playerPos = { x: newX, y: newY };
        drawMaze();
        if (mazeMap[newY][newX] === 3) {
            const winModal = document.getElementById('win-modal');
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            winModal.style.display = 'flex'; 
            setTimeout(() => {
                winModal.classList.add('active'); 
            }, 10);
        }
    }
}

function handleKeyPress(e) {
    if (e.key === 'ArrowUp') movePlayer(0, -1);
    else if (e.key === 'ArrowDown') movePlayer(0, 1);
    else if (e.key === 'ArrowLeft') movePlayer(-1, 0);
    else if (e.key === 'ArrowRight') movePlayer(1, 0);
}

document.getElementById('upBtn').addEventListener('click', () => movePlayer(0, -1));
document.getElementById('downBtn').addEventListener('click', () => movePlayer(0, 1));
document.getElementById('leftBtn').addEventListener('click', () => movePlayer(-1, 0));
document.getElementById('rightBtn').addEventListener('click', () => movePlayer(1, 0));

function goToCard() {
    gamePhase.style.display = 'none';
    cardPhase.style.display = 'flex';
    void cardPhase.offsetWidth; 
    setTimeout(() => {
        cardPhase.style.opacity = "1";
    }, 50);
}

micBtn.addEventListener('click', async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Browser tidak mendukung akses mic. Silakan klik lilinnya satu per satu ya!");
        return;
    }
    try {
        microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(microphoneStream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
        analyser.smoothingTimeConstant = 0.8; 
        analyser.fftSize = 1024;
        microphone.connect(analyser); 
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
        micBtn.innerText = "Tiup Sekarang! 🌬️";
        scriptProcessor.onaudioprocess = function() {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0; 
            for (let i = 0; i < array.length; i++) values += array[i];
            if ((values / array.length) > 30) { 
                flames.forEach(flame => setTimeout(() => { 
                    flame.classList.add('flame-off'); 
                    checkAllCandles(); 
                }, Math.random() * 500));
            }
        };
    } catch (err) { 
        console.log(err);
        alert("Gagal akses mic. Klik lilinnya aja ya manual!"); 
    }
});

function stopMicrophone() {
    if (audioContext) {
        audioContext.close(); 
    }
    if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
    }
}

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function updateNavButtons() {
    prevBtn.disabled = (currentSlide === 0);
    if (currentSlide === slides.length - 1) {
        nextBtn.disabled = true; nextBtn.style.opacity = "0";
    } else {
        nextBtn.disabled = false;
        if (currentSlide === 0) nextBtn.style.opacity = "0";
        else nextBtn.style.opacity = "1";
    }
}

function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
                if (slide.id === 'memorySlide') {
                    setTimeout(startTimelineAnimation, 300); 
                }
            }
        });
        updateNavButtons();
}

function nextSlide() { if (currentSlide < slides.length - 1) { currentSlide++; showSlide(currentSlide); } }
function prevSlide() { if (currentSlide > 0) { currentSlide--; showSlide(currentSlide); } }

updateNavButtons();

function showBonus() { 
    modal.classList.add("open"); 
    setTimeout(() => {
        initScratch();
    }, 300); 
}

function closeBonus() { if(bonusVideo) bonusVideo.pause(); modal.classList.remove("open"); if(music) music.play(); }

let letterOpened = false;
function toggleLetter() { 
    const envelope = document.querySelector('.envelope-wrapper');
    envelope.classList.toggle('open');
    if (!letterOpened && envelope.classList.contains('open')) {
        letterOpened = true;
        const sourceText = document.getElementById('source-text').innerHTML;
        const typedTextElement = document.getElementById('typed-text');
        typedTextElement.innerHTML = "";
        let i = 0;
        setTimeout(() => {
            function typeWriter() {
                if (i < sourceText.length) {
                    if (sourceText.charAt(i) === '<') {
                        let tag = "";
                        while (sourceText.charAt(i) !== '>' && i < sourceText.length) {
                            tag += sourceText.charAt(i);
                            i++;
                        }
                        tag += '>'; 
                        i++;
                        typedTextElement.innerHTML += tag;
                    } else {
                        typedTextElement.innerHTML += sourceText.charAt(i);
                        i++;
                    }
                    setTimeout(typeWriter, 30); 
                }
            }
            typeWriter();
        }, 800); 
    }
}

const nextCardBtn = document.getElementById('nextCardBtn');
const winModal = document.getElementById('win-modal');

if (nextCardBtn) {
    nextCardBtn.addEventListener('click', () => {
        winModal.classList.remove('active'); 
        setTimeout(() => {
            winModal.style.display = 'none'; 
            goToCard(); 
        }, 400); 
    });
}

const memoryImages = document.querySelectorAll('.memories-grid img');
memoryImages.forEach(img => {
    img.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:1000;display:flex;justify-content:center;align-items:center;cursor:pointer;";
        const bigImg = document.createElement('img');
        bigImg.src = img.src;
        bigImg.style = "max-width:90%; max-height:90%; border-radius:10px; box-shadow:0 0 20px rgba(255,255,255,0.2); animation: popup 0.3s ease;";
        overlay.appendChild(bigImg);
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => overlay.remove());
    });
});

AOS.init({
    duration: 1000, 
    once: false,    
    mirror: true,
    container: '#memorySlide' 
});

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.classList.add('show'); 
        }
    });
}, { threshold: 0.1 });

function startTimelineAnimation() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach(item => {
        timelineObserver.observe(item);
    });
}

function claimCoupon(couponName) {
    const nomorHP = "6281230129867"; 
    let pesan = ""; 
    if (couponName.toLowerCase().includes("es cream")) {
        pesan = "Halo sayangg! 🍦 Aku mau claim kupon *Es Cream Gratis* dong! Nanti kalo kita ketemu kamu wajib membelikan tuan putri ini es cream yaaw.";
    } else if (couponName.toLowerCase().includes("pijat")) {
        pesan = "Sayanggg, badan aku pegel banget nih 🥺. Inget ya, nanti pas kita ketemu aku mau tagih kupon *Pijat VIP*-nya! Kamu harus mijetin aku pokoknya gamau tau💆‍♂️💆‍♀️";
    } else if (couponName.toLowerCase().includes("makan")) {
        pesan = "Aku mau claim voucher *Makan Enak* yaaw sayanggku. Siap-siap traktir aku makan kalo ketemu yaaw gaboleh nolak dan ga boleh ngelarang pokoknya 🍽️💖";
    } else {
        pesan = `Halo cintaku! Aku berhasil menang hadiah: "${couponName}" 🎉. Jangan pura-pura lupa ya, harus ditepati! 😘`;
    }
    window.open(`https://wa.me/${nomorHP}?text=${encodeURIComponent(pesan)}`, '_blank');
}

function initScratch() {
    const canvases = document.querySelectorAll('.scratch-canvas');
    canvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        canvas.width = 340; 
        canvas.height = 90; 
        ctx.globalCompositeOperation = 'source-over';
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#E8E8E8');   
        gradient.addColorStop(0.5, '#C0C0C0'); 
        gradient.addColorStop(1, '#E8E8E8');   
        ctx.fillStyle = gradient; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.shadowColor = "rgba(255,255,255,0.8)";
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#555';
        ctx.font = "bold 16px Poppins, sans-serif"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✨ GOSOK DISINI ✨", canvas.width / 2, canvas.height / 2);
        ctx.shadowBlur = 0; 
        ctx.globalCompositeOperation = 'destination-out';
        function checkScratchProgress() {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let transparentPixels = 0;
            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] === 0) {
                    transparentPixels++;
                }
            }
            const totalPixels = canvas.width * canvas.height;
            const percentage = (transparentPixels / totalPixels) * 100;
            if (percentage > 40) {
                canvas.classList.add('revealed'); 
                if (typeof confetti === 'function') {
                     confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 }, scalar: 0.5 });
                }
            }
        }
        let isDrawing = false;
        function startScratch(e) { isDrawing = true; scratch(e); }
        function endScratch() { 
            isDrawing = false; 
            checkScratchProgress(); 
        }
        function scratch(e) {
            if (!isDrawing) return;
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            let x, y;
            if(e.type.includes('touch')) {
                x = e.touches[0].clientX - rect.left;
                y = e.touches[0].clientY - rect.top;
            } else {
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            }
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2); 
            ctx.fill();
        }
        canvas.onmousedown = startScratch;
        canvas.onmouseup = endScratch;
        canvas.onmouseleave = endScratch;
        canvas.onmousemove = scratch;
        canvas.ontouchstart = startScratch;
        canvas.ontouchend = endScratch;
        canvas.ontouchmove = scratch;
    });
}

const musicBtn = document.getElementById('musicControl');
let isPlaying = false;
musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        music.pause();
        musicBtn.innerHTML = '🔇'; 
        musicBtn.classList.add('paused');
    } else {
        music.play();
        musicBtn.innerHTML = '🎵'; 
        musicBtn.classList.remove('paused');
    }
    isPlaying = !isPlaying;
});

music.onplay = () => {
    isPlaying = true;
    musicBtn.innerHTML = '🎵';
    musicBtn.classList.remove('paused');
};

music.onpause = () => {
    isPlaying = false;
    musicBtn.innerHTML = '🔇';
    musicBtn.classList.add('paused');
};