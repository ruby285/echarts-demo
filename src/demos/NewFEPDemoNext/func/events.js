// import fepGraphChart from "./fepChart";

const hoverLigand = new Set();
const hoverLine = new Set();
const relatedHoverLigand = new Set();
const relatedHoverLine = new Set();
const fateoutLigand = new Set();
const fadeoutLine = new Set();

export const ligandMap = new Map();
export const lineMap = new Map();

let selectLine = null;
const selectLigand = {
  list: [],
  deleteList: [],
  add(n) {
    if (this.list.length > 1) {
      this.deleteList.push(this.list.shift());
      if (selectLine) {
        this.deleteList.push(selectLine);
        selectLine = null;
      }
    }
    this.list.push(n);
    if (this.list.length === 2) {
      this.selectALine(this.list[0], this.list[1]);
    }
    this.update();
  },
  delete(n) {
    if (n.selectIdx) {
      this.deleteList.push(this.list.pop());
    } else {
      this.deleteList.push(this.list.shift());
    }
    if (selectLine) {
      this.deleteList.push(selectLine);
      selectLine = null;
    }
    this.update();
  },
  replaceByLine(sourceNode, targetNode, id) {
    this.deleteList = this.list;
    this.list = [sourceNode, targetNode];
    if (selectLine && selectLine.id !== id) {
      this.deleteList.push(selectLine);
      selectLine = null;
    }
    this.selectALine(sourceNode, targetNode);
    this.update();
  },
  selectALine(sourceNode, targetNode) {
    const lineId = `${sourceNode.id}=>${targetNode.id}`;
    let line = lineMap.get(lineId);
    if (line) {
      selectLine = line;
    } else {
      // 创建一个新的虚线
    }
  },
  update() {
    this.deleteList.forEach((node) => {
      node.onSelectedEnd();
    });
    this.list.forEach((node, idx) => {
      node.onSelected(idx);
    });
    selectLine && selectLine.onSelected();
    this.deleteList = [];
  },
};

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
      return selectLigand.delete(ins);
    }
    return selectLigand.add(ins);
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
    const { sourceNode, targetNode, id } = ins;
    selectLigand.replaceByLine(sourceNode, targetNode, id);
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
