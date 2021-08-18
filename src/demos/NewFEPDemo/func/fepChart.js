import { init } from "zrender";
import { NodeGroup, LineGroup } from "./controller";
import mockData from "./data.json";

const mockNodes = mockData.nodes;
const mockLinks = [
  {
    x1: mockNodes[0].x,
    y1: mockNodes[0].y,
    x2: mockNodes[1].x,
    y2: mockNodes[1].y,
  },
  {
    x1: mockNodes[0].x,
    y1: mockNodes[0].y,
    x2: mockNodes[2].x,
    y2: mockNodes[2].y,
  },
];
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
