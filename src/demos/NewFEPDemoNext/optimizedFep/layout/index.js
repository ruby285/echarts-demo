import FRLayout from "./FRLayout";
import Graph from "./graph";
import { getInitialPos } from "../helper";

class Layout {
  updateGraphics() {
    const ligandMap = this.ligandGroup.map;
    this.graph.forEachVertex(({ pos, id }) => {
      const ligand = ligandMap.get(id);
      ligand.moveTo(pos);
    });
    this.edgeGroup.reDraw();
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
    this.ligandGroup.forEach((ligand, id) => {
      const v = this.graph.getVertex(id);
      const { x, y } = getInitialPos(width, height, !!ligand.edgeMap.size);
      v.pos.setValues(x, y);
    });
  }

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
    this.graph = new Graph(ligands, edges);
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
