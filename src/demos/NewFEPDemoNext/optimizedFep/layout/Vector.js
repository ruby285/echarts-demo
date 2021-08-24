class Vector {
  setValues(x, y) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  sub(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  multiplyConst(c) {
    return new Vector(this.x * c, this.y * c);
  }

  divideConst(c) {
    return new Vector(this.x / c, this.y / c);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  mag() {
    return Math.sqrt(this.dot(this));
  }

  normalize() {
    return this.divideConst(this.mag());
  }

  constructor(x = 0.0, y = 0.0) {
    this.x = x;
    this.y = y;
  }
}

export default Vector;
