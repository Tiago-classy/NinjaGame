const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const horseImg = new Image();
horseImg.src = 'assets/horse.jpg'; // Replace with your horse image
const obstacleImg = new Image();
obstacleImg.src = 'assets/obstacle.avif'; // Replace with your obstacle image

// Game variables
let horseX = 100;
let horseY = canvas.height - 200;
let isJumping = false;
let jumpVelocity = 0;
let gravity = 0.5;
let score = 0;
let obstacles = [];
let obstacleSpeed = 2;
let gameSpeedIncrement = 0.01; // Speed increment factor
let gameOver = false;
let jumpBoost = -12; // Higher boost on space press

// Key events for jumping higher with multiple presses
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !gameOver) {
    isJumping = true;
    jumpVelocity = jumpBoost; // Apply a stronger jump on each space press
    jumpBoost -= 0.5; // Increase boost for each press
  }
});

// Function to handle horse movement
function updateHorse() {
  if (isJumping) {
    horseY += jumpVelocity;
    jumpVelocity += gravity;
    if (horseY >= canvas.height - 200) {
      horseY = canvas.height - 200;
      isJumping = false;
      jumpBoost = -12; // Reset boost when horse lands
    }
  }
}

// Generate obstacles with increased size
function generateObstacle() {
  let obstacleX = canvas.width;
  let obstacleY = canvas.height - 100;
  obstacles.push({ x: obstacleX, y: obstacleY });
}

// Update obstacles
function updateObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= obstacleSpeed;
    if (obstacles[i].x + 60 < 0) { // Increased obstacle width
      obstacles.splice(i, 1);
      score++;
      // Increment speed every 5 points
      if (score % 5 === 0) obstacleSpeed += gameSpeedIncrement;
    }

    // Check collision with larger horse size
    if (
      horseX + 120 > obstacles[i].x && // Increased horse width
      horseX < obstacles[i].x + 60 &&  // Increased obstacle width
      horseY + 100 > obstacles[i].y    // Increased horse height
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

// Draw function with larger horse and obstacles
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(horseImg, horseX, horseY, 120, 100); // Increased horse size
  obstacles.forEach((obstacle) => ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, 60, 60)); // Increased obstacle size

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
  horseY = canvas.height - 200;
  isJumping = false;
  jumpVelocity = 0;
  score = 0;
  obstacles = [];
  obstacleSpeed = 2;
  gameOver = false;
  jumpBoost = -12; // Reset jump boost
  document.getElementById('restartButton').style.display = 'none';
  gameLoop();
}

// Start the game
gameLoop();
