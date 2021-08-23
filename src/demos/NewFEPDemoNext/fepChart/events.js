import { ligandMap, edgeMap } from "./group";
import fepChart from "./index";

const hoverLigand = new Set();
const hoverEdge = new Set();
const relatedHoverLigand = new Set();
const relatedHoverEdge = new Set();
const fateoutLigand = new Set();
const fadeoutEdge = new Set();

let selectEdge = null;
export const selectLigand = {
  list: [],
  deleteList: [],
  add(n) {
    this.checkVirtualEdge();
    if (this.list.length > 1) {
      this.deleteList.push(this.list.shift());
      if (selectEdge) {
        this.deleteList.push(selectEdge);
        selectEdge = null;
      }
    }
    this.list.push(n);
    if (this.list.length === 2) {
      this.selectAEdge(this.list[0], this.list[1]);
    }
    this.update();
  },
  delete(n) {
    this.checkVirtualEdge();
    const idx = this.list.indexOf(n);
    if (idx) {
      this.deleteList.push(this.list.pop());
    } else {
      this.deleteList.push(this.list.shift());
    }
    if (selectEdge) {
      this.deleteList.push(selectEdge);
      selectEdge = null;
    }
    this.update();
  },
  replaceByEdge(sourceLigand, targetLigand, id) {
    this.checkVirtualEdge();
    this.deleteList = this.list;
    this.list = [sourceLigand, targetLigand];
    if (selectEdge && selectEdge.id !== id) {
      this.deleteList.push(selectEdge);
      selectEdge = null;
    }
    this.selectAEdge(sourceLigand, targetLigand);
    this.update();
  },
  selectAEdge(sourceLigand, targetLigand) {
    const edgeId = `${sourceLigand.id}=>${targetLigand.id}`;
    let edge = edgeMap.get(edgeId);
    if (!edge) {
      edge = fepChart.addEdge({
        id: edgeId,
        source: sourceLigand.id,
        target: targetLigand.id,
        info: ["lalala"],
        isVirtual: true,
      });
    }
    selectEdge = edge;
  },
  clear() {
    this.checkVirtualEdge();
    this.deleteList = this.list.slice();
    if (selectEdge) {
      this.deleteList.push(selectEdge);
      selectEdge = null;
    }
    this.list = [];
    this.update();
  },
  checkVirtualEdge() {
    if (!selectEdge || !selectEdge.isVirtual) return;
    fepChart.deleteEdge(selectEdge);
    selectEdge = null;
  },
  update() {
    this.deleteList.forEach((item) => {
      item.onSelectedEnd();
    });
    this.list.forEach((item, idx) => {
      item.onSelected(idx);
    });
    selectEdge && selectEdge.onSelected();
    this.deleteList = [];
  },
};

export const mouseOverHandler = (type, params, ins) => {
  if (type === "ligand") {
    return ligandEventHandler.onmouseover(ins);
  }
  edgeEventHandler.onmouseover(ins);
};
export const mouseOutHandler = (type, params, ins) => {
  representationHandler.onmouseout();
};
export const clickHandler = (type, params, ins) => {
  if (type === "ligand") {
    return ligandEventHandler.onclick(ins);
  }
  edgeEventHandler.onclick(ins);
};

const ligandEventHandler = {
  onmouseover(ins) {
    if (ins.selected) return;
    hoverLigand.add(ins);
    for (let [, ligand] of ligandMap) {
      if (ligand === ins) continue;
      fateoutLigand.add(ligand);
    }
    for (let [id, edge] of edgeMap) {
      if (ins.edgeMap.has(id)) {
        fateoutLigand.delete(edge.sourceLigand);
        fateoutLigand.delete(edge.targetLigand);
        relatedHoverLigand.add(edge.sourceLigand);
        relatedHoverLigand.add(edge.targetLigand);
        relatedHoverEdge.add(edge);
        continue;
      }
      fadeoutEdge.add(edge);
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

const edgeEventHandler = {
  onmouseover(ins) {
    if (ins.selected) return;
    hoverEdge.add(ins);
    for (let [, ligand] of ligandMap) {
      if (ligand === ins.sourceLigand || ligand === ins.targetLigand) {
        relatedHoverLigand.add(ligand);
        continue;
      }
      fateoutLigand.add(ligand);
    }
    for (let [, edge] of edgeMap) {
      if (edge === ins) {
        continue;
      }
      fadeoutEdge.add(edge);
    }

    representationHandler.onmouseover();
  },
  onclick(ins) {
    const { sourceLigand, targetLigand, id } = ins;
    selectLigand.replaceByEdge(sourceLigand, targetLigand, id);
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
    for (let edge of hoverEdge) {
      edge.onHover();
    }
    for (let edge of fadeoutEdge) {
      edge.fadeout();
    }
    for (let edge of relatedHoverEdge) {
      edge.onRelatedHover();
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
    for (let edge of hoverEdge) {
      edge.onHoverEnd();
    }
    for (let edge of fadeoutEdge) {
      edge.fadein();
    }
    for (let edge of relatedHoverEdge) {
      edge.onRelatedHoverEnd();
    }
    hoverLigand.clear();
    fateoutLigand.clear();
    relatedHoverLigand.clear();
    hoverEdge.clear();
    fadeoutEdge.clear();
    relatedHoverEdge.clear();
  },
};
