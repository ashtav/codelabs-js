import { Lib } from "../../assets/scripts/lib.js";
import { Ball } from "./ball.js";

export class Player {
  constructor(x, y) {
    this.size = 5;

    this.x = x;
    this.y = canvas.height - 10

    this.isAttacked = false;
    this.blinking = false;
    this.blinkStartTime = 0; // To track the time when attack happens

    this.stickAngle = 0

    window.addEventListener("wheel", (e) => {
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      this.stickAngle = Math.max(-1, Math.min(1, this.stickAngle + delta));
    });
  }

  draw(ctx) {
    // Set opacity based on blinking state
    ctx.fillStyle = `rgba(255, 255, 255, ${this.blinking ? 0.4 : 1})`;

    // Define rectangle properties
    const width = this.size * 10;
    const height = this.size - 3;
    const radius = this.size * 0.3;

    // Draw rounded rectangle
    ctx.beginPath();
    ctx.moveTo(this.x - width / 2 + radius, this.y - height / 2);
    ctx.lineTo(this.x + width / 2 - radius, this.y - height / 2);
    ctx.arcTo(this.x + width / 2, this.y - height / 2, this.x + width / 2, this.y - height / 2 + radius, radius);
    ctx.lineTo(this.x + width / 2, this.y + height / 2 - radius);
    ctx.arcTo(this.x + width / 2, this.y + height / 2, this.x + width / 2 - radius, this.y + height / 2, radius);
    ctx.lineTo(this.x - width / 2 + radius, this.y + height / 2);
    ctx.arcTo(this.x - width / 2, this.y + height / 2, this.x - width / 2, this.y + height / 2 - radius, radius);
    ctx.lineTo(this.x - width / 2, this.y - height / 2 + radius);
    ctx.arcTo(this.x - width / 2, this.y - height / 2, this.x - width / 2 + radius, this.y - height / 2, radius);
    ctx.closePath();
    ctx.fill();

    // draw dashed stick, length = 10
    this.drawStick(ctx)
  }

  drawStick(ctx) {
    const stickLength = 100;
    const stickThickness = .5;
    const angleRad = this.stickAngle * Math.PI / 4;

    const x2 = this.x + Math.sin(angleRad) * stickLength;
    const y2 = this.y - Math.cos(angleRad) * stickLength;

    // Buat gradient dari pangkal ke ujung stick
    const gradient = ctx.createLinearGradient(this.x, this.y, x2, y2);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = stickThickness;

    // Efek bergerak dengan lineDashOffset
    ctx.setLineDash([5, 5]); // Panjang garis 5px, jarak 5px
    ctx.lineDashOffset = -performance.now() / 50 % 10; // Gerakan ke atas

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.setLineDash([]); // Reset dash
  }

  fire(pressed) {
    this.size = 5;

    if (pressed) {
      this.size = 4;
    }
  }

  addBullet(data) {
    const value = data?.value ?? 2;
    const isAutoPilot = data?.autopilot ?? false;
    const isBurst = data?.burst ?? false;

    // if get autopilot is true, apply to all
    if (isAutoPilot) {
      this.bullets.forEach((b) => (b.autopilot = true));
    }

    for (let i = 0; i < value; i++) {
      const bullet = new Bullet(this.x, this.y - this.size, -Math.PI / 2);
      bullet.autopilot = data?.autopilot ?? false;
      bullet.burst = isBurst;

      this.bullets.push(bullet);
    }

    this.updateBulletLength();
  }

  attacked() {
    this.isAttacked = true;
    this.blinkStartTime = 0; // Reset the start time for blinking effect
    this.blinking = true; // Start blinking immediately
  }

  updateBulletLength() {
    Lib.html("bullet", this.bullets.length);
  }
}
