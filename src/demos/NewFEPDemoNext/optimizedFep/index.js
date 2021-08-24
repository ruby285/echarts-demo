import { init } from "zrender";
import { mockLigands, mockEdges } from "./mockData";
import { ligandGroup, EdgeGroup } from "./group";
import Room from "./room";
// import { selectLigand, mouseOutHandler } from "./events";
import Layout from "./layout";
import Events from "./events";

class FepChart {
  renderer = null;
  room = null;
  ligandGroup = null;
  edgeGroup = null;
  layout = null;
  events = null;

  initGroup(ligands, edges) {
    this.ligandGroup = new ligandGroup(ligands);
    this.edgeGroup = new EdgeGroup(edges);
    this.renderer.add(this.ligandGroup.group);
    this.renderer.add(this.edgeGroup.group);
  }

  initRoom(parent, dom, len) {
    this.room = new Room(parent, dom);
    this.room.init(len);
  }

  initLayout(ligands, edges) {
    this.layout = new Layout(this.room, this.ligandGroup, this.edgeGroup);
    this.layout.init(ligands, edges);
    this.layout.run();
  }

  initEvents() {
    this.events = new Events(this.renderer);
  }

  init(parent, dom, ligands = mockLigands, edges = mockEdges) {
    this.initRoom(parent, dom, ligands.length);
    this.renderer = init(dom);
    this.initGroup(ligands, edges);
    this.initLayout(ligands, edges);
    this.initEvents();
  }

  addLigand() {
    const id = this.ligandGroup.acSize + 1;
    this.ligandGroup.add({ id });
    this.layout.addLigand({ id });
    this.layout.reRun();
  }

  addEdge(edgeProps) {
    this.edgeGroup.add(edgeProps);
    this.layout.addEdge(edgeProps);
    this.layout.reRun();
  }

  deleteLigand(ligand) {
    selectLigand.delete(ligand);
    for (let [, edge] of ligand.edgeMap) {
      const edgeProps = this.edgeGroup.delete(edge);
      this.layout.deleteEdge(edgeProps);
    }
    const ligandProps = this.ligandGroup.delete(ligand);
    this.layout.deleteLigand(ligandProps);
    mouseOutHandler();
    this.layout.reRun();
  }

  deleteEdge(edge) {
    if (!edge.isVirtual) {
      selectLigand.clear();
    }
    const edgeProps = this.edgeGroup.delete(edge);
    this.layout.deleteEdge(edgeProps);
    mouseOutHandler();
    this.layout.reRun();
  }

  dispose() {
    if (!this.renderer) return;
    this.renderer.dispose();
  }
}

export default new FepChart();
