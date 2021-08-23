import {
  Group,
  Image as ZrImage,
  Rect,
  Line as ZrLine,
  Text as ZrText,
} from "zrender";
import imgData from "./ligand.png";
import { getTextPosition, getEdgePoint } from "./util";
import { mouseOverHandler, mouseOutHandler, clickHandler } from "./events";
import { ligandMap } from "./group";
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
} from "./constant";

class Element {
  state = {
    selected: false,
    hover: false,
    relatedHover: false,
    firstAdd: false,
  };
  onHover() {
    this.toScaleX();
    this.state.hover = true;
    this.updateStyle();
  }
  onHoverEnd() {
    this.toScale1();
    this.state.hover = false;
    this.updateStyle();
  }
  onRelatedHover() {
    this.state.relatedHover = true;
    this.updateStyle();
  }
  onRelatedHoverEnd() {
    this.state.relatedHover = false;
    this.updateStyle();
  }
  onSelected(idx) {
    this.selectIdx = idx;
    this.state.selected = true;
    this.updateStyle();
  }
  onSelectedEnd() {
    this.state.selected = false;
    this.updateStyle();
  }
  onFirstAdd() {
    this.state.firstAdd = true;
    this.updateStyle();
  }
  onFirstAddEnd() {
    this.state.firstAdd = false;
    this.updateStyle();
  }

  updateStyle() {
    const { selected, hover, relatedHover, firstAdd } = this.state;
    if (selected) {
      return this._updateStyle(this.style.selected);
    }
    if (hover) {
      return this._updateStyle(this.style.hover);
    }
    if (relatedHover) {
      return this._updateStyle(this.style.relatedHover);
    }
    if (firstAdd) {
      return this._updateStyle(this.style.firstAdd);
    }
    return this._updateStyle(this.style.default);
  }
}

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

export class Ligand extends Element {
  id = "";
  el = null;
  img = null;
  rect = null;
  edgeMap = new Map();
  type = "ligand";

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
    this.order.attr({
      origin: [originX, originY],
      style: {
        text: "1",
        fontSize: 12,
        textFill: "#000",
        textStroke: "#f00",
      },
      shape: {
        r: [7, 7, 7, 7],
        x: x + 5,
        y: y + 5,
      },
    });
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
    this.order = new Rect({
      style: {
        fill: "#f0f",
      },
      shape: {
        width: 14,
        height: 14,
      },
      z2: ELEMENT_Z2,
    });

    this.el.add(this.img);
    this.el.add(this.rect);
    this.el.add(this.order);
  }

  constructor({ id }) {
    super();
    this.el = new Group();
    this.id = id;
    this.init();

    this.el.on("mouseover", (params) =>
      mouseOverHandler("ligand", params, this)
    );
    this.el.on("mouseout", (params) => mouseOutHandler("ligand", params, this));
    this.el.on("click", (params) => clickHandler("ligand", params, this));
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
