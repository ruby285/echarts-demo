import {
  Group,
  Image as ZrImage,
  Rect,
  Line as ZrLine,
  Text as ZrText,
} from "zrender";
import imgData from "../ligand.png";
import { getTextPosition, getEdgePoint } from "../util";
import { mouseOverHandler, mouseOutHandler, clickHandler } from "../events";
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

export class Edge extends Element {
  id = "";
  source = "";
  target = "";
  sourceLigand = null;
  targetLigand = null;
  type = "edge";
  el = null;
  edge = null;
  textGroup = null;
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

  onCreate() {
    this.sourceLigand.addEdge(this);
    this.targetLigand.addEdge(this);
  }

  onDelete() {}

  init() {
    this.textGroup = new Group();
    const opts = { style: {} };
    if (this.isVirtual) {
      opts.style = {
        lineDash: [2, 6],
      };
    }

    this.edge = new ZrLine(opts);

    this.el.add(this.edge);
    this.el.add(this.textGroup);
  }

  reDraw() {
    const info = this.info;
    const { x1, y1, x2, y2 } = getEdgePoint(
      this.sourceLigand.position,
      this.targetLigand.position,
      LIGAND_WIDTH
    );
    this.textGroup.removeAll();
    this.edge.attr({
      shape: {
        x1,
        y1,
        x2,
        y2,
      },
    });
    const texts = getTextPosition(x1, y1, x2, y2, info.length);
    texts.forEach((item, i) => {
      const text = new Text({ ...item, text: info[i] });
      this.textGroup.add(text.el);
    });
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
    this.el = new Group();
    this.init();

    this.onCreate();

    this.el.on("mouseover", (params) => mouseOverHandler("edge", params, this));
    this.el.on("mouseout", (params) => mouseOutHandler("edge", params, this));
    this.el.on("click", (params) => clickHandler("edge", params, this));
  }
}

class Text {
  el = null;
  constructor({ x, y, rotation = 0, text }) {
    this.el = new ZrText({
      rotation: rotation,
      x,
      y,
      style: {
        text,
        textAlign: "center",
        textPosition: "inside",
        textVerticalAlign: "middle",
      },
    });
  }
}
