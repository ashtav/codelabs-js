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
}
