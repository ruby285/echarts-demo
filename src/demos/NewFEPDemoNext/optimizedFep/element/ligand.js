import { Group, Image as ZrImage, Rect, Text as ZrText } from "zrender";
import imgData from "../ligand.png";
import {
  LIGAND_WIDTH,
  LIGAND_WIDTH_HALF,
  SCALE_1,
  SCALE_X,
  EDGE_WIDTH,
  EDGE_SCALE_WIDTH,
  NORMAL_OPACITY,
  FADEOUT_OPACITY,
  ANIMATE_CONFIG,
  ELEMENT_Z2,
} from "../constant";
import Element from "./element";
import emitter from "../events/emitter";
import LigandRectElement from "./subElement/ligandRect";
import LigandImageElement from "./subElement/ligandImage";
import LigandOrderElement from "./subElement/ligandOrder";

export class Ligand extends Element {
  id = "";
  el = null;
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

    Array.from(this.subElements).forEach((element) => {
      element.moveTo({ x, y, originX, originY });
    });
  }

  init(img = imgData) {
    const image = new LigandImageElement(img);
    const rect = new LigandRectElement();
    this.subElements.add(image);
    this.subElements.add(rect);

    Array.from(this.subElements).forEach((element) => {
      this.el.add(element.el);
    });

    this.updateStyle();
  }

  constructor({ id, firstAdd = false }) {
    super();
    this.el = new Group();
    this.id = id;
    this.state.firstAdd = firstAdd;
    this.init();

    this.el.on("click", (ev) => emitter.emit("click", this, ev));
    this.el.on("mouseover", (ev) => emitter.emit("mouseover", this, ev));
    this.el.on("mouseout", (ev) => emitter.emit("mouseout", this, ev));
  }
}
