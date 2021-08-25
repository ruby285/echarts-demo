const MAX_ITERS = 400;

class FRLayout {
  attraction(d) {
    return Math.pow(d, 2) / this.optDist;
  }

  repulsion(d) {
    return Math.pow(this.optDist, 2) / d;
  }

  centerAttraction(d, scale = 1) {
    return (Math.pow(d, 2) / this.optDist) * scale;
  }

  calcAttraction() {
    this.graph.forEachEdge((u, v) => {
      var delta = u.pos.sub(v.pos);
      var len = delta.mag() / 3;
      // var minLen = 300;
      // if (len < minLen) return;
      var distVec = delta.normalize().multiplyConst(this.attraction(len));

      u.disp = u.disp.sub(distVec);
      v.disp = v.disp.add(distVec);
    });

    const center = {
      x: this.width / 2,
      y: this.height / 2,
    };
    this.graph.forEachVertex((u) => {
      const cp = u.pos.copy();
      const scale = u.edgeNum ? cp.sub(center).mag() / 200 : 1;
      var delta = u.pos.sub(center),
        distVec = delta
          .normalize()
          .multiplyConst(this.centerAttraction(delta.mag(), scale));

      u.disp = u.disp.sub(distVec);
    });
  }

  calcRepulsion() {
    this.graph.forEachVertex((u) => {
      u.disp.setValues(0.0, 0.0);

      this.graph.forEachVertex((v) => {
        var delta;

        if (!u.equals(v)) {
          delta = u.pos.sub(v.pos);
          u.disp = u.disp.add(
            delta.normalize().multiplyConst(this.repulsion(delta.mag()))
          );
        }
      });
    });
  }

  calcDisplacement() {
    this.graph.forEachVertex((v) => {
      v.pos = v.pos.add(
        v.disp
          .normalize()
          .multiplyConst(Math.min(v.disp.mag() / 100, this.temp * 0.1))
      );
      const spare = 0.04;
      const minW = this.width * spare;
      const maxW = this.width * (1 - spare);
      const minH = this.height * spare;
      const maxH = this.height * (1 - spare);
      v.pos.x = Math.min(maxW, Math.max(minW, v.pos.x));
      v.pos.y = Math.min(maxH, Math.max(minH, v.pos.y));
      // v.pos.x = Math.min(this.width, Math.max(0.0, v.pos.x));
      // v.pos.y = Math.min(this.height, Math.max(0.0, v.pos.y));
    });
  }

  cool() {
    this.temp *= 1 - this.currIter / MAX_ITERS;
  }

  updatePhysics() {
    this.currIter += this.iterStep;

    this.calcRepulsion();
    this.calcAttraction();
    this.calcDisplacement();

    this.cool();
  }

  isDone() {
    return this.temp < 0.1 || this.currIter > MAX_ITERS;
  }

  reset() {
    this.optDist = this.distConst * Math.sqrt(this.area / this.graph.getSize());
    this.temp = this.width / 10;
    this.currIter = 0;
  }

  constructor(width, height, graph) {
    this.graph = graph;
    this.width = width;
    this.height = height;
    this.area = this.width * this.height;
    this.distConst = 1;
    this.iterStep = 0.1;

    this.reset();
  }
}

export default FRLayout;
