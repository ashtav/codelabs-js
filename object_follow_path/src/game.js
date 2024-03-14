import { Controller } from './controller.js';

export class Game {
    constructor() {
        this.active = true;
    }

    init(onRendered) {
        canvas.addEventListener('mouseover', () => {
            // canvas.style.cursor = 'none';
        });

        canvas.addEventListener('mouseout', () => {
            canvas.style.cursor = 'default';
        });

        const doLoop = () => {
            if (!this.active) {
                return
            }

            onRendered()
            requestAnimationFrame(doLoop);
        }

        doLoop()
        return this
    }

    control(args){
        Controller.init(args)
    }
}