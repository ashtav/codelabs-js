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

    this.ready = false;

    setTimeout(() => {
      this.ready = true;
    }, 500);
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
    return !(
      ballRight < brickLeft ||
      ballLeft > brickRight ||
      ballBottom < brickTop ||
      ballTop > brickBottom
    );
  }

  handleBallBrickCollision(brick) {
    if (
      this.x - this.size < brick.x ||
      this.x + this.size > brick.x + brick.width
    ) {
      this.dx = -this.dx; // Bola memantul horizontal
    }

    if (
      this.y - this.size < brick.y ||
      this.y + this.size > brick.y + brick.height
    ) {
      this.dy = -this.dy; // Bola memantul vertikal
    }
  }

  handleBallPlayerCollision(player, speed = 3) {
    if (!this.ready) return;

    const playerLeft = player.x - player.width / 2;
    const playerRight = player.x + player.width / 2;
    const playerTop = player.y - player.height / 2;
    const playerBottom = player.y + player.height / 2;

    // Cek apakah bola bertabrakan dengan player
    if (
      this.x + this.size > playerLeft &&
      this.x - this.size < playerRight &&
      this.y + this.size > playerTop &&
      this.y - this.size < playerBottom
    ) {
      this.speed = speed

      // **Pantulkan bola ke atas** (hindari menembus player)
      this.y = playerTop - this.size; // Pastikan bola langsung di atas player
      this.dy = -Math.abs(this.dy); // Selalu mantul ke atas

      // **Hit Position**: Jika kena pinggir player, pantulkan ke samping juga
      const hitPos = (this.x - player.x) / (player.width / 2);
      this.dx = hitPos * this.speed; // Semakin jauh dari tengah, semakin miring arahnya
    }
  }
}
