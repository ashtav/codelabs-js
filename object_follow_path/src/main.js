import { Game } from './game.js';
import { Square } from './square.js';

import { hexToRGBA } from './utils.js';


const game = new Game();
const ctx = canvas.getContext('2d');

// const ant = new Ant(canvas.width / 2, canvas.height / 2);
const player = new Square(canvas.width / 2, canvas.height / 2);

let keys = {
    mousedown: false,
}


let lastX = 0;
let lastY = 0;
let path = []

function renderPath(path) {
    if (path && path.length > 0) {
        path.forEach((point, i) => {
            // Check if the next point is defined
            if (path[i + 1]) {
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(path[i + 1].x, path[i + 1].y);

                // Change color of line to red if the point has been passed
                ctx.strokeStyle = hexToRGBA('#fff', point.passed ? 1 : .5)
                ctx.stroke();
            }
        });
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // render path
    renderPath(path)
    player.update(ctx, path);
}

function drawPath(e) {
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
    // Add the current point to the path
    path.push({ x: e.offsetX, y: e.offsetY });
}

const controls = {
    onClick: (e) => {
        drawPath(e)
    },

    onMouseDown: (e) => {
        keys.mousedown = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    },
    onMouseUp: (e) => keys.mousedown = false,

    onMove: (e) => {
        if (keys.mousedown) {
            drawPath(e);
        }
    },
}

game.init(render).control(controls)
