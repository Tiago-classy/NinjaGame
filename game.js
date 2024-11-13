
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dynamically resize the canvas based on the container
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Load images
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
let gameSpeedIncrement = 0.09;
let gameOver = false;
let jumpBoost = -10;
let canDoubleJump = true;

// Adjust horse and obstacle size based on screen width
let horseSize = canvas.width < 250 ? 30 : 40;
let obstacleSize = canvas.width < 500 ? 20 : 30;

// Jump function to support both desktop and mobile controls
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

// Add event listeners for desktop (keydown) and mobile (touchstart & pointerdown for Safari)
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') jump();
});
canvas.addEventListener('touchstart', jump, { passive: true });
canvas.addEventListener('pointerdown', jump, { passive: true });

// Function to handle horse movement
function updateHorse() {
  if (isJumping) {
    horseY += jumpVelocity;
    jumpVelocity += gravity;
    if (horseY >= canvas.height - horseSize) {
      horseY = canvas.height - horseSize;
      isJumping = false;
      canDoubleJump = true;
    }
  }
}

// Function to create obstacles with adjusted sizes for screen size
function generateObstacle() {
  let obstacleX = canvas.width;
  let obstacleY = canvas.height - obstacleSize;
  obstacles.push({ x: obstacleX, y: obstacleY });
}

// Update obstacles and check for collisions
function updateObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= obstacleSpeed;
    if (obstacles[i].x + obstacleSize < 0) {
      obstacles.splice(i, 1);
      score++;
      if (score % 5 === 0) obstacleSpeed += gameSpeedIncrement;
    }

    // Collision detection with responsive element sizes
    if (
      horseX + horseSize > obstacles[i].x &&
      horseX < obstacles[i].x + obstacleSize &&
      horseY + horseSize > obstacles[i].y
    ) {
      gameOver = true;
      document.getElementById('restartButton').style.display = 'block';
      document.getElementById('fullExperienceButton').style.display = 'block';
      return;
    }
  }

  if (Math.random() < 0.02) {
    generateObstacle();
  }
}

// Draw function to render the game elements with adjusted sizes
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(horseImg, horseX, horseY, horseSize, horseSize);
  obstacles.forEach((obstacle) => ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacleSize, obstacleSize));

  // Draw score
  ctx.font = '20px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText('Score: ' + score, 10, 20);
}

// Game loop for running the game
function gameLoop() {
  if (!gameOver) {
    updateHorse();
    updateObstacles();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// Restart function to reset game state
function restartGame() {
  horseY = canvas.height - horseSize;
  isJumping = false;
  jumpVelocity = 0;
  score = 0;
  obstacles = [];
  obstacleSpeed = 2;
  gameOver = false;
  jumpBoost = -10;
  canDoubleJump = true;
  document.getElementById('restartButton').style.display = 'none';
  document.getElementById('fullExperienceButton').style.display = 'none';
  gameLoop();
}

// Start the game
gameLoop();
