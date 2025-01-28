export class Package {
  constructor() {
    // Set a random x position at the top of the screen
    this.x = Math.random() * canvas.width;
    this.y = -10; // Start just above the canvas
    this.size = 5; // Size of the package (e.g., a square)
    this.speed = 1; // Speed of the package moving down
    this.color = "green"; // Color of the package

    this.data = {
      type: "health",
      value: 50,
    };
  }

  update() {
    // Move the package down
    this.y += this.speed;

    // If the package goes below the canvas, it disappears
    if (this.y > canvas.height) {
      return true; // Indicating the package has moved off-screen
    }
    return false;
  }

  draw(ctx) {
    // Draw the package with the set color and size
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}
