const ligandNum = 20;
const step = 4;
const edgeNum = Math.floor(ligandNum / step);
export const mockLigands = new Array(ligandNum).fill("").map((n, i) => ({
  id: "" + i,
}));

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const _mockEdges = [];
let start = 0;
let end = step;
while (_mockEdges.length < edgeNum) {
  const source = random(start, end);
  let target = random(0, ligandNum);
  while (target === source) {
    target = random(0, ligandNum);
  }
  start = source + 1;
  end = end - start + step;
  _mockEdges.push({
    id: `${source}=>${target}`,
    source: "" + source,
    target: "" + target,
    info: ["info1", "info2", "info3"],
  });
}

export const mockEdges = _mockEdges;
