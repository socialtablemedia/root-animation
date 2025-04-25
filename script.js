const canvas = document.getElementById('rootsCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Track mouse position
let mouse = { x: null, y: null, active: false };

// Track scroll direction
let lastScrollY = window.scrollY;
let isScrollingDown = true;

canvas.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.active = true;
});

canvas.addEventListener('mouseleave', () => {
  mouse.active = false;
});

class Root {
  constructor(x, y, timer) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 2;
    this.maxSize = Math.random() * 30 + 50;
    this.growthRate = Math.random() * 0.5 + 0.2;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.timer = timer;
    this.retracting = false;
    this.branches = [];
  }

  grow() {
    if (this.size >= this.maxSize || this.timer <= 0 || this.size <= 0) return;

    if (this.retracting) {
      this.size -= this.growthRate * 2;
      if (this.size <= 0) return;
    } else {
      this.size += this.growthRate;
    }

    this.x += this.speedX;
    this.y += this.speedY;

    // Draw the root
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.bezierCurveTo(
      this.x - this.speedX * 2,
      this.y - this.speedY * 2,
      this.x + this.speedX * 2,
      this.y + this.speedY * 2,
      this.x + this.speedX,
      this.y + this.speedY
    );
    ctx.lineWidth = Math.max(this.size, 0);
    ctx.strokeStyle = '#323728';
    ctx.stroke();
    ctx.closePath();

    // Create branches
    if (!this.retracting && Math.random() < 0.2 && this.branches.length < 3) {
      const branch = new Root(this.x, this.y, this.timer - 1);
      branch.speedX = this.speedX * (Math.random() - 0.5);
      branch.speedY = this.speedY * (Math.random() - 0.5);
      this.branches.push(branch);
    }

    this.branches.forEach((branch) => {
      branch.retracting = this.retracting;
      branch.grow();
    });

    this.timer -= 1;
    if (this.timer > 0) {
      requestAnimationFrame(() => this.grow());
    }
  }
}

function createRoots(x, y, duration) {
  const root = new Root(x, y, duration);
  root.grow();
}

function growRootsAcrossScreen() {
  const duration = 300;
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    createRoots(x, y, duration);
  }
}

function retractRootsAcrossScreen() {
  const duration = 300;
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const root = new Root(x, y, duration);
    root.retracting = true;
    root.grow();
  }
}

function createMouseRoots() {
  if (mouse.active) {
    createRoots(mouse.x, mouse.y, 100);
  }
}

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  isScrollingDown = currentScrollY > lastScrollY;

  if (isScrollingDown) {
    growRootsAcrossScreen();
  } else {
    retractRootsAcrossScreen();
  }

  lastScrollY = currentScrollY;
});

function animate() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  createMouseRoots();
  requestAnimationFrame(animate);
}

growRootsAcrossScreen();
animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
