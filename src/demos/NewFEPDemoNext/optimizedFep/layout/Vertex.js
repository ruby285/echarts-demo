import Vector from "./Vector";

class Vertex {
  edgeNum = 0;
  pos = new Vector(0, 0);
  disp = new Vector(0, 0);

  equals(v) {
    return this.id === v.id;
  }

  constructor(id) {
    this.id = id;
  }
}

export default Vertex;
