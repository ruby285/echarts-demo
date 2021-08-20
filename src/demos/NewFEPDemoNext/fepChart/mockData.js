const mockNum = 30;
export const mockNodes = new Array(mockNum).fill("").map((node, i) => ({
  id: "" + i,
}));

export const mockLinks = [
  {
    source: "0",
    target: "1",
    info: ["info1", "info2", "info3"],
  },
  {
    source: "2",
    target: "0",
    info: ["info1", "info2", "info3"],
  },
];
