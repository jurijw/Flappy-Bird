class Player {
  constructor(r = 20) {
    this.x = 0.45 * width;
    this.y = 0.5 * height;
    this.r = r;

    this.xVel = xVel;
    this.yVel = 0;
  }

  show() {
    // Set coloring properties
    const yellow = color(220, 220, 100);
    fill(yellow);
    noStroke();

    // Draw a circle at the player location
    circle(this.x, this.y, this.r * 2);
  }

  update() {
    this.y += this.yVel;
    this.yVel += g;
  }
}

// Window settings
const width = 400;
const height = 600;
const fps = 60;

const g = 0.35;
const xVel = 10; // Same as the speed at which the pipes move toward player

const player = new Player();

const coolDownTime = fps / 5; // Quarter of a second cool down time
let coolDown = 0;

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

  player.show();
  // console.log(coolDown);
  if (started) {
    player.update();
    // console.log(coolDown);
    if (coolDown > 0) {
      if (coolDown - 1 < 0) {
        coolDown = 0;
      } else {
        coolDown -= 1;
      }
    }
  }
}

function keyPressed() {
  // Get player input
  if (keyCode === 32) {
    if (!started) {
      // Start the game after the first time space is pressed
      started = true;
    }
    if (coolDown === 0) {
      // Apply an upward force to the player and reset the coolDown
      player.yVel = -7;
      coolDown = coolDownTime;
      console.log("Jump!");
      console.log(player.yVel);
    }
  }
  return false;
}
