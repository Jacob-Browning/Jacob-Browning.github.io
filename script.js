const container = document.querySelector('.container');
let cols, rows;
let cells = [];

// Function to create dot grid based on window size
function createGrid() {
  container.innerHTML = '';
  cells = [];

  const cellSize = 20; // approximate pixel size per cell
  cols = Math.floor(window.innerWidth / cellSize);
  rows = Math.floor(window.innerHeight / cellSize);

  const totalCells = cols * rows;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    container.appendChild(cell);
    cells.push(cell);
  }
}

createGrid();
window.addEventListener('resize', createGrid);

let rect;
let trail = [];

// Mouse and touch tracking
function addTrail(x, y) {
  trail.push({ x, y, time: Date.now() });
  if (trail.length > 25) trail.shift();
}

// Mouse move
document.addEventListener('mousemove', (e) => {
  rect = container.getBoundingClientRect();
  addTrail(e.clientX - rect.left, e.clientY - rect.top);
});

// Touch move
document.addEventListener('touchmove', (e) => {
  rect = container.getBoundingClientRect();
  for (let touch of e.touches) {
    addTrail(touch.clientX - rect.left, touch.clientY - rect.top);
  }
}, { passive: true });

// Linear interpolation helper
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Animate the dot grid
function animate() {
  requestAnimationFrame(animate);
  if (!rect) return;

  const cellWidth = rect.width / cols;
  const cellHeight = rect.height / rows;
  const now = Date.now();

  cells.forEach((cell, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * cellWidth + cellWidth / 2;
    const y = row * cellHeight + cellHeight / 2;

    let intensity = 0;

    trail.forEach((pos) => {
      const age = (now - pos.time) / 1000;
      const fade = Math.max(0, 1 - age * 2);
      const dx = x - pos.x;
      const dy = y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / 120);
      intensity += influence * fade;
    });

    intensity = Math.min(1, intensity);

    const base = 34;
    const r = Math.floor(lerp(base, 255, intensity));
    const g = Math.floor(lerp(base, 255, intensity));
    const b = Math.floor(lerp(base, 255, intensity));

    cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  });
}

animate();
