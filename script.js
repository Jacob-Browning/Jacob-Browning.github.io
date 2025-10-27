const container = document.querySelector('.container');
const totalCells = 35 * 55;
const cells = [];

// Create grid
for (let i = 0; i < totalCells; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  container.appendChild(cell);
  cells.push(cell);
}

let mouseX = 0;
let mouseY = 0;
let rect;
let trail = []; // stores recent mouse positions for fading trail

document.addEventListener('mousemove', (e) => {
  rect = container.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;

  trail.push({ x: mouseX, y: mouseY, time: Date.now() });
  if (trail.length > 25) trail.shift(); // keep trail short
});

// Helper: linear interpolation
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function animate() {
  requestAnimationFrame(animate);

  if (!rect) return;

  const cols = 55;
  const rows = 35;
  const cellWidth = rect.width / cols;
  const cellHeight = rect.height / rows;
  const now = Date.now();

  cells.forEach((cell, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * cellWidth + cellWidth / 2;
    const y = row * cellHeight + cellHeight / 2;

    let intensity = 0;

    // Combine influence from all points in the trail
    trail.forEach((pos) => {
      const age = (now - pos.time) / 1000; // seconds
      const fade = Math.max(0, 1 - age * 2); // trail fades over 0.5s
      const dx = x - pos.x;
      const dy = y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / 120); // radius of effect
      intensity += influence * fade;
    });

    intensity = Math.min(1, intensity);

    // Interpolate from dark gray (#222) to white (#fff)
    const base = 34; // 0x22
    const r = Math.floor(lerp(base, 255, intensity));
    const g = Math.floor(lerp(base, 255, intensity));
    const b = Math.floor(lerp(base, 255, intensity));

    cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  });
}

animate();