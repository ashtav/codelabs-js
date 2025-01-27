import { Bullet } from "./bullet.js";
import { Utils } from "./utils.js";

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.size = 5;
    this.health = 100;
    this.isAttacked = false;
    this.blinking = false;
    this.blinkStartTime = 0; // To track the time when attack happens

    this.bullets = [...Array(3)].map(
      () => new Bullet(this.x, this.y - this.size, -Math.PI / 2)
    );
  }

  draw(ctx) {
    // Check if the player is attacked and start blinking
    if (this.isAttacked) {
      const blinkDuration = 2000; // Blink for 2 seconds
      const blinkInterval = 200; // Blink every 200ms

      // Start the blinking effect by tracking the time
      if (!this.blinkStartTime) {
        this.blinkStartTime = Date.now(); // Set start time when attacked
      }

      const elapsedTime = Date.now() - this.blinkStartTime;

      // Toggle blinking based on time elapsed
      if (elapsedTime % blinkInterval < blinkInterval / 2) {
        this.blinking = true;
      } else {
        this.blinking = false;
      }

      // Stop blinking after the specified duration
      if (elapsedTime > blinkDuration) {
        this.isAttacked = false; // Reset the attack state
        this.blinking = false; // Stop blinking
        this.blinkStartTime = 0; // Reset start time
      }
    }

    // Set opacity based on blinking state
    ctx.fillStyle = `rgba(255, 255, 255, ${this.blinking ? 0.4 : 1})`;

    // Draw the player shape
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.size);
    ctx.lineTo(this.x - this.size, this.y + this.size);
    ctx.lineTo(this.x + this.size, this.y + this.size);
    ctx.closePath();
    ctx.fill();

    // update bullets position based on player position
    this.bullets.forEach((bullet) => {
      bullet.x = this.x;
      bullet.y = this.y - this.size;
    });
  }

  fire(bulletFired) {
    if (this.bullets.length > 0) {
      bulletFired(this.bullets[0]);
      this.bullets.shift();
      this.updateBulletLength();
    }
  }

  addBullet(data) {
    const value = data?.value ?? 2
    const isAutoPilot = data?.autopilot ?? false

    // if get autopilot is true, apply to all
    if (isAutoPilot) {
      this.bullets.forEach((b) => b.autopilot = true)
    }

    for (let i = 0; i < value; i++) {
      const bullet = new Bullet(this.x, this.y - this.size, -Math.PI / 2)
      bullet.autopilot = data?.autopilot ?? false

      this.bullets.push(bullet);
    }

    this.updateBulletLength();
  }

  addHealth(value) {
    this.health += value;

    if (this.health > 100) {
      this.health = 100;
    }

    Utils.html("health", this.health);
  }

  attacked(isGameOver) {
    this.isAttacked = true;
    this.blinkStartTime = 0; // Reset the start time for blinking effect
    this.blinking = true; // Start blinking immediately

    this.health -= 10;
    Utils.html("health", this.health);

    // Check for game over condition
    isGameOver(this.health <= 0);
  }

  update() {
    // this.bullets.forEach((bullet, index) => {
    //   bullet.update();
    //   if (bullet.y < 0) {
    //     this.bullets.splice(index, 1);
    //   }
    // });
  }

  updateBulletLength() {
    Utils.html("bullet", this.bullets.length);
  }
}
