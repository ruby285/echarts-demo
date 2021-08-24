import { init } from "zrender";
import { mockLigands, mockEdges } from "./mockData";
import { ligandGroup, EdgeGroup } from "./group";
import Room from "./room";
// import { selectLigand, mouseOutHandler } from "./events";
import Layout from "./layout";

class FepChart {
  zr = null;
  ligandGroup = null;
  edgeGroup = null;
  layout = null;
  room = null;
  width = 0;
  height = 0;
  zoom = 1;

  initGroup(ligands, edges) {
    this.ligandGroup = new ligandGroup(ligands);
    this.edgeGroup = new EdgeGroup(edges);
    this.zr.add(this.ligandGroup.group);
    this.zr.add(this.edgeGroup.group);
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

  initEvents() {}

  init(parent, dom, ligands = mockLigands, edges = mockEdges) {
    this.initRoom(parent, dom, ligands.length);
    this.zr = init(dom);
    this.initGroup(ligands, edges);
    this.initLayout(ligands, edges);
    this.initEvents();

    console.log(this.zr);
  }

  // addLigand() {
  //   const id = this.ligands.length;
  //   const ligandProps = { id };
  //   this.ligands.push(ligandProps);
  //   const ligand = this.ligandGroup.add(ligandProps);
  //   this.layout.addLigand(ligandProps);
  //   this.layout.reRun();
  //   return ligand;
  // }
  // addEdge(edgeProps) {
  //   const edge = this.edgeGroup.add(edgeProps);
  //   this.layout.addEdge(edgeProps);
  //   this.layout.reRun();
  //   return edge;
  // }
  // deleteLigand(ligand) {
  //   selectLigand.delete(ligand);
  //   for (let [, edge] of ligand.edgeMap) {
  //     const edgeProps = this.edgeGroup.delete(edge);
  //     this.layout.deleteEdge(edgeProps);
  //   }
  //   const ligandProps = this.ligandGroup.delete(ligand);
  //   this.layout.deleteLigand(ligandProps);
  //   mouseOutHandler();
  //   this.layout.reRun();
  // }
  // deleteEdge(edge) {
  //   if (!edge.isVirtual) {
  //     selectLigand.clear();
  //   }
  //   const edgeProps = this.edgeGroup.delete(edge);
  //   this.layout.deleteEdge(edgeProps);
  //   mouseOutHandler();
  //   this.layout.reRun();
  // }
  dispose() {
    if (!this.zr) return;
    this.zr.dispose();
  }
}

export default new FepChart();
