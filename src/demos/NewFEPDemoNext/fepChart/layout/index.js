import FRLayout from "./FRLayout";
import Graph from "./Graph";

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

  init() {
    const ctx = this.ctx;
    const vertices = ctx.ligands;
    const edges = ctx.edges.map((item) => ({
      from: item.source,
      to: item.target,
    }));
    this.graph = new Graph({ vertices, edges });
    this.layoutAlgorithm = new FRLayout(
      {
        width: document.documentElement.clientWidth - 100,
        height: document.documentElement.clientHeight - 100,
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
