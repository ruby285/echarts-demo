// import fepGraphChart from "./fepChart";

const selectLigand = [];
let selectLine = null;
const hoverLigand = new Set();
const hoverLine = new Set();
const relatedHoverLigand = new Set();
const relatedHoverLine = new Set();
const fateoutLigand = new Set();
const fadeoutLine = new Set();

export const ligandMap = new Map();
export const lineMap = new Map();

export const mouseOverHandler = (type, params, ins) => {
  if (type === "ligand") {
    return ligandEventHandler.onmouseover(ins);
  }
  lineEventHandler.onmouseover(ins);
};
export const mouseOutHandler = (type, params, ins) => {
  representationHandler.onmouseout();
};
export const clickHandler = (type, params, ins) => {
  if (type === "ligand") {
    return ligandEventHandler.onclick(ins);
  }
  lineEventHandler.onclick(ins);
};

const ligandEventHandler = {
  onmouseover(ins) {
    if (ins.selected) return;
    hoverLigand.add(ins);
    for (let [, ligand] of ligandMap) {
      if (ligand === ins) continue;
      fateoutLigand.add(ligand);
    }
    for (let [id, line] of lineMap) {
      if (ins.lineMap.has(id)) {
        fateoutLigand.delete(line.sourceNode);
        fateoutLigand.delete(line.targetNode);
        relatedHoverLigand.add(line.sourceNode);
        relatedHoverLigand.add(line.targetNode);
        relatedHoverLine.add(line);
        continue;
      }
      fadeoutLine.add(line);
    }

    representationHandler.onmouseover();
  },
  onclick(ins) {
    if (ins.state.selected) {
      const idx = ins.onSelectedEnd();
      if (idx) {
        return selectLigand.pop();
      }
      return selectLigand.shift();
    }
    if (selectLigand.length === 2) {
      // 删除两者之间的连线
      // 移除栈中的第一个选中元素
      const ligand = selectLigand.shift();
      ligand.onSelectedEnd();
      selectLine.onSelectedEnd();
    }
    selectLigand.push(ins);
    selectLigand.forEach((ligand, i) => {
      ligand.onSelected(i);
    });
    if (selectLigand.length === 2) {
      const sourceId = selectLigand[0].id;
      const targetId = selectLigand[1].id;
      const lineId = `${sourceId}=>${targetId}`;
      let line = lineMap.get(lineId);
      if (line) {
        // 如果存在一条线，则高亮它
        selectLine = line;
        line.onSelected();
      } else {
        // 如果不存在线，就创建一个虚拟的线
      }
    }
  },
};

const lineEventHandler = {
  onmouseover(ins) {
    if (ins.selected) return;
    hoverLine.add(ins);
    for (let [, ligand] of ligandMap) {
      if (ligand === ins.sourceNode || ligand === ins.targetNode) {
        relatedHoverLigand.add(ligand);
        continue;
      }
      fateoutLigand.add(ligand);
    }
    for (let [, line] of lineMap) {
      if (line === ins) {
        continue;
      }
      fadeoutLine.add(line);
    }

    representationHandler.onmouseover();
  },
  onclick(ins) {
    const { sourceNode, targetNode } = ins;
    ligandEventHandler.onclick(sourceNode);
    ligandEventHandler.onclick(targetNode);
  },
};

const representationHandler = {
  onmouseover() {
    for (let ligand of hoverLigand) {
      ligand.onHover();
    }
    for (let ligand of fateoutLigand) {
      ligand.fadeout();
    }
    for (let ligand of relatedHoverLigand) {
      ligand.onRelatedHover();
    }
    for (let line of hoverLine) {
      line.onHover();
    }
    for (let line of fadeoutLine) {
      line.fadeout();
    }
    for (let line of relatedHoverLine) {
      line.onRelatedHover();
    }
  },
  onmouseout() {
    for (let ligand of hoverLigand) {
      ligand.onHoverEnd();
    }
    for (let ligand of fateoutLigand) {
      ligand.fadein();
    }
    for (let ligand of relatedHoverLigand) {
      ligand.onRelatedHoverEnd();
    }
    for (let line of hoverLine) {
      line.onHoverEnd();
    }
    for (let line of fadeoutLine) {
      line.fadein();
    }
    for (let line of relatedHoverLine) {
      line.onRelatedHoverEnd();
    }
    hoverLigand.clear();
    fateoutLigand.clear();
    relatedHoverLigand.clear();
    hoverLine.clear();
    fadeoutLine.clear();
    relatedHoverLine.clear();
  },
};
