import { Group, Image as ZrImage, Rect, Text as ZrText } from "zrender";
import imgData from "../ligand.png";
// import { mouseOverHandler, mouseOutHandler, clickHandler } from "../events";
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
import fepChart from "../index";
import emitter from "../events/emitter";

export class Ligand extends Element {
  id = "";
  el = null;
  img = null;
  rect = null;
  edgeMap = new Map();
  type = "ligand";
  order = null;

  position = {
    x: 0,
    y: 0,
  };

  style = {
    selected: {
      rect: {
        stroke: "#f00",
      },
      img: {
        shadowColor: "#f00",
        shadowBlur: 20,
      },
    },
    hover: {
      rect: {
        stroke: "#ff0",
      },
      img: {
        shadowColor: "#ff0",
        shadowBlur: 20,
      },
    },
    relatedHover: {
      rect: {
        stroke: "#000",
      },
      img: {
        shadowBlur: 0,
      },
    },
    firstAdd: {
      rect: {
        stroke: "#f0f",
      },
      img: {
        shadowColor: "#f0f",
        shadowBlur: 20,
      },
    },
    default: {
      rect: {
        stroke: "#000",
      },
      img: {
        shadowBlur: 0,
      },
    },
  };

  _updateStyle(style) {
    this.rect.animateTo(
      {
        style: style.rect,
      },
      ANIMATE_CONFIG
    );
    this.img.animateTo(
      {
        style: style.img,
      },
      ANIMATE_CONFIG
    );
  }

  onSelected(i) {
    const { x, y } = this.position;
    const idx = i + 1;

    if (this.order) {
      this.order.updateIdx(idx);
    } else {
      this.order = new Order({
        idx,
        x: x - LIGAND_WIDTH_HALF,
        y: y - LIGAND_WIDTH_HALF,
      });
      this.el.add(this.order.el);
      this.order.toScaleX();
    }
    this.deleteBtn.show();
    super.onSelected();
  }
  onSelectedEnd() {
    if (this.order) {
      this.el.remove(this.order.el);
      this.order = null;
    }
    this.deleteBtn.hide();
    super.onSelectedEnd();
  }

  toScale1() {
    this.img.animateTo(
      {
        scale: SCALE_1,
      },
      ANIMATE_CONFIG
    );
    this.rect.animateTo(
      {
        scale: SCALE_1,
      },
      ANIMATE_CONFIG
    );
    this.order && this.order.toScale1();
  }

  toScaleX() {
    this.rect.animateTo(
      {
        scale: SCALE_X,
      },
      ANIMATE_CONFIG
    );
    this.img.animateTo(
      {
        scale: SCALE_X,
      },
      ANIMATE_CONFIG
    );
    this.order && this.order.toScaleX();
  }

  fadeout() {
    this.rect.animateTo({
      style: {
        opacity: FADEOUT_OPACITY,
      },
    });
    this.img.animateTo({
      style: {
        opacity: FADEOUT_OPACITY,
      },
    });
    this.order && this.order.fadeout();
  }
  fadein() {
    this.rect.animateTo({
      style: {
        opacity: NORMAL_OPACITY,
      },
    });
    this.img.animateTo({
      style: {
        opacity: NORMAL_OPACITY,
      },
    });
    this.order && this.order.fadein();
  }

  addEdge(edge) {
    this.edgeMap.set(edge.id, edge);
  }

  onDelete() {}

  moveTo({ x, y }) {
    const originX = x + LIGAND_WIDTH_HALF;
    const originY = y + LIGAND_WIDTH_HALF;
    this.position = { x: originX, y: originY };
    this.img.attr({
      origin: [originX, originY],
      style: {
        x,
        y,
      },
    });
    this.rect.attr({
      origin: [originX, originY],
      shape: {
        x,
        y,
      },
    });
    this.order && this.order.moveTo({ x, y });
    this.deleteBtn && this.deleteBtn.moveTo({ x: x + 110, y });
  }

  init(img = imgData) {
    this.img = new ZrImage({
      style: {
        image: img,
        width: LIGAND_WIDTH,
        height: LIGAND_WIDTH,
      },
      z2: ELEMENT_Z2,
    });
    this.rect = new Rect({
      style: {
        fill: "none",
        stroke: "#000",
      },
      shape: {
        width: LIGAND_WIDTH,
        height: LIGAND_WIDTH,
      },
      z2: ELEMENT_Z2,
    });
    this.deleteBtn = new LigandButton({
      text: "delete ligand",
      type: "deleteLigand",
      ligand: this,
    });
    this.deleteBtn.hide();

    this.el.add(this.img);
    this.el.add(this.rect);
    this.el.add(this.deleteBtn.el);
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

const ORDER_DEFAULT_WIDTH = 14;
const ORDER_WIDTH_HALF = ORDER_DEFAULT_WIDTH / 2;
const ORDER_RADIUS = [
  ORDER_WIDTH_HALF,
  ORDER_WIDTH_HALF,
  ORDER_WIDTH_HALF,
  ORDER_WIDTH_HALF,
];
const ORDER_FONT_SIZE = 12;
const ORDER_FONT_SIZE_HALF = ORDER_FONT_SIZE / 2;

class Order {
  el = null;
  fadeout() {
    this.el.animateTo(
      {
        opacity: FADEOUT_OPACITY,
      },
      ANIMATE_CONFIG
    );
  }
  fadein() {
    this.el.animateTo(
      {
        opacity: NORMAL_OPACITY,
      },
      ANIMATE_CONFIG
    );
  }
  toScale1() {
    this.el.animateTo(
      {
        scale: SCALE_1,
      },
      ANIMATE_CONFIG
    );
  }
  toScaleX() {
    this.el.animateTo(
      {
        scale: SCALE_X,
      },
      ANIMATE_CONFIG
    );
  }

  moveTo({ x, y }) {
    this.el.attr({
      origin: [45, 45],
      x: x + 5,
      y: y + 5,
    });
  }
  updateIdx(idx) {
    this.el.attr({
      style: {
        text: `{a|${idx}}`,
      },
    });
  }
  constructor({ idx, x, y }) {
    this.el = new ZrText({
      style: {
        text: `{a|${idx}}`,
        rich: {
          a: {
            fill: "#fff",
            lineHeight: 12,
            fontSize: 12,
            fontWeight: 600,
            align: "center",
            backgroundColor: "blue",
            width: 14,
            height: 14,
            borderRadius: 7,
          },
        },
      },
      z2: ELEMENT_Z2,
    });

    this.moveTo({ x, y });
  }
}

class LigandButton {
  el = null;
  ligand = null;
  fadeout() {
    this.el.animateTo(
      {
        opacity: FADEOUT_OPACITY,
      },
      ANIMATE_CONFIG
    );
  }
  fadein() {
    this.el.animateTo(
      {
        opacity: NORMAL_OPACITY,
      },
      ANIMATE_CONFIG
    );
  }
  toScale1() {}
  toScaleX() {}

  show() {
    this.el.show();
  }
  hide() {
    this.el.hide();
  }
  moveTo({ x, y, rotation }) {
    this.el.attr({
      // rotation,
      x,
      y,
    });
  }

  constructor({ text, ligand, type }) {
    this.ligand = ligand;
    this.type = type;
    this.el = new ZrText({
      style: {
        // text: [`{a|${text}}`, `{b|样式b}`].join(" "),
        text: `{a|${text}}`,
        align: "left",
        rich: {
          a: {
            fill: "#000",
          },
        },
      },
    });

    this.el.on("click", (ev) => emitter.emit("click", this, ev));
  }
}
