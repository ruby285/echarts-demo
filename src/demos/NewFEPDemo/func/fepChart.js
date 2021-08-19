import { init } from "zrender";
import { NodeGroup, LineGroup } from "./controller";
import { getLayout, getLinePoint } from "./util";

const mockNum = 3;
const layout = getLayout(
  document.documentElement.clientWidth,
  document.documentElement.clientHeight,
  mockNum
);
const mockNodes = new Array(mockNum).fill("").map((node, i) => ({
  id: "" + i,
  x: layout[i].x,
  y: layout[i].y,
}));

const originLines = [
  {
    source: "0",
    target: "1",
    info: ["info1", "info2", "info3"],
  },
  {
    source: "2",
    target: "0",
    info: ["info1", "info2", "info3"],
  },
];

const mockLinks = originLines.map((link) => {
  const { source, target } = link;
  const sNode = mockNodes[source];
  const tNode = mockNodes[target];
  const id = `${sNode.id}=>${tNode.id}`;
  const { x1, y1, x2, y2 } = getLinePoint(sNode, tNode, 100);
  return { x1, y1, x2, y2, id, ...link };
});

class FEPGraphChart {
  zr = null;
  nodeGroup = null;
  lineGroup = null;

  init(el) {
    this.zr = init(el);

    this.nodeGroup = new NodeGroup(mockNodes);
    this.lineGroup = new LineGroup(mockLinks);

    this.zr.add(this.nodeGroup.group);
    this.zr.add(this.lineGroup.group);
  }
  dispose() {
    if (!this.zr) return;
    this.zr.dispose();
  }
}

export default new FEPGraphChart();
