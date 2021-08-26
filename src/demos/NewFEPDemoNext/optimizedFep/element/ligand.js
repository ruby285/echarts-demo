import imgData from "../ligand.png";
import { LIGAND_WIDTH_HALF } from "../constant";
import Element from "./element";
import emitter from "../events/emitter";

import {
  LigandRectElement,
  LigandImageElement,
  LigandOrderElement,
  LigandBgRectElement,
} from "./subElement";

class LigandElement extends Element {
  id = "";
  edgeMap = new Map();
  type = "ligand";
  order = null;
  position = {
    x: 0,
    y: 0,
  };

  onSelected(i) {
    const { x, y } = this.position;
    const idx = i + 1;
    if (this.order) {
      this.order.updateIdx(idx);
    } else {
      this.order = new LigandOrderElement({ idx, x, y });
      this.subElements.add(this.order);
      this.el.add(this.order.el);
      this.order.toScaleX();
    }
    super.onSelected();
  }

  onSelectedEnd() {
    if (this.order) {
      this.subElements.delete(this.order);
      this.el.remove(this.order.el);
      this.order = null;
    }
    super.onSelectedEnd();
  }

  addEdge(edge) {
    this.edgeMap.set(edge.id, edge);
  }

  moveTo({ x, y }) {
    const originX = x + LIGAND_WIDTH_HALF;
    const originY = y + LIGAND_WIDTH_HALF;
    this.position = { x, y, originX, originY };

    this.subElements.forEach((element) => {
      element.moveTo({ x, y, originX, originY });
    });
  }

  constructor({ id, img = imgData, firstAdd = false }) {
    super();
    this.id = id;
    this.state.firstAdd = firstAdd;

    const bgRect = new LigandBgRectElement();
    const image = new LigandImageElement(img);
    const rect = new LigandRectElement();
    this.subElements.add(bgRect, image, rect);

    this.subElements.forEach((element) => {
      this.el.add(element.el);
    });

    this.updateStyle();

    this.el.on("click", (ev) => emitter.emit("click", this, ev));
    this.el.on("mouseover", (ev) => emitter.emit("mouseover", this, ev));
    this.el.on("mouseout", (ev) => emitter.emit("mouseout", this, ev));
  }
}

export default LigandElement;
