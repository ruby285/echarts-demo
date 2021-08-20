import { init } from "zrender";
import { NodeGroup, LineGroup } from "./controller";
import { getLayout, getLinePoint } from "./util";
import { bezierCurve } from "./arc";

const mockNum = 3;
const mockNodes = new Array(mockNum).fill("").map((node, i) => ({
  id: "" + i,
}));

const mockLinks = [
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

// const mockLinks = originLines.map((link) => {
//   const { source, target } = link;
//   const sNode = mockNodes[source];
//   const tNode = mockNodes[target];
//   const id = `${sNode.id}=>${tNode.id}`;
//   const { x1, y1, x2, y2 } = getLinePoint(sNode, tNode, 100);
//   return { x1, y1, x2, y2, id, ...link };
// });

class FEPGraphChart {
  zr = null;
  nodeGroup = null;
  lineGroup = null;

  init(el) {
    this.zr = init(el);

    // 1、创建node列表 √
    this.nodeGroup = new NodeGroup(mockNodes);
    // 2、创建link列表->指定每一个node拥有的link数量 √
    this.lineGroup = new LineGroup(mockLinks);
    // 3、根据link数量将node列表排序
    this.nodeGroup.sort();

    // 4、创建基础的布局列表 √
    const layout = getLayout(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight,
      mockNum
    );

    this.nodeGroup.list.forEach((node, i) => {
      node.init(layout[i]);
    });
    this.lineGroup.list.forEach((line, i) => {
      line.init();
    });

    // 6、遍历布局与node列表，赋予node坐标值
    // console.log(this.lineGroup.list);

    // 初始化逻辑
    // 1、创建node列表 √
    // 2、创建link列表->指定每一个node拥有的link数量 √
    // 3、根据link数量将node列表排序
    // 4、创建基础的布局列表 √
    // 5、将布局列表按照中心位置作为权重值排序，得到全新的布局列表
    // 6、遍历布局与node列表，赋予node坐标值
    // 7、渲染node列表
    // 8、渲染link列表

    // TODO: 更新逻辑

    this.zr.add(this.nodeGroup.group);
    this.zr.add(this.lineGroup.group);
    // this.zr.add(bezierCurve);
  }
  dispose() {
    if (!this.zr) return;
    this.zr.dispose();
  }
}

export default new FEPGraphChart();
