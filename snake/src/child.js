export class Child {
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
        // draw the child
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.size, this.size);

        // draw the tail
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.beginPath();

        ctx.moveTo(this.x + this.size / 2, this.y + this.size / 2);
        this.tail.forEach((segment, i) => {
            const tailSize = this.size * .1;
            ctx.lineTo(segment.x, segment.y);
            ctx.lineWidth = tailSize;
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

        // update the tail
        this.updateTail();
        this.draw(ctx);
    }

    updateTail() {
        // add a new segment to the beginning of the tail
        this.tail.unshift({ x: this.x + this.size / 2, y: this.y + this.size / 2 });

        // trim the tail if it exceeds the maximum length
        if (this.tail.length > this.tailLength) {
            this.tail.pop();
        }
    }
}
