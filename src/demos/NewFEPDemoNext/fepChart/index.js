import { init } from "zrender";
import { mockLigands, mockEdges } from "./mockData";
import { ligandGroup, EdgeGroup } from "./group";
import Layout from "./layout";

// TODO: 布局计算的优化
// TODO: 连线位置的优化
// TODO: 加入虚拟的连线
// TODO: 选择元素后新增角标
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
  addEdge() {}
  dispose() {
    if (!this.zr) return;
    this.zr.dispose();
  }
}

export default new FepChart();
