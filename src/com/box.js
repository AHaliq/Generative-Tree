export default class Box {
  constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
    this.o1 = { x: x1, y: y1 };
    this.o2 = { x: x2, y: y2 };
  }
  get width() {
    return this.o2.x - this.o1.x;
  }
  set width(v) {
    this.o2.x = v + this.o1.x;
  }
  get height() {
    return this.o2.y - this.o1.y;
  }
  set height(v) {
    this.o2.y = v + this.o1.y;
  }
}
