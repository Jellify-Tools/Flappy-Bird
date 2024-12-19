const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Game variables
let bird = { x: 50, y: 300, size: 20, velocity: 0 };
let gravity = 0.6;
let lift = -10;
let pipes = [];
let frameCount = 0;
let score = 0;

// Keypress event
document.addEventListener("keydown", () => {
  bird.velocity = lift;
});

// Create pipes
function createPipe() {
  const gap = 120;
  const topHeight = Math.random() * (canvas.height / 2);
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap,
    width: 40,
  });
}

// Draw bird
function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.size, bird.size);
}

// Draw pipes
function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });
}

// Update game state
function updateGame() {
  // Bird movement
  bird.velocity += gravity;
  bird.y += bird.velocity;

  // Add pipes
  if (frameCount % 100 === 0) {
    createPipe();
  }

  // Update pipes
  pipes.forEach((pipe, index) => {
    pipe.x -= 2;
    if (pipe.x + pipe.width < 0) {
      pipes.splice(index, 1);
      score++;
    }

    // Collision detection
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.size > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.size > pipe.bottom)
    ) {
      resetGame();
    }
  });

  // Check if bird hits the ground or ceiling
  if (bird.y + bird.size > canvas.height || bird.y < 0) {
    resetGame();
  }
}

// Reset game
function resetGame() {
  bird.y = 300;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frameCount = 0;
}

// Draw score
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  updateGame();
  drawScore();
  frameCount++;
  requestAnimationFrame(gameLoop);
}

gameLoop();
