const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const horseImg = new Image();
horseImg.src = 'assets/horse.jpg'; // Replace with your horse image
const obstacleImg = new Image();
obstacleImg.src = 'assets/obstacle.avif'; // Replace with your obstacle image

// Game variables
let horseX = 100;
let horseY = canvas.height - 180;  // Adjusted start height
let isJumping = false;
let jumpVelocity = 0;
let gravity = 0.4;
let score = 0;
let obstacles = [];
let obstacleSpeed = 2;
let gameSpeedIncrement = 0.01;
let gameOver = false;
let jumpBoost = -10; // Balanced jump boost
let canDoubleJump = true; // Allow one extra jump mid-air

// Key events for jumping with limited stacking
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !gameOver) {
    if (!isJumping) {
      isJumping = true;
      jumpVelocity = jumpBoost;
    } else if (canDoubleJump) {
      jumpVelocity = jumpBoost;
      canDoubleJump = false; // Allow one extra jump mid-air
    }
  }
});

// Function to handle horse movement
function updateHorse() {
  if (isJumping) {
    horseY += jumpVelocity;
    jumpVelocity += gravity;
    if (horseY >= canvas.height - 180) {
      horseY = canvas.height - 180;
      isJumping = false;
      canDoubleJump = true; // Reset double jump when landed
    }
  }
}

// Generate obstacles with variable height for realism
function generateObstacle() {
  let obstacleX = canvas.width;
  let obstacleY = canvas.height - 100;
  obstacles.push({ x: obstacleX, y: obstacleY });
}

// Update obstacles with parallax effect
function updateObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= obstacleSpeed;
    if (obstacles[i].x + 60 < 0) { // Clear obstacle when off screen
      obstacles.splice(i, 1);
      score++;
      if (score % 5 === 0) obstacleSpeed += gameSpeedIncrement; // Increment speed
    }

    // Check collision with realistic sizes
    if (
      horseX + 100 > obstacles[i].x &&  // Adjusted horse width
      horseX < obstacles[i].x + 50 &&   // Adjusted obstacle width
      horseY + 100 > obstacles[i].y     // Adjusted horse height
    ) {
      gameOver = true;
      document.getElementById('restartButton').style.display = 'block';
      return;
    }
  }

  if (Math.random() < 0.01) {
    generateObstacle();
  }
}

// Draw function with optimized rendering and background parallax
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw horse
  ctx.drawImage(horseImg, horseX, horseY, 100, 100);

  // Draw obstacles
  obstacles.forEach((obstacle) => ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, 50, 50));

  // Draw score
  ctx.font = '20px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText('Score: ' + score, 10, 20);
}

// Game loop
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
  // Reset game variables
  horseY = canvas.height - 180;
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
