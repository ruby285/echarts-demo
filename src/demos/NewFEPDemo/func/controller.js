import { Group } from "zrender";
import { Ligand, Line } from "./viewer";
import imgData from "./ligand.png";

// TODO: 布局算法
// TODO: ligand 中心校准
// TODO: 线的位置计算
// TODO: 文字及样式
// TODO: 交互逻辑-hover
// TODO: 交互逻辑-click
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
        x: layout[i].x,
        y: layout[i].y,
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
      const { x1, y1, x2, y2 } = node;
      const line = new Line({
        x1,
        y1,
        x2,
        y2,
      });
      this.group.add(line.el);
    });
  }
}

function getLayout(w, h, len) {
  let boxW = w;
  let boxH = h;
  let lenW = 1;
  let lenH = 1;
  let volume = 1;
  const res = [];

  while (volume < len) {
    if (boxW < boxH) {
      volume = lenW * ++lenH;
      boxH = h / lenH;
    } else {
      volume = ++lenW * lenH;
      boxW = w / lenW;
    }
  }
  for (let i = 0; i < lenH; i++) {
    let lenJ = lenW;
    let jW = boxW;
    if (i === lenH - 1) {
      lenJ = len - (lenH - 1) * lenW;
      jW = w / lenJ;
    }
    for (let j = 0; j < lenJ; j++) {
      res.push({ x: jW * j + jW / 2 - 50, y: boxH * i + boxH / 2 - 50 });
    }
  }

  return res;
}
