import {
  Group,
  Image as ZrImage,
  Rect,
  Line as ZrLine,
  Text as ZrText,
} from "zrender";
import imgData from "../ligand.png";
import { getTextPosition, getEdgePoint } from "../util";
// import { mouseOverHandler, mouseOutHandler, clickHandler } from "../events";
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
import fepChart from "../index";

export class Edge extends Element {
  id = "";
  source = "";
  target = "";
  sourceLigand = null;
  targetLigand = null;
  type = "edge";
  el = new Group();
  edge = new ZrLine();
  text = new ZrText();
  virtualBtn = null;
  isVirtual = false;
  info = [];

  style = {
    selected: {
      edge: {
        stroke: "#f00",
      },
    },
    hover: {
      edge: {
        stroke: "#ff0",
      },
    },
    relatedHover: {
      edge: {
        stroke: "#000",
      },
    },
    default: {
      edge: {
        stroke: "#000",
      },
    },
  };

  _updateStyle(style) {
    this.edge.animateTo(
      {
        style: style.edge,
      },
      ANIMATE_CONFIG
    );
  }

  toScale1() {
    this.edge.animateTo(
      {
        style: {
          edgeWidth: EDGE_WIDTH,
        },
      },
      ANIMATE_CONFIG
    );
  }
  toScaleX() {
    this.edge.animateTo(
      {
        style: {
          edgeWidth: EDGE_SCALE_WIDTH,
        },
      },
      ANIMATE_CONFIG
    );
  }

  fadeout() {
    this.edge.animateTo({
      style: {
        opacity: FADEOUT_OPACITY,
      },
    });
  }

  fadein() {
    this.edge.animateTo({
      style: {
        opacity: NORMAL_OPACITY,
      },
    });
  }

  onSelected() {
    if (!this.isVirtual) {
      this.deleteBtn.show();
      this.calculationBtn.show();
    }
    super.onSelected();
  }

  onSelectedEnd() {
    if (!this.isVirtual) {
      this.deleteBtn.hide();
      this.calculationBtn.hide();
    }
    super.onSelectedEnd();
  }

  initVirtualBtn() {
    this.virtualBtn = new EdgeButton({
      text: "add edge",
      edge: this,
      type: "add",
    });
    this.edge.attr({
      style: {
        lineDash: [2, 6],
      },
    });
    this.el.add(this.virtualBtn.el);
  }

  initRealisticBtn() {
    this.deleteBtn = new EdgeButton({
      text: "delete edge",
      type: "delete",
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
    this.edge.attr({
      style: {
        lineDash: null,
      },
    });
    this.el.remove(this.virtualBtn.el);
    this.virtualBtn = null;
    this.initRealisticBtn();
  }

  reDraw() {
    const info = this.info;
    const { x1, y1, x2, y2 } = getEdgePoint(
      this.sourceLigand.position,
      this.targetLigand.position,
      LIGAND_WIDTH
    );
    this.edge.attr({
      shape: {
        x1,
        y1,
        x2,
        y2,
      },
    });
    const { x, y, rotation } = getTextPosition(x1, y1, x2, y2, info.length);
    // const { x, y, rotation } = texts[0];
    // const { x, y, rotation } = texts[2];
    this.text.attr({
      x,
      y,
      rotation,
      style: {
        text: info.map((item, i) => `{a${i + 1}|${item}}`).join("\n"),
        align: "center",
        rich: {
          a1: {
            fill: "red",
          },
          a2: {
            fill: "green",
          },
          a3: {
            fill: "blue",
          },
        },
      },
    });

    if (this.virtualBtn) {
      const { x, y, rotation } = getTextPosition(x1, y1, x2, y2, 8);
      this.virtualBtn.moveTo({ x, y, rotation });
    }
    if (this.deleteBtn) {
      const { x, y, rotation } = getTextPosition(x1, y1, x2, y2, 8);
      this.deleteBtn.moveTo({ x, y, rotation });
      this.calculationBtn.moveTo({ x, y: y + 16, rotation });
    }
  }

  constructor({ source, target, info, isVirtual = false }) {
    super();
    this.id = `${source}=>${target}`;
    this.info = info;
    this.source = source;
    this.target = target;
    this.isVirtual = isVirtual;
    this.sourceLigand = ligandMap.get(source);
    this.targetLigand = ligandMap.get(target);
    this.sourceLigand.addEdge(this);
    this.targetLigand.addEdge(this);
    this.el.add(this.edge);
    this.el.add(this.text);
    if (isVirtual) {
      this.initVirtualBtn();
    } else {
      this.initRealisticBtn();
    }

    // this.el.on("mouseover", (params) => mouseOverHandler("edge", params, this));
    // this.el.on("mouseout", (params) => mouseOutHandler("edge", params, this));
    // this.el.on("click", (params) => clickHandler("edge", params, this));
  }
}

class EdgeButton {
  el = null;
  edge = null;
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

  constructor({ text, edge, type }) {
    this.edge = edge;
    this.type = type;
    this.el = new ZrText({
      style: {
        // text: [`{a|${text}}`, `{b|样式b}`].join(" "),
        text: `{a|${text}}`,
        align: "center",
        rich: {
          a: {
            fill: "#000",
          },
          b: {
            fill: "#00f",
          },
        },
      },
    });
    this.el.on("click", (ev) => {
      ev.cancelBubble = true;
      if (this.type === "add") {
        return this.edge.toRealistic();
      }
      if (this.type === "delete") {
        return fepChart.deleteEdge(this.edge);
      }
      console.log(this.type);
      // if (this.type === 'add') {
      //   return this.edge.toRealistic();
      // }
    });
  }
}
