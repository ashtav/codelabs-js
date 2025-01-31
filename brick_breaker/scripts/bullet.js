import { Lib } from "../../assets/scripts/lib.js";

export class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 1;
    this.size = 2;

    // enemies to kill
    this.enemies = [];
  }

  draw(ctx) {
    Lib.drawCircle(ctx, this.x, this.y, this.size, "white");
  }

  update(enemies = [], autopilot = false) {
    if (autopilot) {
      let enemy = null;
      let shortestDistance = Infinity;

      enemies.forEach((arr) => {
        const dx = arr.x - this.x;
        const dy = arr.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < shortestDistance && !arr.marked) {
          shortestDistance = distance;
          enemy = arr;
        }
      });

      // Tandai musuh jika belum ada target yang diikuti
      if (enemy && !enemy.marked && this.enemies.length < 1) {
        enemy.marked = true;
        this.enemies.push(enemy);
      }

      if (this.enemies.length !== 0) {
        enemy = this.enemies[0];

        const dx = enemy.x - this.x;
        const dy = enemy.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Jika peluru sangat dekat dengan musuh, hapus musuh dari daftar dan lanjutkan perjalanan
        if (distance < 2) {
          this.enemies.shift(); // Hapus musuh dari daftar yang sedang dikejar
          return;
        }

        const angleToEnemy = Math.atan2(dy, dx);
        this.x += Math.cos(angleToEnemy) * (this.speed + 1);
        this.y += Math.sin(angleToEnemy) * (this.speed + 1);

        return;
      }
    }

    // Jika tidak ada target, gerak lurus sesuai sudut awal
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    this.size -= 0.003;
  }

  // out of screen
  isDead() {
    if (this.size <= 0) {
      return true;
    }

    return (
      this.x < 0 ||
      this.x > canvas.width ||
      this.y < 0 ||
      this.y > canvas.height
    );
  }
}

export const singleShot = (player, bullets) => {
  const newBullet = new Bullet(
    player.x,
    player.y - player.size - 5,
    -Math.PI / 2
  );

  bullets.push(newBullet);
};

export const halfCircleShot = (player, bullets) => {
  const numBullets = 5;
  const angle = Math.PI / 1;
  const angleOffset = angle / (numBullets - 1);

  for (let i = 0; i < numBullets; i++) {
    const spreadAngle = -angle + i * angleOffset;
    const newBullet = new Bullet(player.x, player.y - player.size, spreadAngle);
    bullets.push(newBullet);
  }
};

export const circleShot = (player, bullets) => {
  const angle = 2;

  const numBullets = 20;
  const angleOffset = (angle * Math.PI) / numBullets;

  for (let i = 0; i < numBullets; i++) {
    const newBullet = new Bullet(
      player.x,
      player.y - player.size,
      -Math.PI / angle + i * angleOffset
    );

    // newBullet.speed = (0.3 * i) < 1 ? 1 : 0.3 * i;

    // if(i % 2 == 0){
    //   newBullet.speed = 2
    // }

    bullets.push(newBullet);
  }
};
