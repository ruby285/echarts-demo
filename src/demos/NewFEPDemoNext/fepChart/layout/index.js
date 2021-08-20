import FRLayout from "./FRLayout";
import Graph from "./Graph";

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const getInitialPos = (width, height, isCenter) => {
  const startX = width / 4;
  const midX = startX * 2;
  const endX = startX * 3;
  const startY = height / 4;
  const midY = startY * 2;
  const endY = startY * 3;
  if (isCenter) {
    return {
      x: random(startX, endX),
      y: random(startY, endY),
    };
  }
  let x = random(0, width);
  let y = random(0, height);
  if (x > startX && x < midX) x -= startX;
  if (x > midX && x < endX) x += startX;
  if (y > startY && y < midY) y -= startY;
  if (y > midY && y < endY) y += startY;
  return {
    x,
    y,
  };
};

class Layout {
  ctx = null;
  updateGraphics() {
    const ligandMap = this.ctx.ligandGroup.map;
    const edgeMap = this.ctx.edgeGroup.map;
    this.graph.forEachVertex(({ pos, id }) => {
      const ligand = ligandMap.get(id);
      ligand.moveTo(pos);
    });
    for (let [, edge] of edgeMap) {
      edge.reDraw();
    }
  }

  step() {
    this.layoutAlgorithm.updatePhysics();
    this.updateGraphics();
  }

  run() {
    window.requestAnimationFrame(() => {
      this.step();
      if (this.layoutAlgorithm.isDone()) return;
      this.run();
    });
  }

  initPos(width, height) {
    const ligandMap = this.ctx.ligandGroup.map;
    for (let [id, ligand] of ligandMap) {
      const v = this.graph.getVertex(id);
      // if (ligand.edgeMap.size) {
      //   // 初始位置取中心区域的随机值
      //   const {x,y} = getInitialPos(width, height, true)
      //   v.pos.set(x, y);
      // } else {
      //   // 初始位置取边缘区域的随机值
      //   const {x,y} = getInitialPos(width, height, false)
      //   v.pos.set(x, y);
      // }
      const { x, y } = getInitialPos(width, height, !!ligand.edgeMap.size);
      v.pos.set(x, y);
    }
    // this.graph.forEachVertex(function (v) {
    //   v.pos.rand(0.0, width, 0.0, height);
    // }, this);
  }

  init() {
    const ctx = this.ctx;
    const vertices = ctx.ligands;
    const edges = ctx.edges.map((item) => ({
      from: item.source,
      to: item.target,
    }));
    this.graph = new Graph({ vertices, edges });
    const width = document.documentElement.clientWidth - 100;
    const height = document.documentElement.clientHeight - 100;
    this.initPos(width, height);
    this.layoutAlgorithm = new FRLayout(
      {
        width,
        height,
      },
      this.graph
    );
  }
  constructor(ctx) {
    this.ctx = ctx;
    this.init();
  }
}

export default Layout;
