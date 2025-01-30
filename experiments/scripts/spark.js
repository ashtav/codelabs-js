import { O } from "../../assets/scripts/o.js";

export class Spark {
    constructor(x, y, length, count = 5, color = null) {
      this.x = x;
      this.y = y;
      this.length = length;
      this.size = 2;
      this.opacity = 1;
      this.segments = [];
      this.color = color
  
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
      ctx.fillStyle = O.rgba(this.color ?? [255, 255, 255], this.opacity)
  
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
  