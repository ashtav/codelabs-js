import { O } from "../../assets/scripts/o.js";
import { Bullet } from "./bullet.js";
import { Enemy } from "./enemy.js";
import { Package } from "./package.js";
import { Player } from "./player.js";
import { Utils } from "./utils.js";

const ctx = canvas.getContext("2d");

const fire = O.audio("fire");
const explode = O.audio("exploded");

class Game {
  constructor() {
    this.gameID = null;
    this.spawnInterval = null;
    this.gameOver = false;

    this.player = new Player(canvas.width / 2, canvas.height / 2);
    this.enemies = [];
    this.bullets = [];
    this.packages = [];

    this.score = 0;
    this.score_metric = 0;
    this.level = 1;

    this.keepFired = false;
    this.interval = null;

    this.init();
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const player = this.player;
    const bullets = this.bullets;

    player.update();
    player.draw(ctx);

    // ------------------------------ RENDER BULLETS
    for (let i = 0; i < bullets.length; i++) {
      const bullet = bullets[i];
      bullet.update(this.enemies);
      bullet.draw(ctx);

      if (bullet.y < 0) {
        bullets.splice(i, 1);
      }
    }

    // ------------------------------ RENDER PACKAGES
    for (let i = 0; i < this.packages.length; i++) {
      const gift = this.packages[i];
      gift.update(player.x, player.y);
      gift.draw(ctx);

      // Check for collision with the player
      const dx = player.x - gift.x;
      const dy = player.y - gift.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < player.size + gift.size) {
        explode.play();

        // Remove the package from the array when it collides with the player
        this.packages.splice(i, 1);
        i--; // Adjust the index after removal

        const data = gift.data;

        switch (data.type) {
          case "health":
            player.addHealth(data.value);
            break;

          case "bullet":
            player.addBullet(data);
            break;

          default:
            break;
        }
      }
    }

    for (let index = this.enemies.length - 1; index >= 0; index--) {
      const enemy = this.enemies[index];
      enemy.update(player.x, player.y, this.level);
      enemy.draw(ctx);

      bullets.forEach((bullet, bi) => {
        const dx = enemy.x - bullet.x;
        const dy = enemy.y - bullet.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < enemy.size) {
          this.enemies.splice(index, 1);
          bullets.splice(bi, 1);
          // player.addBullet();

          // add score
          this.score++;
          this.score_metric++;

          if (this.score_metric >= 55) {
            this.level++;
            this.score_metric = 0;
            Utils.html("level", this.level);
          }

          Utils.html("score", this.score);
        }
      });

      // Tabrakan dengan player
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < enemy.size + player.size) {
        this.enemies.splice(index, 1);

        player.attacked((isGameOver) => {
          this.gameOver = isGameOver;

          if (isGameOver) {
            cancelAnimationFrame(this.gameID);
            clearInterval(this.spawnInterval);

            Utils.gameOver(ctx, canvas);
          }
        });
      }
    }

    if (!this.gameOver) {
      this.gameID = requestAnimationFrame(this.render.bind(this));
    }
  }

  init() {
    console.log("Game initialized!");

    Utils.html("bullet", this.player.bullets.length);
    Utils.html("health", this.player.health);

    // SPAWN ENEMIES
    this.spawnInterval = setInterval(() => {
      if (this.enemies.length < 15) {
        this.enemies.push(new Enemy(this.player.x, this.player.y));
      }
    }, 1000);

    // Spawn packages every 3 seconds | O.audio('fire')
    this.packageSpawnInterval = setInterval(() => {
      const gift = new Package();

      // packages data
      const data = [
        { type: "health", value: 25, color: "green" },
        { type: "health", value: 50, color: "green" },
        { type: "health", value: 100, color: "green" },
        { type: "bullet", value: 5, color: "orange" },
        { type: "bullet", value: 10, color: "orange" },
        // { type: "bullet", value: 10, color: "white", autopilot: true },
        { type: "bullet", value: 25, color: "red", burst: true },
        { type: "bullet", value: 25, color: "red", burst: true },
        { type: "bullet", value: 25, color: "red", burst: true },
        { type: "bullet", value: 25, color: "red", burst: true },
      ];

      // Randomly select an object from the data array
      const randomIndex = Math.floor(Math.random() * data.length);
      gift.data = data[randomIndex];
      gift.color = data[randomIndex].color;

      this.packages.push(gift);
    }, 3000);

    this.render();

    const onFired = () => {
      const numBullets = 15; // Jumlah peluru yang ingin disebar (15 peluru)
      const angleOffset = (2 * Math.PI) / numBullets; // Sudut antara tiap peluru dalam 360 derajat

      // Menyebarkan peluru dalam lingkaran penuh (360 derajat)
      for (let i = 0; i < numBullets; i++) {
        // Membuat salinan objek bullet untuk menghindari referensi yang sama
        const newBullet = new Bullet(
          this.player.x,
          this.player.y - this.player.size, // Posisi player
          -Math.PI / 2 + i * angleOffset // Mengubah sudut untuk setiap peluru
        );

        // Menambahkan peluru yang sudah tersebar ke dalam array
        this.bullets.push(newBullet);
      }
    };

    // Kontrol
    canvas.addEventListener("mousemove", (e) => {
      this.player.x = e.offsetX;
      this.player.y = e.offsetY;
    });

    canvas.addEventListener("mouseup", (e) => {
      clearInterval(this.interval);
    });

    canvas.addEventListener("mousedown", (e) => {
      this.interval = setInterval(() => onFired(), 500);
    });

    canvas.addEventListener("click", (e) => {
      const numBullets = 15; // Jumlah peluru yang ingin disebar (15 peluru)
      const angleOffset = (2 * Math.PI) / numBullets; // Sudut antara tiap peluru dalam 360 derajat

      // Menyebarkan peluru dalam lingkaran penuh (360 derajat)
      for (let i = 0; i < numBullets; i++) {
        // Membuat salinan objek bullet untuk menghindari referensi yang sama
        const newBullet = new Bullet(
          this.player.x,
          this.player.y - this.player.size, // Posisi player
          -Math.PI / 2 + i * angleOffset // Mengubah sudut untuk setiap peluru
        );

        // Menambahkan peluru yang sudah tersebar ke dalam array
        this.bullets.push(newBullet);
      }
      // this.player.fire((bullet) => {
      //   fire.play();

      //   bullet.speed = this.level;
      //   console.log(bullet);

      //   const angleOffset = 0.2;

      //   if (bullet.burst) {
      //     for (let i = -1; i <= 1; i++) {
      //       bullet.angle = bullet.angle + i * angleOffset
      //       this.bullets.push(bullet);
      //     }

      //     return;
      //   }

      //   this.bullets.push(bullet);
      // });
    });

    document.addEventListener("keydown", (event) => {
      if ((event.key === " " || event.code === "Space") && this.gameOver) {
        new Game({});
      }
    });
  }
}

new Game({});
