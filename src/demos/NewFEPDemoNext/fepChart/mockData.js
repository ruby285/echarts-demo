const ligandNum = 20;
const step = 5;
const edgeNum = Math.floor(ligandNum / step);
export const mockLigands = new Array(ligandNum).fill("").map((n, i) => ({
  id: "" + i,
}));

const random = (min, max) => Math.floor(Math.random() * max - min);
const _mockEdges = [];
let start = 0;
let end = step;
while (mockEdges.length < edgeNum) {
  const source = random(start, end);
  let target = random(0, ligandNum);
  while (target === source) {
    target = random(0, ligandNum);
  }
  start = source + 1;
  end = end - start + step;
  mockEdges.push({
    id: `${source}=>${target}`,
    source: "" + source,
    target: "" + target,
  });
}

export const mockEdges = _mockEdges;
