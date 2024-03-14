export class Square {
    constructor(x, y) {
        this.x = x
        this.y = y

        this.speed = 1;
        this.angle = 4.7;
    }

    draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.fillStyle = '#fff'
        ctx.fillRect(-3, -3, 10, 3)

        ctx.beginPath();
        ctx.moveTo(5, -1.5);
        ctx.lineTo(12, -1.5);
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        ctx.restore()
    }

    update(ctx, path) {
        this.draw(ctx)
        this.move(path)
    }

    move(path) {
        if (path.length > 0) {
            // Ambil titik pertama dalam jalur sebagai target
            const targetX = path[0].x;
            const targetY = path[0].y;

            // Hitung perbedaan antara posisi kotak dan target
            const dx = targetX - this.x;
            const dy = targetY - this.y;

            // Hitung jarak antara kotak dan target
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Pergerakan hanya jika jarak lebih besar dari kecepatan kotak
            if (distance > this.speed) {
                // Hitung rasio pergerakan
                const ratio = this.speed / distance;
                this.x += dx * ratio;
                this.y += dy * ratio;
            } else {
                // Hapus titik pertama dari jalur setelah mencapai
                path.shift();
            }

            // Hitung sudut antara kotak dan target
            this.angle = Math.atan2(dy, dx);
        }
    }



}