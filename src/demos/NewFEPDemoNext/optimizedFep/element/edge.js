import { getTextPosition, getEdgePoint } from "../util";
import { LIGAND_WIDTH } from "../constant";
import Element from "./element";
import emitter from "../events/emitter";

import {
  EdgeLineElement,
  EdgeTextElement,
  EdgeArrowElement,
} from "./subElement";

class EdgeElement extends Element {
  id = "";
  sourceLigand = null;
  targetLigand = null;
  type = "edge";
  isVirtual = false;
  info = [];

  toRealistic() {
    this.isVirtual = false;
    this.updateStyle();
  }

  reDraw() {
    const info = this.info;
    const isVirtual = this.isVirtual;
    const { originX: sX, originY: sy } = this.sourceLigand.position;
    const { originX: tX, originY: ty } = this.targetLigand.position;
    const { x1, y1, x2, y2 } = getEdgePoint(
      { x: sX, y: sy },
      { x: tX, y: ty },
      LIGAND_WIDTH
    );
    const { x, y, rotation } = getTextPosition(x1, y1, x2, y2, info.length);

    this.subElements.forEach((element) => {
      element.draw({ x1, y1, x2, y2, x, y, rotation, info, isVirtual });
    });
  }

  constructor({ id, source, target, info, isVirtual = false, ligandMap }) {
    super();
    this.id = id;
    this.info = info;
    this.isVirtual = isVirtual;
    this.sourceLigand = ligandMap.get(source);
    this.targetLigand = ligandMap.get(target);
    this.sourceLigand.addEdge(this);
    this.targetLigand.addEdge(this);

    const line = new EdgeLineElement();
    const text = new EdgeTextElement();
    const arrow = new EdgeArrowElement();
    this.subElements.add(line, text, arrow);
    this.subElements.forEach((element) => {
      this.el.add(element.el);
    });

    this.el.on("click", (ev) => emitter.emit("click", this, ev));
    this.el.on("mouseover", (ev) => emitter.emit("mouseover", this, ev));
    this.el.on("mouseout", (ev) => emitter.emit("mouseout", this, ev));
  }
}

export default EdgeElement;
