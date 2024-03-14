export function setText(id, value) {
    document.getElementById(id).innerText = value;
}

export function el(id) {
    if (id.startsWith('.')) return document.querySelector(id)

    return document.getElementById(id);
}

export function getRandSpeed(level = 0, type = 'value') {
    const speeds = [
        [1, 1.3, 1.5, 1.7, 1.9],
        [2, 2.3, 2.5, 2.7, 2.9],
        [3, 3.3, 3.5, 3.7, 3.9],
        [4, 4.3, 4.5, 4.7, 4.9],
        [5, 5.3, 5.5, 5.7, 5.9],
        [6, 6.3, 6.5, 6.7, 6.9]
    ][level]

    return type == 'value' ? speeds[Math.floor(Math.random() * speeds.length)] : speeds
}

export function hexToRGBA(hex, opacity = 1) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + `,${opacity})`;
    }
    
    throw new Error('Bad Hex');
}