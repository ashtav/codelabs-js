import { hexToRGBA } from './utils.js';

export class Player {
    // this is the player class as snake in this game

    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.speed = 1
        this.cells = [];
        this.maxCells = 15;
        this.size = 5
        this.color = '#fff'

        this.velocity = {
            x: 0,
            y: 0
        }

        this.autoPick = true
        this.followCursor = false
        this.idle = false

        this.lastMovements = []
        this.maxLastMovements = 25
        this.i = 1

        this.audio = new Audio('/assets/audio/deactive.mp3')
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.size, this.size);

        // Draw the lines connecting the cells
        ctx.strokeStyle = hexToRGBA(this.color, .5)
        ctx.lineWidth = 1; // Adjust the width of the lines as needed
        ctx.beginPath();
        ctx.moveTo(this.x + this.size / 2, this.y + this.size / 2); // Start from the center of the head

        this.cells.forEach((cell, i) => {
            let cellCenterX = cell.x + this.size / 2;
            let cellCenterY = cell.y + this.size / 2;
            ctx.lineTo(cellCenterX, cellCenterY);
        });

        ctx.stroke();

        // Draw the cells
        ctx.fillStyle = hexToRGBA(this.color, this.cells.length > 100 ? .5 : .1);
        this.cells.forEach((cell, i) => {
            let size = this.size - (i * 0.1);
            size = Math.max(size, 1.5);

            let offsetX = (this.size - size) / 2;
            let offsetY = (this.size - size) / 2;

            ctx.fillRect(cell.x + offsetX, cell.y + offsetY, size, size);
        });
    }

    update(ctx) {
        this.draw(ctx);

        this.x += this.velocity.x * this.speed;
        this.y += this.velocity.y * this.speed;

        // handle collision with walls
        if (this.x + this.size < 0) {
            this.x = canvas.width
        }

        if (this.x > canvas.width) {
            this.x = 0
        }

        if (this.y + this.size < 0) {
            this.y = canvas.height
        }

        if (this.y > canvas.height) {
            this.y = 0
        }

        this.lastMovements.unshift({ x: this.x, y: this.y });
        if (this.lastMovements.length > this.maxLastMovements) {
            this.lastMovements.pop();
        }

        this.cells.unshift({ x: this.x, y: this.y });

        if (this.cells.length > this.maxCells) {
            this.cells.pop();
        }

        if (this.checkRepeatedMovements() && this.autoPick) {
            const delay = 500 * this.speed

            this.maxCells -= Math.floor(this.speed)

            this.audio.play()
            this.autoPick = false;
            this.speed = this.speed > 5 ? 5 : this.speed
            this.color = '#ff0000'

            // change canvas color
            canvas.style.backgroundColor = '#000'
            this.i += .1

            this.idle = true

            setTimeout(() => {
                this.autoPick = true;
                this.idle = false
                this.color = '#fff'

                canvas.style.backgroundColor = '#111'
                this.i = 1
            }, delay);
        }
    }

    left() {
        this.velocity.x = -1;
        this.velocity.y = 0;
    }

    right() {
        this.velocity.x = 1;
        this.velocity.y = 0;
    }

    up() {
        this.velocity.x = 0;
        this.velocity.y = -1;
    }

    down() {
        this.velocity.x = 0;
        this.velocity.y = 1;
    }

    checkRepeatedMovements() {
        const movementCount = {};

        for (let i = 0; i < this.lastMovements.length; i++) {
            const movement = this.lastMovements[i];
            const key = movement.x + ',' + movement.y; // Buat kunci unik berdasarkan nilai x dan y

            movementCount[key] = (movementCount[key] || 0) + 1;

            if (movementCount[key] === 3) {
                return true;
            }
        }

        return false
    }
}