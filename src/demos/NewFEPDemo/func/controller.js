import { Group } from "zrender";
import { Ligand, Line } from "./viewer";
import imgData from "./ligand.png";
import { ligandMap, lineMap } from "./events";

// TODO: 新的布局算法
// TODO: 线的位置计算 with 新算法

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
  list = [];
  sort() {
    this.list.sort((n1, n2) => n2.lineMap.size - n1.lineMap.size);
  }
  constructor(nodes) {
    this.group = new Group();

    nodes.forEach((node) => {
      const ligand = new Ligand({
        x: node.x - 50,
        y: node.y - 50,
        img: imgData,
        id: node.id,
      });
      this.list.push(ligand);
      ligandMap.set(node.id, ligand);
      this.group.add(ligand.el);
    });
  }
}

export class LineGroup {
  group = null;
  list = [];

  constructor(lines) {
    this.group = new Group();
    lines.forEach((node) => {
      const line = new Line(node);
      this.list.push(line);
      lineMap.set(node.id, line);
      this.group.add(line.el);
    });
  }
}
