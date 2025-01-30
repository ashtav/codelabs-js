import { O } from "../../assets/scripts/o.js";
import { Bullet } from "./bullet.js";
import { Enemy } from "./enemy.js";
import { Player } from "./player.js";
import { Spark } from "./spark.js";
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
    this.sparks = [];

    this.score = 0;
    this.score_metric = 0;
    this.level = 1;

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
          this.enemies.splice(i, 1);
          bullets.splice(bi, 1);
          this.sparks.push(new Spark(enemy.x, enemy.y, 5, 5, [255, 0, 0]));
        }
      });

      // Tabrakan dengan player
      if (O.collision(enemy, player)) {
        this.sparks.push(new Spark(player.x, player.y, 5, 5, [255, 0, 0]));
        this.enemies.splice(i, 1);
      }
    }

    this.sparks.forEach((spark, index) => {
      spark.update();
      spark.draw(ctx);
      if (spark.isDead()) this.sparks.splice(index, 1);
    });

    this.gameID = requestAnimationFrame(this.render.bind(this));
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

    this.render();

    const onFired = () => {
      const newBullet = new Bullet(
        this.player.x,
        this.player.y - this.player.size - 5,
        -Math.PI / 2
      );

      this.bullets.push(newBullet);
    };

    const circleFired = () => {
      const angle = 2;

      const numBullets = 20;
      const angleOffset = (angle * Math.PI) / numBullets;

      for (let i = 0; i < numBullets; i++) {
        const newBullet = new Bullet(
          this.player.x,
          this.player.y - this.player.size,
          -Math.PI / angle + i * angleOffset
        );

        // newBullet.speed = (0.3 * i) < 1 ? 1 : 0.3 * i;

        // if(i % 2 == 0){
        //   newBullet.speed = 2
        // }

        this.bullets.push(newBullet);
      }
    };

    const halfCircleFired = () => {
      const numBullets = 5; // Jumlah peluru
      const angle = Math.PI / 1; // Sudut puncak huruf V (setengah sudut 45 derajat)
      const angleOffset = angle / (numBullets - 1); // Mengatur jarak antara peluru di sepanjang garis V

      // Peluru bergerak ke arah tengah (pusat huruf V)
      for (let i = 0; i < numBullets; i++) {
        // Menghitung sudut untuk setiap peluru berdasarkan posisi i
        const spreadAngle = -angle + i * angleOffset;

        // Buat peluru baru
        const newBullet = new Bullet(
          this.player.x,
          this.player.y - this.player.size,
          spreadAngle // Sudut berbeda untuk masing-masing peluru
        );

        // Tambahkan peluru ke dalam array
        this.bullets.push(newBullet);
      }
    };

    // Kontrol
    canvas.addEventListener("mousemove", (e) => {
      this.player.x = e.offsetX;
      this.player.y = e.offsetY;
    });

    canvas.addEventListener("click", (e) => {
      // halfCircleFired();
      onFired();
      // for (let i = 0; i < 15; i++) {
      //   setTimeout(() => circleFired(), i * 500);
      // }
    });

    document.addEventListener("keydown", (event) => {
      if ((event.key === " " || event.code === "Space") && this.gameOver) {
        new Game({});
      }
    });
  }
}

new Game({});
