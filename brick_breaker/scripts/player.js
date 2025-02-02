export class Player {
  constructor(x) {
    this.width = 50;
    this.height = 2;

    this.x = x;
    this.y = canvas.height - 10;

    this.isAttacked = false;
    this.blinking = false;
    this.blinkStartTime = 0; // To track the time when attack happens

    this.stickAngle = 0;

    window.addEventListener("wheel", (e) => {
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      this.stickAngle = Math.max(-1, Math.min(1, this.stickAngle + delta));
    });
  }

  draw(ctx) {
    // Set opacity based on blinking state
    ctx.fillStyle = `rgba(255, 255, 255, ${this.blinking ? 0.4 : 1})`;

    // Define rectangle properties
    const width = this.width;
    const height = this.height;
    const radius = 2;

    // Draw rounded rectangle
    ctx.beginPath();
    ctx.moveTo(this.x - width / 2 + radius, this.y - height / 2);
    ctx.lineTo(this.x + width / 2 - radius, this.y - height / 2);
    ctx.arcTo(
      this.x + width / 2,
      this.y - height / 2,
      this.x + width / 2,
      this.y - height / 2 + radius,
      radius
    );
    ctx.lineTo(this.x + width / 2, this.y + height / 2 - radius);
    ctx.arcTo(
      this.x + width / 2,
      this.y + height / 2,
      this.x + width / 2 - radius,
      this.y + height / 2,
      radius
    );
    ctx.lineTo(this.x - width / 2 + radius, this.y + height / 2);
    ctx.arcTo(
      this.x - width / 2,
      this.y + height / 2,
      this.x - width / 2,
      this.y + height / 2 - radius,
      radius
    );
    ctx.lineTo(this.x - width / 2, this.y - height / 2 + radius);
    ctx.arcTo(
      this.x - width / 2,
      this.y - height / 2,
      this.x - width / 2 + radius,
      this.y - height / 2,
      radius
    );
    ctx.closePath();
    ctx.fill();

    // draw dashed stick, length = 10
    this.drawStick(ctx);
  }

  drawStick(ctx) {
    const stickLength = 100;
    const stickThickness = 0.5;
    const angleRad = (this.stickAngle * Math.PI) / 4;

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
    ctx.lineDashOffset = (-performance.now() / 50) % 10; // Gerakan ke atas

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.setLineDash([]); // Reset dash
  }

  fire(pressed) { }

  findBall(balls) {
    let nearest = null;
    let shortestDistance = Infinity;

    balls.forEach((ball) => {
      if (ball.dy < 0 || ball.y < (canvas.height / 2)) return;

      const distanceToBottom = canvas.height - ball.y;

      if (distanceToBottom < shortestDistance) {
        shortestDistance = distanceToBottom;
        nearest = ball;
      }
    });

    if (nearest) {
      let speed = 3.5; // Kecepatan dasar
      let targetX = nearest.x;
      let targetY = nearest.y;

      // Menambahkan sedikit variasi arah supaya lebih natural
      // let randomness = (Math.random() - 0.1) * 1;
      // targetX += randomness;
      // targetY += randomness;

      // Hitung arah menuju target
      let directionX = targetX - this.x;
      let directionY = targetY - this.y;
      let length = Math.sqrt(directionX * directionX + directionY * directionY);

      let distanceX = nearest.x - this.x;
      let normalizedAngle = Math.max(
        -1,
        Math.min(1, distanceX / (canvas.width / 2))
      );

      this.stickAngle = normalizedAngle;

      if (length > 0) {
        this.x +=
          (directionX / length) * speed * Math.min(shortestDistance, 10);

        if (this.x < 0) {
          this.x = 0;
        } else if (this.x > canvas.width) {
          this.x = canvas.width - this.width;
        }
      }
    }
  }
}
