export class O {
  static audio(name) {
    return new Audio("/assets/audio/" + name + ".mp3");
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

  static id() {
    return (
      new Date().getTime() + "-" + Math.random().toString(36).substring(2, 9)
    );
  }
}
