// Configuration
const canvas = document.getElementById('visualizerCanvas');
const ctx = canvas.getContext('2d');
const audioFile = document.getElementById('audioFile');
const audio = document.getElementById('audio');
const uploadBtn = document.getElementById('uploadBtn');
const micBtn = document.getElementById('micBtn');
const audioPlayer = document.getElementById('audioPlayer');
const trackInfo = document.getElementById('trackInfo');
const overlayText = document.getElementById('overlayText');

// Audio context et analyseur
let audioContext;
let analyser;
let dataArray;
let bufferLength;
let source;
let isPlaying = false;
let isMicActive = false;

// Options de visualisation
let currentMode = 'bars';
let rainbowMode = true;
let pulseMode = true;
let trailMode = false;
let hue = 0;

// Redimensionner le canvas
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initialiser l'audio context
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }
}

// Charger un fichier audio
uploadBtn.addEventListener('click', () => {
    audioFile.click();
});

audioFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        audio.src = url;
        trackInfo.textContent = file.name;
        audioPlayer.style.display = 'block';
        
        initAudioContext();
        
        if (source) {
            source.disconnect();
        }
        
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        audio.play();
        isPlaying = true;
        animate();
    }
});

// Utiliser le microphone
micBtn.addEventListener('click', async () => {
    if (!isMicActive) {
        try {
            initAudioContext();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            if (source) {
                source.disconnect();
            }
            
            source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            
            isMicActive = true;
            micBtn.classList.add('active');
            micBtn.textContent = '⏹️ Arrêter le micro';
            audioPlayer.style.display = 'none';
            trackInfo.textContent = 'Microphone actif';
            
            animate();
        } catch (err) {
            alert('Erreur d\'accès au microphone : ' + err.message);
        }
    } else {
        if (source) {
            source.disconnect();
        }
        isMicActive = false;
        micBtn.classList.remove('active');
        micBtn.textContent = '🎤 Utiliser le microphone';
    }
});

// Changement de mode de visualisation
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
    });
});

// Options de couleur
document.getElementById('rainbowMode').addEventListener('change', (e) => {
    rainbowMode = e.target.checked;
});

document.getElementById('pulseMode').addEventListener('change', (e) => {
    pulseMode = e.target.checked;
});

document.getElementById('trailMode').addEventListener('change', (e) => {
    trailMode = e.target.checked;
});

// Fonctions de visualisation
function drawBars() {
    analyser.getByteFrequencyData(dataArray);
    
    if (!trailMode) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        
        if (rainbowMode) {
            ctx.fillStyle = `hsl(${(hue + i * 0.5) % 360}, 100%, 50%)`;
        } else {
            ctx.fillStyle = `rgb(${dataArray[i]}, 50, 200)`;
        }
        
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }
}

function drawCircle() {
    analyser.getByteFrequencyData(dataArray);
    
    if (!trailMode) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 4;
    
    for (let i = 0; i < bufferLength; i++) {
        const angle = (i / bufferLength) * Math.PI * 2;
        const barHeight = (dataArray[i] / 255) * 100;
        
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        
        if (rainbowMode) {
            ctx.strokeStyle = `hsl(${(hue + i * 0.5) % 360}, 100%, 50%)`;
        } else {
            ctx.strokeStyle = `rgb(${dataArray[i]}, 50, 200)`;
        }
        
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function drawWave() {
    analyser.getByteTimeDomainData(dataArray);
    
    if (!trailMode) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    ctx.lineWidth = 3;
    ctx.strokeStyle = rainbowMode ? `hsl(${hue}, 100%, 50%)` : 'rgb(0, 200, 255)';
    ctx.beginPath();
    
    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
    }
    
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
}

function drawSpiral() {
    analyser.getByteFrequencyData(dataArray);
    
    if (!trailMode) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.beginPath();
    
    for (let i = 0; i < bufferLength; i++) {
        const angle = (i / bufferLength) * Math.PI * 8;
        const radius = (i / bufferLength) * Math.min(canvas.width, canvas.height) / 2;
        const intensity = (dataArray[i] / 255) * 50;
        
        const x = centerX + Math.cos(angle) * (radius + intensity);
        const y = centerY + Math.sin(angle) * (radius + intensity);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.strokeStyle = rainbowMode ? `hsl(${hue}, 100%, 50%)` : 'rgb(255, 0, 255)';
    ctx.lineWidth = 3;
    ctx.stroke();
}

function drawParticles() {
    analyser.getByteFrequencyData(dataArray);
    
    if (!trailMode) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    for (let i = 0; i < bufferLength; i += 3) {
        const x = (i / bufferLength) * canvas.width;
        const y = canvas.height / 2;
        const radius = (dataArray[i] / 255) * 10;
        const offsetY = (Math.sin(i + hue / 10) * (dataArray[i] / 255)) * 100;
        
        ctx.beginPath();
        ctx.arc(x, y + offsetY, radius, 0, Math.PI * 2);
        
        if (rainbowMode) {
            ctx.fillStyle = `hsl(${(hue + i) % 360}, 100%, 50%)`;
        } else {
            ctx.fillStyle = `rgba(${dataArray[i]}, 100, 255, 0.8)`;
        }
        
        ctx.fill();
    }
}

function drawRetro() {
    analyser.getByteFrequencyData(dataArray);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grille rétro style années 80
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.3)';
    ctx.lineWidth = 1;
    
    // Lignes horizontales
    for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Barres spectrales avec effet 3D
    const barCount = 32;
    const barWidth = canvas.width / barCount;
    
    for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const barHeight = (dataArray[dataIndex] / 255) * canvas.height * 0.7;
        const x = i * barWidth;
        const y = canvas.height - barHeight;
        
        // Ombre
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(x + 5, y + 5, barWidth - 10, barHeight);
        
        // Barre principale
        const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
        gradient.addColorStop(0, `hsl(${(hue + i * 10) % 360}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${(hue + i * 10) % 360}, 100%, 20%)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 10, barHeight);
        
        // Bordure
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth - 10, barHeight);
    }
}

// Animation principale
function animate() {
    if (!isPlaying && !isMicActive) return;
    
    requestAnimationFrame(animate);
    
    hue += 1;
    if (hue > 360) hue = 0;
    
    // Choisir le mode de visualisation
    switch (currentMode) {
        case 'bars':
            drawBars();
            break;
        case 'circle':
            drawCircle();
            break;
        case 'wave':
            drawWave();
            break;
        case 'spiral':
            drawSpiral();
            break;
        case 'particles':
            drawParticles();
            break;
        case 'retro':
            drawRetro();
            break;
    }
    
    // Mode pulsation pour le texte overlay
    if (pulseMode && analyser) {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const scale = 1 + (average / 255) * 0.5;
        overlayText.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
}

// Gérer la pause/lecture
audio.addEventListener('play', () => {
    isPlaying = true;
    animate();
});

audio.addEventListener('pause', () => {
    isPlaying = false;
});

// Message de bienvenue
setTimeout(() => {
    overlayText.style.opacity = '0.3';
}, 2000);
