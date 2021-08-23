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
  text = null;
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
    this.text = new ZrText();
    const opts = { style: {} };
    if (this.isVirtual) {
      opts.style = {
        lineDash: [2, 6],
      };
    }

    this.edge = new ZrLine(opts);

    this.el.add(this.edge);
    this.el.add(this.text);
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
    const texts = getTextPosition(x1, y1, x2, y2, info.length);
    const { x, y, rotation } = texts[0];
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
