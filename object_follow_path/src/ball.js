export class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.velocity = { x: 0, y: -4 }
        this.size = 2.3;
        this.speed = 1
        this.power = 1
        this.tailLength = 10; // adjust tail length as needed
        this.tail = []; // array to store past positions
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // draw the tail
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; // adjust tail color and opacity as needed
        for (let i = 0; i < this.tail.length; i++) {
            const tailSegment = this.tail[i];
            ctx.beginPath();
            ctx.arc(tailSegment.x, tailSegment.y, this.size - (i * 0.2), 0, Math.PI * 2);
            ctx.fill();
        }
    }

    update(ctx) {
        // Update tail
        this.tail.unshift({ x: this.x, y: this.y }); // add current position to the beginning of the tail array
        if (this.tail.length > this.tailLength) {
            this.tail.pop(); // remove oldest position if tail exceeds desired length
        }

        this.x += this.velocity.x * this.speed;
        this.y += this.velocity.y * this.speed;

        if (this.y < 0 || this.y > canvas.height || this.power <= 0) {
            this.velocity.y = -this.velocity.y;
            this.speed += .003
        }

        // horizontal collision
        if (this.x > ctx.canvas.width || this.x < 0) {
            this.velocity.x = -this.velocity.x;
            this.speed += .003
        }
 
        if (this.y > canvas.height) {
            this.power = 0
        }

        // max speed is 4
        this.speed = Math.min(4, this.speed)

        this.draw(ctx);
    }
}
