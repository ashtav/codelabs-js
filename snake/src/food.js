import { hexToRGBA } from './utils.js';

export class Food {
    constructor() {
        this.x = 0;
        this.y = 0;

        this.size = 5
        this.color = '#008000'

        this.blink = false
        this.opacity = 1
        this.egg = 5
    }

    isOnSnake(snake) {
        for (let part of snake.cells) {
            if (this.x === part.x && this.y === part.y) {
                return true;
            }
        }
        return false;
    }

    randomize(snake) {
        const cols = Math.floor(canvas.width / snake.size);
        const rows = Math.floor(canvas.height / snake.size);

        do {
            this.x = Math.floor(Math.random() * cols) * snake.size;
            this.y = Math.floor(Math.random() * rows) * snake.size;
        } while (this.isOnSnake(snake));
    }

    draw(ctx) {
        ctx.fillStyle = hexToRGBA(this.color, this.opacity);
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    update(ctx) {
        if (this.blink) {
            this.opacity -= 0.02;

            if (this.opacity < 0.1) {
                this.opacity = 1;
            }
        }

        this.draw(ctx);

    }
}