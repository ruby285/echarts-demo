import fepGraphChart from "./fepChart";

const selectLigand = [];
const selectLine = null;
const focusLigand = new Set();
const focusLine = new Set();
const blurLigand = new Set();
const blurLine = new Set();

export const ligandMap = new Map();
export const lineMap = new Map();

export const mouseOverHandler = (type, params, ins) => {
  // ins.toScaleX();
  // if (type === "ligand") {
  //   return ligandEventHandler.onmouseover(ins);
  // }
  // lineEventHandler.onmouseover(ins);
};
export const mouseOutHandler = (type, params, ins) => {
  // ins.toScale1();
  // representationHandler.onmouseout();
};
export const clickHandler = (type, params, ins) => {
  // if (type === "ligand") {
  //   return ligandEventHandler.onclick(ins);
  // }
  // lineEventHandler.onclick(ins);
};

const ligandEventHandler = {
  onmouseover(ins) {
    if (ins.selected) return;
    focusLigand.add(ins);
    for (let [, ligand] of ligandMap) {
      if (ligand === ins) continue;
      blurLigand.add(ligand);
    }
    for (let [id, line] of lineMap) {
      if (ins.lineMap.has(id)) {
        blurLigand.delete(line.sourceNode);
        blurLigand.delete(line.targetNode);
        continue;
      }
      blurLine.add(line);
    }

    representationHandler.onmouseover();
  },
  onclick(ins) {
    if (selectLigand.length > 1) {
      const ligand = selectLigand.pop();
      ligand.toNormal(true);
    }
    selectLigand.push(ins);
    selectLigand.forEach((ligand, i) => {
      ligand.toSelect(i);
    });
  },
};

const lineEventHandler = {
  onmouseover(ins) {
    if (ins.selected) return;
    focusLine.add(ins);
    for (let [, ligand] of ligandMap) {
      if (ligand === ins.sourceNode || ligand === ins.targetNode) continue;
      blurLigand.add(ligand);
    }
    for (let [id, line] of lineMap) {
      if (line === ins) {
        continue;
      }
      blurLine.add(line);
    }

    representationHandler.onmouseover();
  },
};

const representationHandler = {
  onmouseover() {
    for (let ligand of focusLigand) {
      ligand.toFocus();
    }
    for (let ligand of blurLigand) {
      ligand.toBlur();
    }
    for (let line of focusLine) {
      line.toFocus();
    }
    for (let line of blurLine) {
      line.toBlur();
    }
  },
  onmouseout() {
    for (let [, ligand] of ligandMap) {
      ligand.toNormal();
    }
    for (let [, line] of lineMap) {
      line.toNormal();
    }
    focusLigand.clear();
    focusLine.clear();
    blurLigand.clear();
    blurLine.clear();
  },
};
