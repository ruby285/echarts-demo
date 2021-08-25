import {
  Group,
  Image as ZrImage,
  Path,
  Line as ZrLine,
  Text as ZrText,
} from "zrender";
import { getTextPosition, getEdgePoint } from "../util";
import { ligandMap } from "../group";
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
import EdgeLineElement from "./subElement/edgeLine";
import EdgeTextElement from "./subElement/edgeText";
import EdgeArrowElement from "./subElement/edgeArrow";

export class Edge extends Element {
  id = "";
  sourceLigand = null;
  targetLigand = null;
  type = "edge";
  el = new Group();
  virtualBtn = null;
  isVirtual = false;
  info = [];

  initRealisticBtn() {
    this.deleteBtn = new EdgeButton({
      text: "delete edge",
      type: "deleteEdge",
      edge: this,
    });
    this.calculationBtn = new EdgeButton({
      text: "add to calculation queue",
      type: "calculation",
      edge: this,
    });
    this.el.add(this.deleteBtn.el);
    this.el.add(this.calculationBtn.el);
    if (!this.state.selected) {
      this.deleteBtn.hide();
      this.calculationBtn.hide();
    }
  }

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

    Array.from(this.subElements).forEach((element) => {
      element.draw({ x1, y1, x2, y2, x, y, rotation, info, isVirtual });
    });
  }

  constructor({ id, source, target, info, isVirtual = false }) {
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
    this.subElements.add(line);
    this.subElements.add(text);
    this.subElements.add(arrow);
    Array.from(this.subElements).forEach((element) => {
      this.el.add(element.el);
    });

    this.el.on("click", (ev) => emitter.emit("click", this, ev));
    this.el.on("mouseover", (ev) => emitter.emit("mouseover", this, ev));
    this.el.on("mouseout", (ev) => emitter.emit("mouseout", this, ev));
  }
}
