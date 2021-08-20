const mockNum = 20;
export const mockLigands = new Array(mockNum).fill("").map((n, i) => ({
  id: "" + i,
}));

export const mockEdges = [
  {
    id: "0=>1",
    source: "0",
    target: "1",
    info: ["info1", "info2", "info3"],
  },
  {
    id: "2=>0",
    source: "2",
    target: "0",
    info: ["info1", "info2", "info3"],
  },
];
