// Select canvas and set up context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let score = 0;
let powerUps = [];

// Player settings
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    color: "cyan"
};

// Bullet array
let bullets = [];

// Enemy array
let enemies = [];

// Controls
let keys = {};

const playerImg = new Image();
playerImg.src = "images/player.png";

const bossImg = new Image();
bossImg.src = "images/boss.png";

const enemyImg = new Image();
enemyImg.src = "images/enemy.png";

const powerUpImg = new Image()  ;
powerUpImg.src = "images/gold.png";

// add sounds in the game
const shootSound = new Audio("media/shoot.wav");
const explodeSound = new Audio("media/explosion.wav");
const powerUpSound = new Audio("media/powerup.mp3");
const bgMusic = new Audio("media/movement.mp3");
bgMusic.loop = true;
bgMusic.play();

// Event Listeners for movement and shooting
document.addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (e.code === "Space") {
        bullets.push({ x: player.x + player.width / 2 - 5, y: player.y, width: 10, height: 20, color: "red", speed: 5 });
        shootSound.play(); // play sound when shooting
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

// Function to draw the player
function drawPlayer() {
    // ctx.fillStyle = player.color;
    // ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// Function to update player movement
function movePlayer() {
    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys["ArrowRight"] && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
}

// Function to draw bullets
// function drawBullets() {
//     bullets.forEach((bullet, index) => {
//         bullet.y -= bullet.speed;
//         ctx.fillStyle = bullet.color;
//         ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

//         // Remove bullet if it goes out of bounds
//         if (bullet.y < 0) {
//             bullets.splice(index, 1);
//         }
//     });
// }


// Function to draw bullets and remove them if they leave the screen
function drawBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // ❌ FIXED: Bullets just disappear, no game over
        if (bullet.y < 0) {
            bullets.splice(index, 1); // Remove bullet but do nothing else
        }
    });
}

// Function to create enemies
// function spawnEnemies() {
//     if (Math.random() < 0.02) {
//         enemies.push({ x: Math.random() * (canvas.width - 40), y: 0, width: 40, height: 40, color: "green", speed: 2 });
//     }
// }


function spawnEnemies() {
    if (Math.random() < 0.02) {
        let type = Math.random() < 0.8 ? "normal" : "boss"; // 80% normal, 20% boss
        enemies.push({
            x: Math.random() * (canvas.width - 40),
            y: 0,
            width: type === "boss" ? 60 : 40,
            height: type === "boss" ? 60 : 40,
            color: type === "boss" ? "purple" : "green",
            speed: type === "boss" ? 1.5 : 2.5,
            type: type,
            health: type === "boss" ? 3 : 1 // Boss requires 3 hits to die
        });
    }
}

function spawnPowerUp() {
    if (Math.random() < 0.005) { // 0.5% chance per frame
        powerUps.push({
            x: Math.random() * (canvas.width - 20),
            y: 0,
            width: 20,
            height: 20,
            color: "gold",
            type: Math.random() < 0.5 ? "doubleShot" : "bonusScore", // Two types
            speed: 2
        });
    }
}

// // Function to draw enemies
// function drawEnemies() {
//     enemies.forEach((enemy, index) => {
//         enemy.y += enemy.speed;
//         ctx.fillStyle = enemy.color;
//         ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

//         // End game if an enemy reaches the bottom
//         if (enemy.y + enemy.height > canvas.height) {
//             alert("Game Over!");
//             document.location.reload();
//         }
//     });
// }

// Function to draw enemies and check if they reach the bottom
function drawEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        // ctx.fillStyle = enemy.color;
        // ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        let img = enemy.type === "boss" ? bossImg : enemyImg;
        ctx.drawImage(img, enemy.x, enemy.y, enemy.width, enemy.height);

        // ❌ FIXED: End game only if ENEMY, not BULLET, reaches bottom
        if (enemy.y + enemy.height > canvas.height) {
            alert("Game Over! An enemy reached the bottom.");
            document.location.reload(); // Restart game
        }
    });
}

function drawPowerUps() {
    powerUps.forEach((powerUp, index) => {
        powerUp.y += powerUp.speed;
        // ctx.fillStyle = powerUp.color;
        // ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height); 
        ctx.drawImage(powerUpImg, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        if (powerUp.y > canvas.height) {
            powerUps.splice(index, 1);
        }
    });
}

// Function to handle collisions
// function checkCollisions() {
//     bullets.forEach((bullet, bIndex) => {
//         enemies.forEach((enemy, eIndex) => {
//             if (
//                 bullet.x < enemy.x + enemy.width &&
//                 bullet.x + bullet.width > enemy.x &&
//                 bullet.y < enemy.y + enemy.height &&
//                 bullet.y + bullet.height > enemy.y
//             ) {
//                 // Remove bullet and enemy on collision
//                 bullets.splice(bIndex, 1);
//                 enemies.splice(eIndex, 1);
//             }
//         });
//     });
// }


// function checkCollisions() {
//     bullets.forEach((bullet, bIndex) => {
//         enemies.forEach((enemy, eIndex) => {
//             if (
//                 bullet.x < enemy.x + enemy.width &&
//                 bullet.x + bullet.width > enemy.x &&
//                 bullet.y < enemy.y + enemy.height &&
//                 bullet.y + bullet.height > enemy.y
//             ) {
//                 // Increase score when an enemy is hit
//                 score += enemy.type === "boss" ? 10 : 5;
//                 bullets.splice(bIndex, 1);
//                 enemies.splice(eIndex, 1);
//             }
//         });
//     });
// }


function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bIndex, 1);
                
                if (enemy.type === "boss") {
                    enemy.health -= 1;
                    if (enemy.health === 0) {
                        score += 10; // More points for a boss
                        explodeSound.play(); // play sound on explosion
                        enemies.splice(eIndex, 1);
                    }
                } else {
                    score += 5;
                    enemies.splice(eIndex, 1);
                }
            }
        });
    });
}

function checkPowerUpCollisions() {
    powerUps.forEach((powerUp, index) => {
        if (
            player.x < powerUp.x + powerUp.width &&
            player.x + player.width > powerUp.x &&
            player.y < powerUp.y + powerUp.height &&
            player.y + player.height > powerUp.y
        ) {
            if (powerUp.type === "doubleShot") {
                bullets.push({ x: player.x, y: player.y, width: 10, height: 20, color: "red", speed: 5 });
            } else if (powerUp.type === "bonusScore") {
                score += 20;
            }
            powerUps.splice(index, 1);
        }
    });
}


// new 
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    movePlayer();
    drawBullets();
    drawEnemies();
    drawPowerUps();
    checkCollisions();
    checkPowerUpCollisions();
    spawnEnemies();
    spawnPowerUp();
    drawScore();  // <-- New

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
