export class Enemy {
    constructor(playerX, playerY) {
      // Posisi awal random dari atas layar
      this.x = Math.random() * canvas.width;
      this.y = -10; // Di luar layar atas
      this.size = 2; // Ukuran enemy (lingkaran)
  
      // Kecepatan gerak
      this.speed = 1;
      this.targetX = playerX;
      this.targetY = playerY;
  
      // Ekor
      this.tails = [];
      this.maxTails = 20; // Maksimal panjang ekor
    }
  
    update(playerX, playerY) {
      // Tambahkan posisi sekarang ke ekor
      this.tails.unshift({ x: this.x, y: this.y });
  
      // Hapus bagian ekor yang melebihi panjang maksimal
      if (this.tails.length > this.maxTails) {
        this.tails.pop();
      }
  
      // Gerak menuju posisi player
      const dx = playerX - this.x;
      const dy = playerY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocityX = (dx / distance) * this.speed;
      const velocityY = (dy / distance) * this.speed;
  
      this.x += velocityX;
      this.y += velocityY;
    }
  
    draw(ctx) {
      // Draw the tail
      this.tails.forEach((tail, index) => {
        const tailSize = 1 * (index / this.tails.length); // Ukuran mengecil
        if (tailSize > 0) {
          ctx.fillStyle = `rgba(255, 0, 0, ${1 - index / this.tails.length})`; // Warna memudar
          ctx.beginPath();
          ctx.arc(tail.x, tail.y, tailSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });
  
      // Draw the enemy body (circle)
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  