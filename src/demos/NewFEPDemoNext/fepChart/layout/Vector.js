function Vector(x, y) {
  if (!(this instanceof Vector)) {
    return new Vector(x, y);
  }

  this.x = x || 0.0;
  this.y = y || 0.0;
}

Vector.prototype = {
  constructor: Vector,

  setValues: function (x, y) {
    this.x = x;
    this.y = y;
  },

  copy: function (x, y) {
    return new Vector(this.x, this.y);
  },

  add: function (v) {
    return new Vector(this.x + v.x, this.y + v.y);
  },

  sub: function (v) {
    return new Vector(this.x - v.x, this.y - v.y);
  },

  multiplyConst: function (c) {
    return new Vector(this.x * c, this.y * c);
  },

  divideConst: function (c) {
    return new Vector(this.x / c, this.y / c);
  },

  dot: function (v) {
    return this.x * v.x + this.y * v.y;
  },

  mag: function () {
    return Math.sqrt(this.dot(this));
  },

  normalize: function () {
    return this.divideConst(this.mag());
  },

  rand: function (minX, maxX, minY, maxY) {
    const random = (min, max) => Math.random() * max - min;
    this.x = random(minX, maxX);
    this.y = random(minY, maxY);
  },
};

export default Vector;
