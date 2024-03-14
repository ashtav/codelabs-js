import { Food } from './food.js';
import { Game } from './game.js';
import { Hook } from './hook.js';
import { Particle } from './particle.js';
import { Player } from './player.js';

import { el, getRandSpeed, hexToRGBA, setText } from './utils.js';

const game = new Game();
const player = new Player(canvas.width / 2, canvas.height / 2);

const ctx = canvas.getContext('2d');

let foods = [], particles = [], hooks = [];
let score = 0

const path = '/assets/audio/',
    audio = new Audio(path + 'eat.mp3'),
    childEat = new Audio(path + 'eat1.mp3'),
    explode = new Audio(path + 'exploded.mp3');

// draw square in canvas
function drawSquares() {
    var boxSize = 15;
    var rows = canvas.height / boxSize;
    var cols = canvas.width / boxSize;

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var x = j * boxSize;
            var y = i * boxSize;

            // if player near this box, draw it with different color
            const dx = Math.abs(x - player.x);
            const dy = Math.abs(y - player.y);

            if (dx < boxSize + (5 * player.i) && dy < boxSize + 10 * player.i) {
                ctx.strokeStyle = "rgb(255, 165, 0)";
                ctx.fillStyle = "rgb(255, 165, 165, .1)";
                ctx.fillRect(x, y, boxSize, boxSize);
                ctx.lineWidth = 0.05;
                ctx.strokeRect(x, y, boxSize - 0.5, boxSize - 0.5);
            }

            // change background color if there is food
            foods.forEach(food => {
                if (food.x === x && food.y === y) {
                    ctx.fillStyle = hexToRGBA('#222', .8);
                    ctx.fillRect(x, y, boxSize, boxSize);
                }
            })

            ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
            ctx.lineWidth = 0.2;
            ctx.strokeRect(x, y, boxSize - 0.5, boxSize - 0.5);
        }
    }
}

// drawSquares()

function renderFoods() {
    if (foods.length < 50) {
        const food = new Food();
        food.randomize(player);

        // random blink
        food.blink = Math.random() > .8
        food.color = food.blink ? '#FFA500' : '#008000'

        // random number betwee 3 - 25
        food.egg = Math.floor(Math.random() * 25) + 3

        foods.push(food);
    }

    foods.forEach((food, i) => {
        food.update(ctx);

        // check collision with all foods
        const dx = Math.abs(food.x - player.x - player.size / 2);
        const dy = Math.abs(food.y - player.y);

        if (dx < food.size + player.size / 2 && dy < player.size) {
            // create particle in the middle of food
            const particle = new Particle(food.x, food.y);
            particle.velocity = {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6)
            }

            particles.push(particle)

            if (food.blink) {
                explode.currentTime = 0
                explode.play()

                for (let i = 0; i < food.egg; i++) {
                    const hook = new Hook(player.x, player.y);
                    hook.speed = getRandSpeed(1)
                    hooks.push(hook)
                }
            }

            foods.splice(i, 1);
            player.maxCells++;
            score++;

            // play sound
            audio.currentTime = 0
            audio.play()

            // max speed is 9
            player.speed += .005
            player.speed = Math.min(15, player.speed)
        }
    })

    if (player.autoPick) {
        // find closest food
        let closestFood = null;
        let closestDistance = Infinity;

        for (let food of foods) {
            food.color = food.blink ? '#FFA500' : '#008000'

            // Hitung jarak antara pemain dan makanan
            const distance = Math.sqrt((food.x - player.x) ** 2 + (food.y - player.y) ** 2);

            // Jika jarak lebih dekat dari sebelumnya, update makanan terdekat dan jaraknya
            if (distance < closestDistance) {
                closestFood = food;
                closestDistance = distance;
            }
        }

        if (closestFood) {
            const target = closestFood

            if (!target.blink) {
                target.color = '#ff0000'
            }

            if (player.y < target.y) {
                player.down()

                if (player.x < target.x) {
                    player.right()
                }
            }

            else if (player.y > target.y) {
                player.up()

                if (player.x > target.x) {
                    player.left()
                }
            }
        } else {
            console.log('no food found!')
        }
    }

    ctx.fillStyle = 'white';
    ctx.fillText(`Speed: ${player.speed.toFixed(2)},
Particles: ${particles.length},
`, 10, 15);
}

function onRendered() {
    // render particles
    particles.forEach((particle, i) => {
        particle.update(ctx);

        if (particle.size <= 0) {
            particles.splice(i, 1);
        }
    })

    // render hook
    hooks.forEach((hook, i) => {
        // get 5 closest foods
        const closestFoods = foods.sort((a, b) => {
            const distanceA = Math.sqrt((a.x - hook.x) ** 2 + (a.y - hook.y) ** 2);
            const distanceB = Math.sqrt((b.x - hook.x) ** 2 + (b.y - hook.y) ** 2);

            return distanceA - distanceB
        })

        // if hook touch food, remove the food
        closestFoods.forEach((food, i) => {
            const dx = Math.abs(food.x - hook.x);
            const dy = Math.abs(food.y - hook.y);

            if (dx < food.size + hook.size && dy < hook.size) {
                foods.splice(i, 1);
                hook.isAboutToDie = true
                score++
                
                childEat.currentTime = 0
                childEat.play()
            }

            if(player.idle){
                hook.isAboutToDie = true
            }
        })

        if (hook.isAboutToDie) {
            hook.tailLength -= 1
            hook.tail.pop()

            if (hook.tailLength <= 0) {
                hooks.splice(i, 1)
            }
        }

        hook.update(ctx, closestFoods[i])
    })

}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSquares()

    renderFoods()
    onRendered()
    player.update(ctx);

    setText('score', score)
    setText('food', foods.length)
    setText('cell', player.maxCells)
    setText('children', hooks.length)

}

const controls = {
    onKeyDown: (e) => {
        // if space
        if (e.keyCode === 32) {
            hooks = []

            for (let i = 0; i < 5; i++) {
                const hook = new Hook(player.x, player.y);
                hooks.push(hook)
            }

            return
        }

        const control = {
            38: () => player.up(),
            40: () => player.down(),
            37: () => player.left(),
            39: () => player.right(),
            32: () => player.autoPick = !player.autoPick
        }

        control[e.keyCode] && control[e.keyCode]()
        audio.currentTime = 0
        audio.play()
    },

    onClick: (e) => {
        const food = new Food();
        food.x = e.clientX - player.size - 5
        food.y = e.clientY - player.size - 5

        foods.push(food)
    },

    onMove: (e) => {
        if (player.followCursor) {
            canvas.style.cursor = 'none';

            player.x = e.clientX - player.size - 5
            player.y = e.clientY - player.size - 5
        }
    },
}

el('start').addEventListener('click', () => {
    player.audio.play()
    childEat.play()

    explode.muted = true
    explode.play()

    explode.onended = () => explode.muted = false

    el('start').style.display = 'none';
    el('.backdrop').style.display = 'none';
    game.init(render).control(controls)
})