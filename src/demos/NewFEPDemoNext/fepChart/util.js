import { vector } from "zrender";

export function getLayout(w, h, len) {
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
      const x = jW * j + jW / 2 + getRandomDis();
      const y = boxH * i + boxH / 2 + getRandomDis();
      res.push({ x, y });
    }
  }

  return res;
}

function getRandomDis() {
  return Math.random() * 40 - 20;
}

export function getEdgePoint(sNode, tNode, width) {
  const sAngle = getAngle(sNode, tNode);
  const tAngle = getAngle(tNode, sNode);
  const sEdge = getEdge(sAngle, sNode, width);
  const tEdge = getEdge(tAngle, tNode, width);
  // const { start, end } = edgeMove(sNode, tNode);
  // const sPoint = segmentsIntr(start, end, sEdge.start, sEdge.end);
  // const tPoint = segmentsIntr(start, end, tEdge.start, tEdge.end);
  const sPoint = segmentsIntr(sNode, tNode, sEdge.start, sEdge.end);
  const tPoint = segmentsIntr(sNode, tNode, tEdge.start, tEdge.end);
  const { x: x1, y: y1 } = sPoint;
  const { x: x2, y: y2 } = tPoint;
  return { x1, y1, x2, y2 };
}

export function getRotation(start, end) {
  const radian = Math.atan2(start.y - end.y, start.x - end.x);
  const rotation = Math.PI - radian;
  return rotation;
}

function getAngle(start, end) {
  const radian = Math.atan2(start.y - end.y, start.x - end.x);
  const angle = 180 - radian * (180 / Math.PI);

  return angle;
}

function getEdge(angel, pos, width) {
  const l = width / 2;
  if (angel > 45 && angel <= 135) {
    // 上边
    return {
      start: {
        x: pos.x - l,
        y: pos.y - l,
      },
      end: {
        x: pos.x + l,
        y: pos.y - l,
      },
    };
  }

  if (angel > 135 && angel <= 225) {
    // 左边
    return {
      start: {
        x: pos.x - l,
        y: pos.y - l,
      },
      end: {
        x: pos.x - l,
        y: pos.y + l,
      },
    };
  }
  if (angel > 225 && angel <= 315) {
    // 下边
    return {
      start: {
        x: pos.x - l,
        y: pos.y + l,
      },
      end: {
        x: pos.x + l,
        y: pos.y + l,
      },
    };
  }
  // 右边
  return {
    start: {
      x: pos.x + l,
      y: pos.y - l,
    },
    end: {
      x: pos.x + l,
      y: pos.y + l,
    },
  };
}

function segmentsIntr(a, b, c, d) {
  // 三角形abc 面积的2倍
  var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);

  // 三角形abd 面积的2倍
  var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);

  // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
  if (area_abc * area_abd >= 0) {
    return false;
  }

  // 三角形cda 面积的2倍
  var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
  // 三角形cdb 面积的2倍
  // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
  var area_cdb = area_cda + area_abc - area_abd;
  if (area_cda * area_cdb >= 0) {
    return false;
  }

  //计算交点坐标
  var t = area_cda / (area_abd - area_abc);
  var dx = t * (b.x - a.x),
    dy = t * (b.y - a.y);
  return { x: a.x + dx, y: a.y + dy };
}

export function getTextPosition(x1, y1, x2, y2, n) {
  const vecX = x2 - x1;
  const vecY = y2 - y1;
  const move = 14;
  const dis = vecMove(vecX, vecY, move);
  const x = (x2 - x1) / 2 + x1;
  const y = (y2 - y1) / 2 + y1;
  const rotation = getRotation({ x: x1, y: y1 }, { x: x2, y: y2 });

  return new Array(n).fill("").map((a, i) => ({
    x: x + dis.x * (i + 1),
    y: y - dis.y * (i + 1),
    rotation,
  }));
}

function edgeMove(sNode, tNode) {
  const vecX = tNode.x - sNode.x;
  const vecY = tNode.y - sNode.y;
  const dis = vecMove(vecX, vecY, 10);
  return {
    start: {
      x: sNode.x + dis.x,
      y: sNode.y - dis.y,
    },
    end: {
      x: tNode.x + dis.x,
      y: tNode.y - dis.y,
    },
  };
}

function vecMove(vecX, vecY, move) {
  const vecLen = vector.len([vecX, vecY]);
  const vecResX = (vecY / vecLen) * move;
  const vecResY = (vecX / vecLen) * move;

  return { x: vecResX, y: vecResY };
}
