import { Utils } from "./utils.js";

export class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 1;

    this.autopilot = true;
    this.burst = false;
  }

  draw(ctx) {
    Utils.drawCircle(ctx, this.x, this.y, 2, "white");
  }

  update(enemies = []) {
    // if (enemies.length != 0 && this.autopilot) {
    //   // find nearest enemy
    //   let nearestEnemy = Utils.getNearestFrom(enemies, this);

    //   if (nearestEnemy && nearestEnemy?.targetted !== this) {
    //     nearestEnemy.targetted = this;

    //     const dx = nearestEnemy.x - this.x;
    //     const dy = nearestEnemy.y - this.y;
    //     const angleToEnemy = Math.atan2(dy, dx);

    //     // Perbarui posisi peluru berdasarkan arah ke enemy terdekat
    //     this.x += Math.cos(angleToEnemy) * (this.speed + 2);
    //     this.y += Math.sin(angleToEnemy) * (this.speed + 2);
    //   } else {
    //     this.x += Math.cos(this.angle) * this.speed;
    //     this.y += Math.sin(this.angle) * this.speed;
    //   }

    //   return;
    // }

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }
}
