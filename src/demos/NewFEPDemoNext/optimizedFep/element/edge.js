import {
  Group,
  Image as ZrImage,
  Rect,
  Path,
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
import emitter from "../events/emitter";

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
  arrow = new Arrow();
  virtualBtn = null;
  isVirtual = false;
  info = [];

  style = {
    selected: {
      edge: {
        stroke: "#f00",
      },
      text: {
        backgroundColor: "#f00",
      },
      arrow: {
        fill: "#f00",
      },
    },
    hover: {
      edge: {
        stroke: "#ff0",
      },
      text: {
        backgroundColor: "#ff0",
      },
      arrow: {
        fill: "#ff0",
      },
    },
    relatedHover: {
      edge: {
        stroke: "#000",
      },
      text: {
        backgroundColor: "#fff",
      },
      arrow: {
        fill: "#000",
      },
    },
    default: {
      edge: {
        stroke: "#000",
      },
      text: {
        backgroundColor: "#fff",
      },
      arrow: {
        fill: "#000",
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
    this.text.animateTo(
      {
        style: style.text,
      },
      ANIMATE_CONFIG
    );
    this.arrow.animateTo(
      {
        style: style.arrow,
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
    this.text.animateTo(
      {
        style: {
          textShadowBlur: 0,
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
          shadowColor: "#ff0",
          shadowBlur: 20,
        },
      },
      ANIMATE_CONFIG
    );
    this.text.animateTo(
      {
        style: {
          // backgroundColor: "#ff0",
          padding: [0, 10],
          // borderWidth: 2,
          // borderColor: "#f00",
          // borderRadius: 2,
          // shadowColor: "#f0f",
          // shadowBlur: 20,
          textShadowColor: "#0ff",
          textShadowBlur: 20,
          // },
        },
      },
      ANIMATE_CONFIG
    );
  }

  fadeout() {
    this.edge.animateTo(
      {
        style: {
          opacity: FADEOUT_OPACITY,
        },
      },
      ANIMATE_CONFIG
    );
    this.text.animateTo(
      {
        style: {
          opacity: FADEOUT_OPACITY,
        },
      },
      ANIMATE_CONFIG
    );

    this.arrow.animateTo(
      {
        style: {
          opacity: FADEOUT_OPACITY,
        },
      },
      ANIMATE_CONFIG
    );
  }

  fadein() {
    this.edge.animateTo(
      {
        style: {
          opacity: NORMAL_OPACITY,
        },
      },
      ANIMATE_CONFIG
    );
    this.text.animateTo(
      {
        style: {
          opacity: NORMAL_OPACITY,
        },
      },
      ANIMATE_CONFIG
    );
    this.arrow.animateTo(
      {
        style: {
          opacity: NORMAL_OPACITY,
        },
      },
      ANIMATE_CONFIG
    );
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
      type: "addEdge",
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
    this.arrow.attr({
      rotation: rotation - Math.PI * 1.5,
      origin: [x1, y1],
      shape: {
        x: x1,
        y: y1,
        width: 10,
        height: 10,
      },
    });
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
    this.el.add(this.arrow);
    if (isVirtual) {
      this.initVirtualBtn();
    } else {
      this.initRealisticBtn();
    }

    this.el.on("click", (ev) => emitter.emit("click", this, ev));
    this.el.on("mouseover", (ev) => emitter.emit("mouseover", this, ev));
    this.el.on("mouseout", (ev) => emitter.emit("mouseout", this, ev));
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

    this.el.on("click", (ev) => emitter.emit("click", this, ev));
  }
}

const Arrow = Path.extend({
  type: "arrow",

  shape: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },

  buildPath: function (ctx, shape) {
    const height = shape.height;
    const width = shape.width;
    const x = shape.x;
    const y = shape.y;
    const dx = (width / 3) * 2;
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + height);
    ctx.lineTo(x, y + (height / 4) * 3);
    ctx.lineTo(x - dx, y + height);
    ctx.lineTo(x, y);
    ctx.closePath();
  },
});
