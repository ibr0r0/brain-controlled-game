const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let birdY = 300;
let velocity = 0;
const gravity = 0.6;
const lift = -10;

let alphaBaseline = 0;
let collectingBaseline = true;
let baselineAlphaSamples = [];
let baselineStartTime = Date.now();

let showBlink = false;
let blinkTimeout = null;


let latestAlpha = 0;


// تحميل صورة العصفور
const birdImg = new Image();
birdImg.src = 'bird.png';

// رسم العصفور
function drawBird() {
  ctx.drawImage(birdImg, 85, birdY - 15, 50, 50); // حجم 30x30
}

// التحديث المستمر
function update() {
  velocity += gravity;
  birdY += velocity;

  if (birdY > 585) {
    birdY = 585;
    velocity = 0;
  }
  if (birdY < 0) {
    birdY = 0;
    velocity = 0;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();

  if (collectingBaseline) {
    ctx.fillStyle = 'white';
    ctx.font = '20px sans-serif';
    ctx.fillText('Calibrating... Please relax', 80, 50);
  }

  if (showBlink) {
    ctx.font = '40px sans-serif';
    ctx.fillStyle = 'cyan';
    ctx.fillText('👁️‍🗨️', 330, 50);
  }

  requestAnimationFrame(update);
}

update();


ctx.fillStyle = 'black';
ctx.font = '16px monospace';
ctx.fillText(`Alpha: ${latestAlpha.toFixed(2)}`, 20, 580);
ctx.fillText(`Baseline: ${alphaBaseline.toFixed(2)}`, 160, 580);
ctx.fillText(`Threshold: ${(alphaBaseline * 1.4).toFixed(2)}`, 300, 580);

// WebSocket لتوصيل البيانات
const socket = new WebSocket('ws://localhost:8080');

socket.onmessage = (event) => {
  const raw = event.data.trim();
  const parts = raw.split(',');

  const alpha = parseFloat(parts[2]); // تأكد أن هذا هو Alpha من القناة الصحيحة

  if (isNaN(alpha)) return;

  if (collectingBaseline) {
    baselineAlphaSamples.push(alpha);

    if (Date.now() - baselineStartTime > 5000) {
      const sum = baselineAlphaSamples.reduce((a, b) => a + b, 0);
      alphaBaseline = sum / baselineAlphaSamples.length;
      collectingBaseline = false;
      console.log("✅ Alpha Baseline:", alphaBaseline.toFixed(2));
    }
    return;
  }

  const threshold = alphaBaseline * 1.4;
  if (alpha > threshold) {
    velocity = lift;
  }

  // بلينك مؤقت بناءً على spike
  if (alpha > alphaBaseline * 2.0) {
    showBlink = true;
    clearTimeout(blinkTimeout);
    blinkTimeout = setTimeout(() => {
      showBlink = false;
    }, 500);
  }
};
