const ligandNum = 30;
const step = 2;
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
// export const mockEdges = [
//   {
//     id: `0=>1`,
//     source: "0",
//     target: "1",
//     info: ["info1", "info2", "info3"],
//   },
//   {
//     id: `1=>0`,
//     source: "1",
//     target: "0",
//     info: ["info1", "info2", "info3"],
//   },
//   {
//     id: `1=>2`,
//     source: "1",
//     target: "2",
//     info: ["info1", "info2", "info3"],
//   },
//   {
//     id: `2=>3`,
//     source: "2",
//     target: "3",
//     info: ["info1", "info2", "info3"],
//   },
// ];
