import { init } from "zrender";
import { mockLigands, mockEdges } from "./mockData";
import { ligandGroup, EdgeGroup } from "./group";
// import { selectLigand, mouseOutHandler } from "./events";
// import Layout from "./layout";

class FepChart {
  zr = null;
  ligandGroup = null;
  edgeGroup = null;
  layout = null;
  width = 0;
  height = 0;
  zoom = 1;

  initGroup(ligands, edges) {
    this.ligandGroup = new ligandGroup(ligands);
    this.edgeGroup = new EdgeGroup(edges);
    this.zr.add(this.ligandGroup.group);
    this.zr.add(this.edgeGroup.group);
  }

  initSize(parent, dom, len) {
    // 基础面积 => 1000px * 1000px 的尺寸下容纳 20 个分子
    const baseMolNum = 20;
    const baseArea = (1000 * 1000) / baseMolNum;
    const parentW = parent.offsetWidth;
    const parentH = parent.offsetHeight;
    const parentArea = parentW * parentH;
    const molNum = Math.floor(parentArea / baseArea);
    const scale = len / molNum;
    this.pScale = 1;

    if (scale < 1) {
      this.width = parentW;
      this.height = parentH;
    } else {
      const edgeScale = Math.sqrt(scale);
      this.pScale = 1 / edgeScale;
      this.width = parentW * edgeScale;
      this.height = parentH * edgeScale;
    }

    const tsx = (parentW - this.width) / 2;
    const tsy = (parentH - this.height) / 2;
    dom.style.width = this.width + "px";
    dom.style.height = this.height + "px";
    dom.style.transform = `translate(${tsx}px, ${tsy}px)`;
    parent.style.transform = `scale(${this.pScale})`;
    console.log(parentW, this.width);
  }

  initLayout() {
    // this.layout = new Layout();
    // this.layout.run();
  }

  initEvents() {}

  init(parent, dom, ligands = mockLigands, edges = mockEdges) {
    this.initSize(parent, dom, ligands.length);
    this.zr = init(dom);
    this.initGroup(ligands, edges);
    this.initLayout();
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
