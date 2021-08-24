import emitter from "./emitter";

export class Selector {
  edge = null;
  list = [];
  deleteList = [];

  add(ligand) {
    this.checkVirtualEdge();
    if (this.list.length > 1) {
      this.deleteList.push(this.list.shift());
      if (this.edge) {
        this.deleteList.push(this.edge);
        this.edge = null;
      }
    }
    this.list.push(ligand);
    if (this.list.length === 2) {
      this.selectAEdge(this.list[0], this.list[1]);
    }
    this.update();
  }

  delete(ligand) {
    const idx = this.list.indexOf(ligand);
    if (idx < 0) return;
    this.checkVirtualEdge();
    if (idx) {
      this.deleteList.push(this.list.pop());
    } else {
      this.deleteList.push(this.list.shift());
    }
    if (this.edge) {
      this.deleteList.push(this.edge);
      this.edge = null;
    }
    this.update();
  }

  replaceByEdge(sourceLigand, targetLigand, id) {
    this.checkVirtualEdge();
    this.deleteList = this.list;
    this.list = [sourceLigand, targetLigand];
    if (this.edge && this.edge.id !== id) {
      this.deleteList.push(this.edge);
      this.edge = null;
    }
    this.selectAEdge(sourceLigand, targetLigand);
    this.update();
  }

  selectAEdge(sourceLigand, targetLigand) {
    const edgeId = `${sourceLigand.id}=>${targetLigand.id}`;
    let edge = this.edgeMap.get(edgeId);
    if (!edge) {
      edge = emitter.emit("addVirtualEdge", {
        id: edgeId,
        source: sourceLigand.id,
        target: targetLigand.id,
        info: ["lalala"],
        isVirtual: true,
      });
    }
    this.edge = edge;
  }

  checkVirtualEdge() {
    if (!this.edge || !this.edge.isVirtual) return;
    emitter.emit("deleteEdge", this.edge);
    this.edge = null;
  }

  clear() {
    this.checkVirtualEdge();
    this.deleteList = this.list.slice();
    if (this.edge) {
      this.deleteList.push(this.edge);
      this.edge = null;
    }
    this.list = [];
    this.update();
  }

  update() {
    this.deleteList.forEach((item) => {
      item.onSelectedEnd();
    });
    this.list.forEach((item, idx) => {
      item.onSelected(idx);
    });
    this.edge && this.edge.onSelected();
    this.deleteList = [];
  }

  constructor(ligandMap, edgeMap) {
    this.ligandMap = ligandMap;
    this.edgeMap = edgeMap;
  }
}

export const hoverLigand = new Set();
export const hoverEdge = new Set();
export const relatedHoverLigand = new Set();
export const relatedHoverEdge = new Set();
export const fateoutLigand = new Set();
export const fadeoutEdge = new Set();
