import { vector } from "zrender";

export class ArrSet {
  elments = new Set();

  add(...args) {
    args.forEach((element) => this.elments.add(element));
  }
  delete(...args) {
    args.forEach((element) => this.elments.delete(element));
  }

  clear() {
    this.elments.clear();
  }

  forEach(callback) {
    Array.from(this.elments).forEach(callback);
  }
}

export function getEdgePoint(sLigand, tLigand, width) {
  const sAngle = getAngle(sLigand, tLigand);
  const tAngle = getAngle(tLigand, sLigand);
  const { edge: sEdge, approachEdge: sApproachEdge } = getEdge(
    sAngle,
    sLigand,
    width
  );
  const { edge: tEdge, approachEdge: tApproachEdge } = getEdge(
    tAngle,
    tLigand,
    width
  );
  const { start, end } = edgeMove(sLigand, tLigand);
  const sPoint =
    segmentsIntr(start, end, sEdge.start, sEdge.end) ||
    segmentsIntr(start, end, sApproachEdge.start, sApproachEdge.end);
  const tPoint =
    segmentsIntr(start, end, tEdge.start, tEdge.end) ||
    segmentsIntr(start, end, tApproachEdge.start, tApproachEdge.end);
  const { x: x1, y: y1 } = sPoint;
  const { x: x2, y: y2 } = tPoint;
  return { x1, y1, x2, y2 };
}

export function getTextPosition(x1, y1, x2, y2, n) {
  const vecX = x2 - x1;
  const vecY = y2 - y1;
  const move = 14;
  const dis = vecMove(vecX, vecY, move);
  const x = (x2 - x1) / 2 + x1;
  const y = (y2 - y1) / 2 + y1;
  const rotation = getRotation({ x: x1, y: y1 }, { x: x2, y: y2 });
  return {
    x: x + dis.x * n,
    y: y - dis.y * n,
    rotation,
  };
}

export function getInitialPos(width, height, isCenter) {
  const startX = width / 4;
  const midX = startX * 2;
  const endX = startX * 3;
  const startY = height / 4;
  const midY = startY * 2;
  const endY = startY * 3;
  if (isCenter) {
    return {
      x: random(startX, endX),
      y: random(startY, endY),
    };
  }
  let x = random(0, width);
  let y = random(0, height);
  if (x > startX && x < midX) x -= startX;
  if (x > midX && x < endX) x += startX;
  if (y > startY && y < midY) y -= startY;
  if (y > midY && y < endY) y += startY;
  return {
    x,
    y,
  };
}

function getRotation(start, end) {
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
  const edgeArea = Math.floor(angel / 45);
  const edgeList = [
    ["right", "up"],
    ["up", "right"],
    ["up", "left"],
    ["left", "up"],
    ["left", "down"],
    ["down", "left"],
    ["down", "right"],
    ["right", "down"],
  ];
  const resEdge = edgeList[edgeArea];
  return {
    edge: getSpecificEdge(pos, width, resEdge[0]),
    approachEdge: getSpecificEdge(pos, width, resEdge[1]),
  };
  // 不做人了，把所有边都给你
  // const list = ['up', 'left', 'down', 'right']
  // return list.map((type) => getSpecificEdge(pos, width, resEdge[1]))
}

function getSpecificEdge(pos, width, type) {
  const l = width / 2;
  switch (type) {
    case "up":
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
    case "left":
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
    case "down":
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
    case "right":
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

function edgeMove(sLigand, tLigand) {
  const vecX = tLigand.x - sLigand.x;
  const vecY = tLigand.y - sLigand.y;
  const dis = vecMove(vecX, vecY, 10);
  return {
    start: {
      x: sLigand.x + dis.x,
      y: sLigand.y - dis.y,
    },
    end: {
      x: tLigand.x + dis.x,
      y: tLigand.y - dis.y,
    },
  };
}

function vecMove(vecX, vecY, move) {
  const vecLen = vector.len([vecX, vecY]);
  const vecResX = (vecY / vecLen) * move;
  const vecResY = (vecX / vecLen) * move;

  return { x: vecResX, y: vecResY };
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
