import { Group, vector } from "zrender";
import { Ligand, Line, Text } from "./viewer";
import imgData from "./ligand.png";
import { getLayout, getTextPosition } from "./util";

// TODO: 新的布局算法
// TODO: 线的位置计算 with 新算法

// TODO: 交互逻辑-hover
// TODO: 交互逻辑-click
// TODO: selection order
// TODO: delete node button
// TODO: add edge button
// TODO: delete edge button
// TODO: add to calculation queue button
// TODO: select fun
// TODO: cancle select fun
// TODO: 线的优化: 曲线？箭头？
export class NodeGroup {
  group = null;
  constructor(nodes) {
    this.group = new Group();
    const layout = getLayout(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight,
      nodes.length
    );

    nodes.forEach((node, i) => {
      const ligand = new Ligand({
        x: layout[i].x - 50,
        y: layout[i].y - 50,
        img: imgData,
      });
      this.group.add(ligand.el);
    });
  }
}

export class LineGroup {
  group = null;

  constructor(lines) {
    this.group = new Group();
    lines.forEach((node) => {
      const { x1, y1, x2, y2, info } = node;
      const line = new Line({
        x1,
        y1,
        x2,
        y2,
        info,
      });
      this.group.add(line.el);
    });
  }
}
