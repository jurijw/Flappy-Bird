class Player {
  constructor(r = 20) {
    this.x = 0.45 * width;
    this.y = 0.5 * height;
    this.r = r;

    this.velX = velX;
    this.velY = 0;

    this.coolDown = coolDownTime;

    // Player hitbox is a rectangle of width 2r centered on (player.x, player.y)
    this.hitBoxTopY = this.y - this.r;
    this.hitBoxBottomY = this.y + this.r;
    this.hitBoxLeftX = this.x - this.r;
    this.hitBoxRightX = this.x + this.r;
  }

  show() {
    // Set coloring properties
    const yellow = color(220, 220, 100);
    fill(yellow);
    noStroke();

    // Draw a circle at the player location
    circle(this.x, this.y, this.r * 2);
  }

  update(reset = false) {
    if (!reset) {
      // Update velocity and position
      this.y += this.velY;
      this.velY += g;

      // Reduce jump cooldown
      if (this.coolDown > 0) {
        if (this.coolDown - 1 < 0) {
          this.coolDown = 0;
        } else {
          this.coolDown -= 1;
        }
      }
    }

    // Update hitbox
    this.hitBoxTopY = this.y - this.r;
    this.hitBoxBottomY = this.y + this.r;
    this.hitBoxLeftX = this.x - this.r;
    this.hitBoxRightX = this.x + this.r;
  }
}

class Pipe {
  constructor(x, gapPosTopY = 0.3 * height) {
    this.x = x;
    this.gapPosTopY = gapPosTopY; // y-coordinate of the top of the gap (bottom of the top pipe)

    this.gapPosBottomY = this.gapPosTopY + pipeGapHeight;
  }

  show() {
    fill(100, 220, 100);
    // Draw top half of pipe
    rect(this.x, 0, pipeWidth, this.gapPosTopY);
    // Draw bottom half of pipe
    rect(
      this.x,
      this.gapPosBottomY,
      pipeWidth,
      distFromTopToGround - this.gapPosBottomY
    );
  }

  update(reset = false) {
    // Move the pipes towards the left
    this.x -= pipeSpeed;
    // When a pipe goes offscreen
    if (this.x + pipeWidth <= 0) {
      // Set the gap to a new random location
      this.gapPosTopY = randomIntInclusive(minPipeY, maxPipeY);
      this.gapPosBottomY = this.gapPosTopY + pipeGapHeight;

      // If reset parameter is false and pipe goes off screen move it to the other side
      if (!reset) {
        this.x = width;
      }
    }
  }
}

// Window settings
const width = 400;
const height = 600;
const fps = 60;

// Ground related constants
const groundHeight = 0.15 * height;
const groundPosY = 0.85 * height;

// Player related constants
const g = 0.35;
const velX = 10; // Same as the speed at which the pipes move toward player
const coolDownTime = fps / 5; // Quarter of a second cool down time

// Pipe related constants
const pipeSpeed = 5;
const pipeWidth = 60;
const pipeGapHeight = 0.25 * height;
const pipeSpacing = width / 2 - pipeWidth / 2; // Spacing between pipes - Calculated so that as one pipe goes offscreen it emerges on the other side
const distFromTopToGround = height - groundHeight; // Distance between the top of the screen and the ground
const minPipeY = Math.ceil(0.05 * distFromTopToGround);
const maxPipeY = Math.floor(0.95 * distFromTopToGround) - pipeGapHeight;

// Initialize player and pipes
const player = new Player();
// We can get away with just 2 pipes
const pipe1 = new Pipe(width, 100);
const pipe2 = new Pipe(width + pipeSpacing + pipeWidth, 300);
const pipes = [pipe1, pipe2];

// Variables that need to be able to be modified
let started = false;

function setup() {
  // put setup code here
  createCanvas(width, height);
  frameRate(fps);
  // noCursor();
}

function draw() {
  // put drawing code here
  background(100, 180, 255);
  drawGround();

  player.show();
  if (started) {
    // Update player
    player.update();

    // Check if player has left screen
    if (
      player.y - player.r <= 0 ||
      player.y + player.r >= distFromTopToGround
    ) {
      console.log("Collision with Top or Ground.");
      restart();
    }

    // Update the pipes
    for (pipe of pipes) {
      pipe.show();
      pipe.update();

      if (pipe.gapPosBottomY >= distFromTopToGround) {
        started = false;
      }

      // Check for colision with player
      if (
        player.hitBoxRightX > pipe.x &&
        player.hitBoxLeftX < pipe.x + pipeWidth
      ) {
        // If the player is within range of the pipe in the x-dimension, check if it is touching the top or bottom of the pipe.
        if (
          player.hitBoxTopY < pipe.gapPosTopY ||
          player.hitBoxBottomY > pipe.gapPosBottomY
        ) {
          // If so reset the game
          console.log("Collision with Pipe.");
          restart();
          break;
        }
      }
    }
  }
}

function restart() {
  // Reset the gamestate
  started = false;
  // Reset player
  player.x = 0.45 * width;
  player.y = 0.5 * height;
  player.velY = 0;
  player.coolDown = 0;

  // Reset hitbox
  player.update((reset = true));

  // Reset pipes
  pipe1.x = width;
  pipe2.x = width + pipeSpacing + pipeWidth;
  pipe1.update((reset = true));
  pipe2.update((reset = true));
}

function keyPressed() {
  // Get player input
  if (keyCode === 32) {
    if (!started) {
      // Start the game after the first time space is pressed
      started = true;
    }
    if (player.coolDown === 0) {
      // Apply an upward force to the player and reset the coolDown
      player.velY = -7;
      player.coolDown = coolDownTime;
    }
  }
  return false;
}

function drawGround() {
  // Draw the ground
  fill(100, 65, 35); // Set color
  rect(0, groundPosY, width, groundHeight);
}

function randomIntInclusive(min, max) {
  // @source https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
