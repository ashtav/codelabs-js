export class Controller {
    constructor() {

    }

    static init(args = {}) {
        document.addEventListener('keydown', (e) => args.onKeyDown(e));
        document.addEventListener('click', (e) => args.onClick(e));
        document.addEventListener('mousemove', (e) => args.onMove(e));
    }
}