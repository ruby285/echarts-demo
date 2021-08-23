import { init } from "zrender";
import { mockLigands, mockEdges } from "./mockData";
import { ligandGroup, EdgeGroup } from "./group";
import { selectLigand, mouseOutHandler } from "./events";
import Layout from "./layout";

// TODO: 布局计算的优化
// TODO: 全局缩放

// TODO: 双击空白处: 取消所有选择
// TODO: text相关事件的加入
// TODO: more

class FepChart {
  zr = null;
  layout = null;
  ligands = [];
  edges = [];
  ligandGroup = null;
  edgeGroup = null;

  initData(ligands, edges) {
    this.ligands = ligands;
    this.edges = edges;
  }

  initGroup(ligands, edges) {
    this.ligandGroup = new ligandGroup(ligands);
    this.edgeGroup = new EdgeGroup(edges);
  }

  initLayout() {
    this.layout = new Layout(this);
    this.layout.run();
  }

  init(el, ligands = mockLigands, edges = mockEdges) {
    this.zr = init(el);
    this.initData(ligands, edges);
    this.initGroup(ligands, edges);
    this.zr.add(this.ligandGroup.group);
    this.zr.add(this.edgeGroup.group);
    this.initLayout();
  }
  addLigand() {
    const id = this.ligands.length;
    const ligandParams = { id };
    this.ligands.push(ligandParams);
    const ligand = this.ligandGroup.add(ligandParams);
    this.layout.addLigand(ligandParams);
    this.layout.reRun();
    return ligand;
  }
  addEdge(edgeParams) {
    const edge = this.edgeGroup.add(edgeParams);
    this.layout.addEdge(edgeParams);
    this.layout.reRun();
    return edge;
  }
  deleteLigand(ligand) {
    selectLigand.delete(ligand);
    for (let [, edge] of ligand.edgeMap) {
      const edgeParams = this.edgeGroup.delete(edge);
      this.layout.deleteEdge(edgeParams);
    }
    const ligandParams = this.ligandGroup.delete(ligand);
    this.layout.deleteLigand(ligandParams);
    mouseOutHandler();
    this.layout.reRun();
  }
  deleteEdge(edge) {
    const edgeParams = this.edgeGroup.delete(edge);
    this.layout.deleteEdge(edgeParams);
    mouseOutHandler();
    this.layout.reRun();
  }
  dispose() {
    if (!this.zr) return;
    this.zr.dispose();
  }
}

export default new FepChart();
