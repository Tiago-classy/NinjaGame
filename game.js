
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dynamically set canvas dimensions to match container
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);


const horseImg = new Image();
horseImg.src = 'assets/horse.jpg'; // Replace with your horse image
const obstacleImg = new Image();
obstacleImg.src = 'assets/obstacle.avif'; // Replace with your obstacle image


// Game variables
let horseX = canvas.width * 0.1;
let horseY = canvas.height - 80;
let isJumping = false;
let jumpVelocity = 0;
let gravity = 0.4;
let score = 0;
let obstacles = [];
let obstacleSpeed = 2;
let gameSpeedIncrement = 0.01;
let gameOver = false;
let jumpBoost = -10;
let canDoubleJump = true;

// Handle jump controls for both keyboard and touch
function jump() {
  if (!gameOver) {
    if (!isJumping) {
      isJumping = true;
      jumpVelocity = jumpBoost;
    } else if (canDoubleJump) {
      jumpVelocity = jumpBoost;
      canDoubleJump = false; // Allow only one mid-air jump
    }
  }
}

// Add both keyboard and touch controls
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') jump();
});
canvas.addEventListener('touchstart', jump);

// Function to handle horse movement
function updateHorse() {
  if (isJumping) {
    horseY += jumpVelocity;
    jumpVelocity += gravity;
    if (horseY >= canvas.height - 80) {
      horseY = canvas.height - 80;
      isJumping = false;
      canDoubleJump = true;
    }
  }
}

// Generate obstacles with adjusted size for mobile
function generateObstacle() {
  let obstacleX = canvas.width;
  let obstacleY = canvas.height - 60;
  obstacles.push({ x: obstacleX, y: obstacleY });
}

// Update obstacles and check for collisions
function updateObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= obstacleSpeed;
    if (obstacles[i].x + 40 < 0) { // Reduced obstacle size for mobile
      obstacles.splice(i, 1);
      score++;
      if (score % 5 === 0) obstacleSpeed += gameSpeedIncrement;
    }

    // Check collision
    if (
      horseX + 80 > obstacles[i].x &&
      horseX < obstacles[i].x + 40 &&
      horseY + 80 > obstacles[i].y
    ) {
      gameOver = true;
      document.getElementById('restartButton').style.display = 'block';
      return;
    }
  }

  if (Math.random() < 0.02) {
    generateObstacle();
  }
}

// Draw function with responsive size
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(horseImg, horseX, horseY, 80, 80);
  obstacles.forEach((obstacle) => ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, 40, 40));

  // Draw score
  ctx.font = '20px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText('Score: ' + score, 10, 20);
}

// Game loop with optimized frame rate for mobile
function gameLoop() {
  if (!gameOver) {
    updateHorse();
    updateObstacles();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// Restart the game
function restartGame() {
  horseY = canvas.height - 80;
  isJumping = false;
  jumpVelocity = 0;
  score = 0;
  obstacles = [];
  obstacleSpeed = 2;
  gameOver = false;
  jumpBoost = -10;
  canDoubleJump = true;
  document.getElementById('restartButton').style.display = 'none';
  gameLoop();
}

// Start the game
gameLoop();
