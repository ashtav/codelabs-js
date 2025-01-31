import { Lib } from "../../assets/scripts/lib.js";

export class Ball {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 3; // Bisa diatur lebih cepat
    this.size = 2; // Ukuran bola
    this.dx = Math.sin(this.angle) * this.speed; // Kecepatan horizontal
    this.dy = -Math.cos(this.angle) * this.speed; // Kecepatan vertikal
  }

  draw(ctx) {
    Lib.drawCircle(ctx, this.x, this.y, this.size, "white");
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    // Pantulan jika kena dinding
    if (this.x <= 0 || this.x >= canvas.width) {
      this.dx = -this.dx; // Balik arah X
    }
    if (this.y <= 0) {
      this.dy = -this.dy; // Balik arah Y
    }
  }

  isDead() {
    return this.y > canvas.height; // Jika keluar bawah, bola hilang
  }

  checkCollision(brick) {
    const ballLeft = this.x - this.size;
    const ballRight = this.x + this.size;
    const ballTop = this.y - this.size;
    const ballBottom = this.y + this.size;

    const brickLeft = brick.x;
    const brickRight = brick.x + brick.width;
    const brickTop = brick.y;
    const brickBottom = brick.y + brick.height;

    // Periksa apakah bola berada dalam area bounding box brick
    return !(ballRight < brickLeft ||
      ballLeft > brickRight ||
      ballBottom < brickTop ||
      ballTop > brickBottom);
  }

  handleBallBrickCollision(brick) {
    const brickCenterX = brick.x + brick.width / 2;
    const brickCenterY = brick.y + brick.height / 2;

    // Menentukan arah pantulan bola berdasarkan posisi relatif dengan brick
    if (this.x - this.size < brick.x || this.x + this.size > brick.x + brick.width) {
      this.dx = -this.dx;  // Bola memantul horizontal
    }

    if (this.y - this.size < brick.y || this.y + this.size > brick.y + brick.height) {
      this.dy = -this.dy;  // Bola memantul vertikal
    }
  }

}
