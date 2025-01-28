export class Utils {
  static html(id, value) {
    document.getElementById(id).innerHTML = value;
  }

  static gameOver(ctx, canvas) {
    ctx.fillStyle = "white";
    ctx.font = "30px Courier New, Courier, monospace";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, (canvas.height / 2) - 10);

    ctx.font = "11px Courier New, Courier, monospace";
    ctx.fillText("Press space to start over.", canvas.width / 2, (canvas.height / 2) + 10);
  }

  static drawCircle(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
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

    return nearest
  }
}
