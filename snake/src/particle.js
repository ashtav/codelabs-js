export class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.size = 2;
        this.speed = 1;

        this.velocity = {
            x: (Math.random() - 0.5) * (Math.random() * 6),
            y: (Math.random() - 0.5) * (Math.random() * 6)
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    update(ctx) {
        this.draw(ctx);
        this.x += this.velocity.x * this.speed;
        this.y += this.velocity.y * this.speed;
        this.size -= 0.01;
    }
}