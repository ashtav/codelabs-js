import { Lib } from "../../assets/scripts/lib.js";
import { Ball } from "./ball.js";
import { Brick } from "./brick.js";
import { Player } from "./player.js";

const ctx = canvas.getContext("2d");

const fire = Lib.audio("fire");
const explode = Lib.audio("exploded");

class Game {
  constructor() {
    this.gameID = null;
    this.spawnInterval = null;
    this.gameOver = false;

    this.player = new Player(canvas.width / 2);
    this.balls = [];
    this.bricks = [];

    this.health = 100;
    this.score = 0;
    this.score_metric = 0;
    this.level = 1;
    this.ballSpeed = 3;
    this.rows = 1
    this.multiple = 1

    this.init();
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const player = this.player;

    player.draw(ctx);

    // RENDER BALLS -----
    for (let i = this.balls.length - 1; i >= 0; i--) {
      const ball = this.balls[i];
      ball.update();
      ball.draw(ctx);

      this.bricks.forEach((brick, i) => {
        if (ball.checkCollision(brick)) {
          brick.hit();

          ball.handleBallBrickCollision(brick);
        }

        if (brick.isDead()) {
          this.bricks.splice(i, 1);

          if (this.bricks.length <= 0) {
            this.level++;
            this.rows++
            this.ballSpeed++;
            this.createBricks();

            if (this.level % 10 === 0 && this.level > 0) {
              this.rows = 1
              this.multiple++
            }

            Lib.html("level", this.level);
          }
        }
      });

      if (ball.isDead()) {
        this.balls.splice(i, 1);
        Lib.html("ball", this.balls.length);
      }

      // BALLS x PLAYER
      ball.handleBallPlayerCollision(player, this.ballSpeed);
      player.findBall(this.balls);
    }

    // RENDER BRICK -----
    this.bricks.forEach((brick) => brick.draw(ctx));

    if (!this.gameOver) {
      this.gameID = requestAnimationFrame(this.render.bind(this));
    }
  }

  createBricks() {
    const rows = this.rows; // Jumlah baris
    const cols = 10; // Jumlah kolom

    const spaces = {
      x: 2, // Jarak antar brick horizontal
      y: 2, // Jarak antar brick vertical
      pl: 5, // Padding kiri
      pr: 5, // Padding kanan
      pt: 5, // Padding atas
    };

    const brickWidth =
      (canvas.width - spaces.pl - spaces.pr - (cols - 1) * spaces.x) / cols; // Lebar brick
    const brickHeight = 20; // Tinggi brick

    // Loop untuk menggambar brick
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Set posisi X brick
        const x = spaces.pl + j * (brickWidth + spaces.x);

        // Set posisi Y brick, dengan padding atas
        const y = spaces.pt + i * (brickHeight + spaces.y);
        const value = Lib.generateRandomNumber(this.multiple);

        // Buat brick baru dengan posisi dan ukuran
        this.bricks.push(new Brick(x, y, brickWidth, brickHeight, value));
      }
    }
  }

  init() {
    Lib.html("health", this.health);

    this.createBricks();
    this.render();

    const player = this.player;

    // Kontrol
    canvas.addEventListener("mousemove", (e) => {
      this.player.x = e.offsetX;
    });

    canvas.addEventListener("mousedown", (e) => {
      this.player.fire(true);
    });

    canvas.addEventListener("mouseup", (e) => {
      this.player.fire(false);

      if (e.button === 1) {
        player.stickAngle = 0;
      }
    });

    canvas.addEventListener("click", (e) => {
      fire.play();

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const angleRad = (player.stickAngle * Math.PI) / 4;
      const ball = new Ball(player.x, canvas.height - 10, angleRad);

      this.balls.push(ball);
      Lib.html("ball", this.balls.length);
    });

    document.addEventListener("keydown", (event) => {
      if ((event.key === " " || event.code === "Space") && this.gameOver) {
        new Game({});
      }
    });
  }
}

new Game({});
