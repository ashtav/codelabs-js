export class Lib {
  static audio(name) {
    const audio = new Audio("/assets/audio/" + name + ".mp3");

    const play = () => {
      audio.muted = false
      audio.load()
      audio.play();
    };

    const init = () => {
      audio.muted = true
      audio.play()
    }

    return {
      init: init,
      play: play,
    };
  }

  // check if two objects collided
  // each object must have x, y, and size properties
  static collision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < obj1.size + obj2.size;
  }

  static rgba(rgb, a) {
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;
  }

  static hexToRgb(hex) {
    hex = hex.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgb(${r}, ${g}, ${b})`;
  }


  static shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static id() {
    return (
      new Date().getTime() + "-" + Math.random().toString(36).substring(2, 9)
    );
  }

  /* 
  
  Example usage of getNearestFrom

  const enemies = [
    { x: 100, y: 200 },
    { x: 50, y: 150 },
    { x: 200, y: 50 }
  ];

  const player = { x: 120, y: 100 };
  const result = Utils.getNearestFrom(enemies, player)

  */

  static getNearestFrom(array, object) {
    if (array.length == 0) {
      return null;
    }

    let nearest = null;
    let shortestDistance = Infinity;

    array.forEach((arr) => {
      const dx = arr.x - object.x;
      const dy = arr.y - object.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearest = arr;
      }
    });

    return nearest;
  }

  static html(id, value) {
    document.getElementById(id).innerHTML = value;
  }

  static gameOver(ctx) {
    ctx.fillStyle = "white";
    ctx.font = "30px Courier New, Courier, monospace";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 10);

    ctx.font = "11px Courier New, Courier, monospace";
    ctx.fillText(
      "Press space to start over.",
      canvas.width / 2,
      canvas.height / 2 + 10
    );
  }

  static drawCircle(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  static generateRandomNumber(length = 2) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generateRandomMultiples(multiple, count) {
    const result = [];
    const min = Math.pow(10, multiple - 1);
    const max = Math.pow(10, multiple) - 1;

    while (result.length < count) {
      let num = Math.floor(Math.random() * (max - min + 1)) + min;
      result.push(num);
    }

    return result;
  }



}
