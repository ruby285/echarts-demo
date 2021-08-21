import Vector from "./Vector";
function Vertex(id, data, posX, posY) {
  if (!(this instanceof Vertex)) {
    return new Vertex(id, data, posX, posY);
  }

  this.edgeNum = 0
  this.id = id; // Unique identifier assigned to the vertex.
  this.data = data;
  this.pos =
    posX === "undefined" || posY === "undefined"
      ? new Vector(0, 0)
      : new Vector(posX, posY);
  this.disp = new Vector(0, 0);
}

Vertex.prototype = {
  constructor: Vertex,

  equals: function (v) {
    return this.id === v.id;
  },
};

export default Vertex;
