import { Lib } from "../../assets/scripts/lib.js";

export class Logistic {
  constructor(type = "H") {
    this.x = Math.random() * canvas.width;
    this.y = -10;
    this.speed = 1;
    this.visible = true;
    this.size = 2;

    this.type = type;

    setInterval(() => {
      this.visible = !this.visible;
    }, 1000);
  }

  update() {
    this.y += this.speed;

    if (this.y > canvas.height + this.size + 100) {
      return true;
    }

    return false;
  }

  drawDashedLine(ctx) {
    ctx.setLineDash([5, 5]); // Panjang garis 5px, jarak antar garis 5px
    ctx.lineWidth = .5;
    ctx.lineDashOffset = -this.y % 20; // Efek bergerak ke atas
  
    for (let i = 1; i < 8; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, 255, 255, ${1 - i * 0.1})`; // Semakin ke atas semakin pudar
      ctx.moveTo(this.x, this.y - i * 8);
      ctx.lineTo(this.x, this.y - (i + 1) * 8);
      ctx.stroke();
    }
    
    ctx.setLineDash([]); // Reset ke garis solid setelah menggambar dashed
  }

  draw(ctx) {
    ctx.fillStyle = Lib.rgba([255, 255, 255], this.visible ? 1 : 0.5);
    ctx.font = `${this.size + 10}px Courier New, Courier, monospace`;
    ctx.textAlign = "center";
    ctx.fillText(this.type, this.x, this.y);

    this.drawDashedLine(ctx);
  }
}
