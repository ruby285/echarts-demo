import { init } from "zrender";
import { mockNodes, mockLinks } from "./mockData";
import { NodeGroup, LineGroup } from "./group";

class FepChart {
  zr = null;
  nodes = [];
  lines = [];
  nodeGroup = null;
  lineGroup = null;
  initData(nodes, lines) {
    this.nodes = nodes;
    this.lines = lines;
  }
  initGroup(nodes, lines) {
    this.nodeGroup = new NodeGroup(nodes);
    this.lineGroup = new LineGroup(lines);
  }

  initLayout() {}

  init(el, nodes = mockNodes, lines = mockLinks) {
    this.zr = init(el);
    this.initData(nodes, lines);
    this.initGroup(nodes, lines);
    this.zr.add(this.nodeGroup.group);
    this.zr.add(this.lineGroup.group);
    this.initLayout();
  }
  addLigand() {}
  addLine() {}
  dispose() {
    if (!this.zr) return;
    this.zr.dispose();
  }
}
export default new FepChart();
