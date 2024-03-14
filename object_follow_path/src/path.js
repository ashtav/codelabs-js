export class Path {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.size = 2
        this.color = '#fff'

        this.path = [];
        this.passed = false
    }

    addPointToPath(x, y) {
        this.path.push({ x, y });
    }

    clearPath() {
        this.path = [];
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        for (let i = 0; i < this.path.length; i++) {
            ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.stroke();

    }

    update(ctx) {
        this.draw(ctx);
    }
}