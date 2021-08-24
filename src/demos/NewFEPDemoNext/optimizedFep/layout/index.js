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
    const ligandMap = this.ligandGroup.map;
    const edgeMap = this.edgeGroup.map;
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
  reRun() {
    this.layoutAlgorithm.reset();
    this.run();
  }
  addEdge(edge) {
    this.graph.addEdge(edge.source, edge.target);
  }
  deleteEdge(edge) {
    this.graph.deleteEdge(edge.source, edge.target);
  }
  addLigand(ligand) {
    const width = document.documentElement.clientWidth - 100;
    const height = document.documentElement.clientHeight - 100;
    const { x: posX, y: posY } = getInitialPos(width, height, false);
    this.graph.addVertex(ligand.id, posX, posY);
  }
  deleteLigand(ligand) {
    this.graph.deleteVertex(ligand.id);
  }

  initPos(width, height) {
    const ligandMap = this.ligandGroup.map;
    for (let [id, ligand] of ligandMap) {
      const v = this.graph.getVertex(id);
      const { x, y } = getInitialPos(width, height, !!ligand.edgeMap.size);
      v.pos.setValues(x, y);
    }
  }

  // init() {
  //   const ctx = this.ctx;
  //   const vertices = ctx.ligands;
  //   const edges = ctx.edges;
  //   this.graph = new Graph({ vertices, edges });
  //   const width = document.documentElement.clientWidth - 100;
  //   const height = document.documentElement.clientHeight - 100;
  //   this.initPos(width, height);
  //   this.layoutAlgorithm = new FRLayout(
  //     {
  //       width,
  //       height,
  //     },
  //     this.graph
  //   );
  // }

  initViewerRoom() {
    const { width, height } = this.room;
    this.width = width - 100;
    this.height = height - 100;
  }

  initGraph(ligands, edges) {
    this.graph = new Graph(ligands, edges);
  }

  init(ligands, edges) {
    this.initViewerRoom();
    this.initGraph(ligands, edges);
    this.initPos(this.width, this.height);
    this.layoutAlgorithm = new FRLayout(this.width, this.height, this.graph);
  }

  constructor(room, ligandGroup, edgeGroup) {
    this.room = room;
    this.ligandGroup = ligandGroup;
    this.edgeGroup = edgeGroup;
  }
}

export default Layout;
