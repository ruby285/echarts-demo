import { init } from "zrender";
import { NodeGroup, LineGroup, getLayout, getLinePoint } from "./controller";

const mockNum = 3;
const layout = getLayout(
  document.documentElement.clientWidth,
  document.documentElement.clientHeight,
  mockNum
);
const mockNodes = new Array(mockNum).fill("").map((node, i) => ({
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
  const { source, target, info } = link;
  const sNode = mockNodes[source];
  const tNode = mockNodes[target];
  const { x1, y1, x2, y2 } = getLinePoint(sNode, tNode, 100);
  return { x1, y1, x2, y2, info };
});

class FEPGraphChart {
  zr = null;

  init(el) {
    this.zr = init(el);

    const nodeGroup = new NodeGroup(mockNodes);
    const lineGroup = new LineGroup(mockLinks);

    this.zr.add(nodeGroup.group);
    this.zr.add(lineGroup.group);
  }
  dispose() {
    if (!this.zr) return;
    this.zr.dispose();
  }
}

export default new FEPGraphChart();
