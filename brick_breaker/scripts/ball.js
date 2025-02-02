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
    this.lastY = this.y;

    let steps = Math.ceil(this.speed / 2); // Bagi pergerakan ke beberapa langkah kecil
    let stepX = this.dx / steps;
    let stepY = this.dy / steps;

    for (let i = 0; i < steps; i++) {
      this.x += stepX;
      this.y += stepY;

      // Cegah tembus di dinding
      if (this.x <= 0 || this.x >= canvas.width) {
        this.dx = -this.dx;
        break; // Hentikan pergerakan setelah tabrakan
      }
      if (this.y <= 0) {
        this.dy = -this.dy;
        break;
      }
    }
  }


  isDead() {
    // Hitung jika bola melompati batas bawah dalam satu frame
    const passedBottom = this.lastY <= canvas.height && this.y + this.size >= canvas.height;

    return (
      passedBottom ||
      (this.x + this.size < 0) ||
      (this.x > canvas.width + this.size)
    );
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

  handleBallPlayerCollision(player, speed = 3, audios) {
    if (!this.ready) return;

    const playerLeft = player.x - player.width / 2;
    const playerRight = player.x + player.width / 2;
    const playerTop = player.y - player.height / 2;
    const playerBottom = player.y + player.height / 2;

    // Prediksi lintasan bola untuk cek apakah akan melewati paddle dalam frame berikutnya
    const nextY = this.y + this.dy;
    const nextX = this.x + this.dx;

    if (
      this.lastY + this.size <= playerTop && nextY + this.size >= playerTop &&
      nextX + this.size > playerLeft && nextX - this.size < playerRight
    ) {
      this.speed = Math.min(speed, 4);
      Lib.shuffleArray(audios)[0].play();

      // Pastikan bola tetap di atas player
      this.y = playerTop - this.size;
      this.dy = -Math.abs(this.dy);

      // Hit Position dengan batasan agar tidak terlalu miring
      const hitPos = (this.x - player.x) / (player.width / 2);
      this.dx = Math.max(-0.8, Math.min(0.8, hitPos)) * this.speed;
    }
  }

}
