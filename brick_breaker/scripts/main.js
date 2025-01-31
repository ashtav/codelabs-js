import { Lib } from "../../assets/scripts/lib.js";
import { circleShot, halfCircleShot, singleShot } from "./bullet.js";
import { Enemy } from "./enemy.js";
import { Logistic } from "./logistic.js";
import { Player } from "./player.js";
import { Blast, Spark } from "./spark.js";

const ctx = canvas.getContext("2d");

const fire = Lib.audio("fire");
const explode = Lib.audio("exploded");

class Game {
  constructor() {
    this.gameID = null;
    this.spawnInterval = null;
    this.gameOver = false;

    this.player = new Player(canvas.width / 2, canvas.height / 2);
    this.enemies = [];
    this.bullets = [];
    this.sparks = [];
    this.blasts = [];
    this.logistics = [];

    this.health = 100;
    this.score = 0;
    this.score_metric = 0;
    this.level = 1;

    this.bullet = {
      value: 5,
      type: "single",
      autopilot: false,
      fire: singleShot,
    };

    this.init();
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const player = this.player;
    const bullets = this.bullets;
    const logistics = this.logistics;

    player.draw(ctx);

    // ------------------------------ RENDER BULLETS
    for (let i = 0; i < bullets.length; i++) {
      const bullet = bullets[i];
      bullet.speed = this.level + 0.5;
      bullet.update(this.enemies, this.bullet.autopilot);
      bullet.draw(ctx);

      if (bullet.y < 0 || bullet.isDead()) {
        bullets.splice(i, 1);
      }
    }

    // ------------------------------ RENDER ENEMIES
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(player.x, player.y);
      enemy.draw(ctx);

      // ------------------------------ COLLISSION WITH BULLETS
      bullets.forEach((bullet, bi) => {
        const dx = enemy.x - bullet.x;
        const dy = enemy.y - bullet.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < enemy.size) {
          explode.play();

          this.enemies.splice(i, 1);
          bullets.splice(bi, 1);

          this.sparks.push(new Spark(enemy.x, enemy.y, 5, 5, [255, 0, 0]));

          this.score += 1;
          this.score_metric += 1;
          Lib.html("score", this.score);

          if (this.score_metric >= 50) {
            this.score_metric = 0;
            this.level++;

            Lib.html("level", this.level);
          }
        }
      });

      // ------------------------------ ENEMY x PLAYER
      if (Lib.collision(enemy, player)) {
        this.sparks.push(new Spark(player.x, player.y, 5, 5, [255, 0, 0]));
        this.enemies.splice(i, 1);

        player.attacked();
         
        this.health = Math.max(this.health - 10, 0);
        Lib.html("health", this.health);

        if (this.health <= 0) {
          const spark = new Spark(player.x, player.y, 50, 50, [255, 255, 255]);
          spark.size = 5;

          this.sparks.push(spark);
          player.size = 1;

          setTimeout(() => {
            this.gameOver = true;
            Lib.gameOver(ctx);

            cancelAnimationFrame(this.gameID);
            clearInterval(this.spawnInterval);
          }, 300);
        }
      }
    }

    // ------------------------------ RENDER LOGISTIC
    for (let i = 0; i < logistics.length; i++) {
      const e = logistics[i];
      e.draw(ctx);

      if (e.update()) {
        this.logistics.splice(i, 1);
      }

      if (Lib.collision(e, player)) {
        this.sparks.push(new Spark(e.x, e.y, 5, 5, [255, 255, 255]));
        this.logistics.splice(i, 1);

        this.bullet.autopilot = false;

        switch (e.type) {
          case "A":
            this.bullet.autopilot = true;
            break;

          case "B":
            this.bullet.value += 10;
            Lib.html("bullet", this.bullet.value);
            break;

          case "H":
            this.health = Math.min(this.health + 10, 100);
            Lib.html("health", this.health);
            break;

          case "X":
            for (let i = this.enemies.length - 1; i >= 0; i--) {
              let e = this.enemies[i];

              this.sparks.push(new Spark(e.x, e.y, 5, 5, [255, 0, 0]));
              this.enemies.splice(i, 1);
            }
            break;

          case "#":
            this.bullet.fire = singleShot;
            break;

          case "$":
            this.bullet.fire = halfCircleShot;
            break;

          case "%":
            this.bullet.fire = circleShot;
            break;

          default:
            break;
        }
      }
    }

    this.sparks.forEach((spark, index) => {
      spark.update();
      spark.draw(ctx);
      if (spark.isDead()) this.sparks.splice(index, 1);
    });

    this.blasts.forEach((o, i) => {
      o.x = player.x;
      o.y = player.y;
      o.update();
      o.draw(ctx);
      if (o.isDead()) this.blasts.splice(i, 1);
    });

    if (!this.gameOver) {
      this.gameID = requestAnimationFrame(this.render.bind(this));
    }
  }

  init() {
    console.log("Game initialized!");

    Lib.html("bullet", this.bullet.value);
    Lib.html("health", this.health);

    // SPAWN ENEMIES
    this.spawnInterval = setInterval(() => {
      if (this.enemies.length < 15) {
        const enemy = new Enemy(this.player.x, this.player.y);
        enemy.speed = this.level;

        this.enemies.push(enemy);
      }
    }, 1000);

    // SPAWN LOGISTIC
    setInterval(() => {
      const type = Lib.shuffleArray(["H", "B", "A", "X", "#", "$", "%"]);
      this.logistics.push(new Logistic(type[0]));
    }, 3000);

    this.render();

    // Kontrol
    canvas.addEventListener("mousemove", (e) => {
      this.player.x = e.offsetX;
      this.player.y = e.offsetY;
    });

    canvas.addEventListener("mousedown", (e) => {
      this.player.fire(true);
    });

    canvas.addEventListener("mouseup", (e) => {
      this.player.fire(false);
    });

    canvas.addEventListener("click", (e) => {
      if (this.bullet.value <= 0) {
        return;
      }

      fire.play();
      this.blasts.push(
        new Blast(this.player.x, this.player.y, this.player.size)
      );

      this.bullet.fire(this.player, this.bullets);

      // update bullet information
      this.bullet.value--;
      Lib.html("bullet", this.bullet.value);
    });

    document.addEventListener("keydown", (event) => {
      if ((event.key === " " || event.code === "Space") && this.gameOver) {
        new Game({});
      }
    });
  }
}

new Game({});
