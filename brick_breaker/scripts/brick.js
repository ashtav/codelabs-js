import { Lib } from "../../assets/scripts/lib.js";

export class Brick {
  constructor(x, y, w, h, value = 3) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.value = value;
    this.radius = 3;
  }

  draw(ctx) {
    ctx.fillStyle = Lib.hexToRgb('#555555');  // Bisa ditambahkan perubahan warna jika nilai berkurang
    // ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.beginPath();
    ctx.moveTo(this.x + this.radius, this.y); // Pindah ke titik awal dengan radius
    ctx.lineTo(this.x + this.width - this.radius, this.y); // Garis atas
    ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.height, this.radius); // Sudut kanan atas
    ctx.lineTo(this.x + this.width, this.y + this.height - this.radius); // Garis kanan
    ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width - this.radius, this.y + this.height, this.radius); // Sudut kanan bawah
    ctx.lineTo(this.x + this.radius, this.y + this.height); // Garis bawah
    ctx.arcTo(this.x, this.y + this.height, this.x, this.y + this.height - this.radius, this.radius); // Sudut kiri bawah
    ctx.lineTo(this.x, this.y + this.radius); // Garis kiri
    ctx.arcTo(this.x, this.y, this.x + this.radius, this.y, this.radius); // Sudut kiri atas
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "white";  // Warna teks
    ctx.font = "12px Courier New, Courier, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.value, this.x + this.width / 2, this.y + this.height / 2);  // Menempatkan angka di tengah brick
  }

  // Method untuk mengurangi nilai brick
  hit() {
    if (this.value > 0) {
      this.value -= 1;  // Kurangi nilai
    }
  }

  // Brick mati jika nilai mencapai 0
  isDead() {
    return this.value <= 0;
  }
}
