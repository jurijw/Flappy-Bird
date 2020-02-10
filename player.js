class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.xVel = panSpeed;
    this.yVel = g;
  }

  show() {
    ellipse(this.x, this.y, 15);
  }

  update() {}
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

bird = new Player(50, 50);

while (!gameOver) {
  bird.show();
}
