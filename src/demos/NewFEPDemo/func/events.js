import fepGraphChart from "./fepChart";

const selectArr = [];
export const ligandMap = new Map();

export const mouseOverHandler = (type, params, ins) => {
  console.log("mouseOverHandler", type);
  console.log("mouseOverHandler", params);
  console.log("mouseOverHandler", ins);
  ins.toFocus();
};
export const mouseOutHandler = (type, params, ins) => {
  ins.toNormal();
};
export const clickHandler = (type, params, ins) => {
  ins.toSelect();
};
