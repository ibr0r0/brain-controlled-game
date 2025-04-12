const canvas = document.getElementById('eye_game');
const ctx = canvas.getContext('2d');

let boxX = 175;
let dotX = 200;

const boxY = 180;
const boxSize = 50;
const moveStep = 10;
const dotSpeed = 6;

let leftSignal = 0;
let rightSignal = 0;

const threshold = 100; 

function drawBox() {
  ctx.fillStyle = '#00FFFF';
  ctx.fillRect(boxX, boxY, boxSize, boxSize);
}

function drawDot() {
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(dotX, boxY + boxSize + 40, 6, 0, 2 * Math.PI);
  ctx.fill();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBox();
  drawDot();

  const diff = rightSignal - leftSignal;

  ctx.fillStyle = 'white';
  ctx.font = '14px monospace';
  ctx.fillText(`Left: ${leftSignal.toFixed(2)}  Right: ${rightSignal.toFixed(2)}  Δ: ${diff.toFixed(2)}`, 10, 390);

  requestAnimationFrame(update);
}

update();

const socket = new WebSocket('ws://localhost:8080');

socket.onmessage = (event) => {
  const raw = event.data.trim();
  const parts = raw.split(',');

  const left = parseFloat(parts[2]);
  const right = parseFloat(parts[3]);

  if (isNaN(left) || isNaN(right)) return;

  leftSignal = left;
  rightSignal = right;

  const diff = right - left;

  if (diff > threshold) {
    dotX += dotSpeed;
    boxX += moveStep;
  } else if (diff < -threshold) {
    dotX -= dotSpeed;
    boxX -= moveStep;
  }

  if (dotX < 0) dotX = 0;
  if (dotX > 400) dotX = 400;

  if (boxX < 0) boxX = 0;
  if (boxX + boxSize > 400) boxX = 400 - boxSize;
};
