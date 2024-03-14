export class Hook {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.size = 2;
        this.speed = 1;

        this.velocity = {
            x: (Math.random() - 0.5) * (Math.random() * 6),
            y: (Math.random() - 0.5) * (Math.random() * 6)
        }

        this.length = 1;
        this.hooks = [];
        this.tail = [];
        this.tailLength = 15;

        this.isAboutToDie = false;

        this.startTime = new Date()
        this.time = 0;
    }

    draw(ctx) {
        // Draw the hook
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.size, this.size);

        // Draw the tail
        ctx.strokeStyle = 'white'; // Set the color of the tail
        ctx.lineWidth = 1; // Set the width of the tail
        ctx.beginPath();

        ctx.moveTo(this.x + this.size / 2, this.y + this.size / 2); // Move to the starting point of the tail
        this.tail.forEach((segment, i) => {
            const tailSize = this.size * .1; // Calculate size of tail segment
            ctx.lineTo(segment.x, segment.y); // Draw a line to each segment of the tail
            ctx.lineWidth = tailSize; // Set the width of the tail segment
        });

        ctx.stroke();
    }

    update(ctx, food) {

        if (this.time < 5) {
            this.x += this.velocity.x * this.speed;
            this.y += this.velocity.y * this.speed;

            const currentTime = new Date();
            const elapsedTime = Math.floor((currentTime - this.startTime) / 1000);
            this.time += elapsedTime;
        } else {
            if (food) {
                const dx = food.x - this.x;
                const dy = food.y - this.y;

                const angle = Math.atan2(dy, dx);
                this.velocity.x = Math.cos(angle);
                this.velocity.y = Math.sin(angle);

                this.x += this.velocity.x * this.speed;
                this.y += this.velocity.y * this.speed;

                this.startTime = new Date();
            } else {
                this.isAboutToDie = true;
                this.tailLength -= 1;
                this.tail.pop();
            }
        }

        // Update the tail
        this.updateTail();
        this.draw(ctx);
    }

    updateTail() {
        // Add a new segment to the beginning of the tail
        this.tail.unshift({ x: this.x + this.size / 2, y: this.y + this.size / 2 });

        // Trim the tail if it exceeds the maximum length
        if (this.tail.length > this.tailLength) {
            this.tail.pop();
        }
    }
}
