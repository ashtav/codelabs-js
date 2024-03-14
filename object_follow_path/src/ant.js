export class Ant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.pathIndex = 0; // Index of the current point on the path
        this.speed = 1; // Speed of the ant
        this.angle = 0;
        this.legLength = 5; // Panjang kaki
        this.legStep = 0.2; // Langkah kaki
        this.legAngle = 0; // Sudut kaki
        this.legPhase = [0, Math.PI, Math.PI / 2, (Math.PI / 2) + Math.PI]; // Fase awal untuk setiap kaki

        this.velocity = { x: Math.cos(this.angle) * this.speed, y: Math.sin(this.angle) * this.speed };
    }

    draw(ctx) {
        ctx.save(); // Simpan konteks rendering sebelumnya
        ctx.translate(this.x, this.y); // Pindahkan origin rendering ke posisi semut
        ctx.rotate(this.angle); // Putar gambar semut sesuai sudut

        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2); // Koordinat (0, 0) adalah posisi relatif ke semut
        ctx.fillStyle = '#fff';
        ctx.fill();

        // Menggambar kaki semut
        for (let i = 0; i < 4; i++) {
            const angle = this.legPhase[i] + Math.sin(this.legAngle + (i * Math.PI * 2) / 4) * 0.5; // Sudut kaki yang dipengaruhi oleh sinusoidal
            const legX = Math.cos(angle) * this.size; // Koordinat x ujung kaki
            const legY = Math.sin(angle) * this.size; // Koordinat y ujung kaki
            const endLegX = legX + Math.cos(angle) * this.legLength; // Koordinat x ujung kaki saat melangkah
            const endLegY = legY + Math.sin(angle) * this.legLength; // Koordinat y ujung kaki saat melangkah

            ctx.beginPath();
            ctx.moveTo(legX, legY);
            ctx.lineTo(endLegX, endLegY);
            ctx.strokeStyle = '#fff';
            ctx.stroke();
        }

        // Gambar mulut semut (garis horizontal)
        const mouthLength = 10;
        ctx.beginPath();
        ctx.moveTo(-this.size, 0);
        ctx.lineTo(-this.size - mouthLength, 0);
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        ctx.restore(); // Pulihkan konteks rendering sebelumnya
    }


    update(ctx, path) {
        this.draw(ctx);
        this.move(path);
    }

    move(path) {
        if (path.length === 0) {
            // Move ant randomly when there is no path available
            this.x += this.velocity.x;
            this.y += this.velocity.y;

            // Change direction when the ant hits the wall
            if (this.x < 0 || this.x > canvas.width) {
                this.velocity.x *= -1;
            }

            if (this.y < 0 || this.y > canvas.height) {
                this.velocity.y *= -1;
            }

            this.legAngle += this.legStep;

            // Update angle based on velocity
            this.angle = Math.atan2(this.velocity.y, this.velocity.x);

            // Update mouth position based on angle
            const mouthLength = 10;
            const mouthX = Math.cos(this.angle) * this.size;
            const mouthY = Math.sin(this.angle) * this.size;

            // Update ant position based on mouth position
            this.x += mouthX;
            this.y += mouthY;

        } else {
            // Move ant towards the next point on the path
            if (this.pathIndex < path.length) {
                const targetX = path[this.pathIndex].x;
                const targetY = path[this.pathIndex].y;
                const dx = targetX - this.x;
                const dy = targetY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                // Move only if the distance is greater than the ant's speed
                if (distance > this.speed) {
                    const ratio = this.speed / distance;
                    this.x += dx * ratio;
                    this.y += dy * ratio;
                } else {
                    // Move to the next point in the path
                    this.pathIndex++;
                }

                // Update leg animation
                this.legAngle += this.legStep;
            }
        }
    }

}
