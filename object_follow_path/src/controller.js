export class Controller {
    constructor() {

    }

    static init(args = {}) {
        document.addEventListener('click', (e) => args?.onClick(e));
        document.addEventListener('mousemove', (e) => args?.onMove(e));
        document.addEventListener('mousedown', (e) => args?.onMouseDown(e));
        document.addEventListener('mouseup', (e) => args?.onMouseUp(e));
    }
}