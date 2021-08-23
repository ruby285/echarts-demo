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
