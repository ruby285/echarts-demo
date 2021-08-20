import { init } from "zrender";
import { mockLigands, mockEdges } from "./mockData";
import { ligandGroup, EdgeGroup } from "./group";
import Layout from "./layout";

// TODO: 布局计算的优化 告一段落
// TODO: 新增一个ligand
// TODO: 新增一个edge
// TODO: 加入虚拟的连线
// TODO: 选择元素后新增角标
// TODO: text相关事件的加入
// TODO: 加入symbol
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
  addLigand() {}
  addEdge(edgeParams) {
    const edge = this.edgeGroup.add(edgeParams);
    this.layout.addEdge(edgeParams);
    this.layout.reRun();
    return edge;
  }
  deleteLigand() {}
  deleteEdge(edge) {
    this.edgeGroup.delete(edge);
    // this.layout.deleteEdge(edgeParams);
    // this.layout.reRun();
  }
  dispose() {
    if (!this.zr) return;
    this.zr.dispose();
  }
}

export default new FepChart();
