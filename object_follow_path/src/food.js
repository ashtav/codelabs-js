import { hexToRGBA } from './utils.js';

export class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.size = 5
        this.color = '#fff'
        this.opacity = 1
    }

    draw(ctx) {
        ctx.fillStyle = hexToRGBA(this.color, this.opacity);
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    update(ctx) {
        this.draw(ctx);
    }
}