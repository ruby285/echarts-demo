import { Group } from "zrender";
import { Ligand, Line } from "./viewer";
import imgData from "./ligand.png";
import { ligandMap } from "./events";

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

    nodes.forEach((node) => {
      const ligand = new Ligand({
        x: node.x - 50,
        y: node.y - 50,
        img: imgData,
        id: node.id,
      });
      ligandMap.set(node.id, ligand);
      this.group.add(ligand.el);
    });
  }
}

export class LineGroup {
  group = null;

  constructor(lines) {
    this.group = new Group();
    lines.forEach((node) => {
      const line = new Line(node);
      this.group.add(line.el);
    });
  }
}
