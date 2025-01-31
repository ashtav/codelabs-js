import { Lib } from "../../assets/scripts/lib.js";

export class Spark {
  constructor(x, y, length, count = 5, color = null) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.size = 2;
    this.opacity = 1;
    this.segments = [];
    this.color = color;

    for (let i = 0; i < count; i++) {
      this.segments.push({
        x: x, // Awal dari posisi Spark
        y: y,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 2 + 1,
        size: this.size * (Math.random() * 0.5 + 0.5),
      });
    }
  }

  update() {
    this.segments.forEach((segment) => {
      segment.x += Math.cos(segment.angle) * segment.speed;
      segment.y += Math.sin(segment.angle) * segment.speed;
      segment.speed *= 0.96; // Perlahan melambat
      segment.size *= 0.92; // Mengecil seiring waktu
    });

    this.opacity -= 0.02; // Perlahan menghilang
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(this.opacity, 0); // Pastikan tidak negatif
    ctx.fillStyle = Lib.rgba(this.color ?? [255, 255, 255], this.opacity);

    this.segments.forEach((segment) => {
      ctx.beginPath();
      ctx.arc(segment.x, segment.y, segment.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  isDead() {
    return this.opacity <= 0;
  }
}

export class Blast {
  constructor(x, y, size = 5, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color
    this.opacity = 1;
  }

  update() {
    this.size += 0.5;
    this.opacity -= 0.04;
  }

  draw(ctx) {
    if (this.opacity <= 0) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = Lib.rgba(this.color ?? [255, 255, 255], this.opacity - .2);
    ctx.fill();

    // border only
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * (2 - this.opacity), 0, Math.PI * 2);
    ctx.strokeStyle = Lib.rgba(this.color ?? [255, 255, 255], this.opacity);
    ctx.lineWidth = .5;
    ctx.stroke();
  }

  isDead() {
    return this.opacity <= 0;
  }
}
