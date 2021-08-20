import {
  Group,
  Image as ZrImage,
  Rect,
  Line as ZrLine,
  Text as ZrText,
} from "zrender";
import imgData from "./ligand.png";
import { getTextPosition, getLinePoint } from "./util";
import { mouseOverHandler, mouseOutHandler, clickHandler } from "./events";
import { ligandMap } from "./group";

const ligandWidth = 100;
const focusScale = 1.5;
const animateConfig = {
  duration: 200,
  easing: "cubicOut",
};

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

export class Line extends Element {
  id = "";
  source = "";
  target = "";
  sourceNode = null;
  targetNode = null;
  type = "line";
  el = null;
  line = null;
  textGroup = null;
  info = [];

  style = {
    selected: {
      line: {
        stroke: "#f00",
      },
    },
    hover: {
      line: {
        stroke: "#ff0",
      },
    },
    relatedHover: {
      line: {
        stroke: "#000",
      },
    },
    default: {
      line: {
        stroke: "#000",
      },
    },
  };

  _updateStyle(style) {
    this.line.animateTo(
      {
        style: style.line,
      },
      animateConfig
    );
  }

  toScale1() {
    this.line.animateTo(
      {
        style: {
          lineWidth: 1,
        },
      },
      animateConfig
    );
  }
  toScaleX() {
    this.line.animateTo(
      {
        style: {
          lineWidth: 10,
        },
      },
      animateConfig
    );
  }

  fadeout() {
    this.line.animateTo({
      style: {
        opacity: 0.1,
      },
    });
  }
  fadein() {
    this.line.animateTo({
      style: {
        opacity: 1,
      },
    });
  }

  onCreate() {
    this.sourceNode.addLine(this);
    this.targetNode.addLine(this);
  }

  onDelete() {}

  init() {
    this.textGroup = new Group();
    this.line = new ZrLine({});

    this.el.add(this.line);
    this.el.add(this.textGroup);
  }

  reDraw() {
    const info = this.info;
    const { x1, y1, x2, y2 } = getLinePoint(
      this.sourceNode.position,
      this.targetNode.position,
      100
    );
    this.textGroup.removeAll();
    this.line.attr({
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

  constructor({ source, target, info }) {
    super();
    this.id = `${source}=>${target}`;
    this.info = info;
    this.source = source;
    this.target = target;
    this.sourceNode = ligandMap.get(source);
    this.targetNode = ligandMap.get(target);
    this.el = new Group();
    this.init();

    this.onCreate();

    this.el.on("mouseover", (params) => mouseOverHandler("line", params, this));
    this.el.on("mouseout", (params) => mouseOutHandler("line", params, this));
    this.el.on("click", (params) => clickHandler("line", params, this));
  }
}

export class Ligand extends Element {
  id = "";
  el = null;
  img = null;
  rect = null;
  lineMap = new Map();
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
      animateConfig
    );
    this.img.animateTo(
      {
        style: style.img,
      },
      animateConfig
    );
  }

  toScale1() {
    this.img.animateTo(
      {
        scale: [1, 1],
      },
      animateConfig
    );
    this.rect.animateTo(
      {
        scale: [1, 1],
      },
      animateConfig
    );
  }

  toScaleX() {
    this.rect.animateTo(
      {
        scale: [focusScale, focusScale],
      },
      animateConfig
    );
    this.img.animateTo(
      {
        scale: [focusScale, focusScale],
      },
      animateConfig
    );
  }

  fadeout() {
    this.rect.animateTo({
      style: {
        opacity: 0.1,
      },
    });
    this.img.animateTo({
      style: {
        opacity: 0.1,
      },
    });
  }
  fadein() {
    this.rect.animateTo({
      style: {
        opacity: 1,
      },
    });
    this.img.animateTo({
      style: {
        opacity: 1,
      },
    });
  }

  addLine(line) {
    this.lineMap.set(line.id, line);
  }

  onDelete() {}

  moveTo({ x, y }) {
    this.position = { x: x + 50, y: y + 50 };
    this.img.attr({
      origin: [x + 50, y + 50],
      style: {
        x,
        y,
      },
    });
    this.rect.attr({
      origin: [x + 50, y + 50],
      shape: {
        x,
        y,
      },
    });
  }

  init(img = imgData) {
    this.img = new ZrImage({
      style: {
        image: img,
        width: ligandWidth,
        height: ligandWidth,
      },
      z2: 100,
    });
    this.rect = new Rect({
      style: {
        fill: "rgba(0,0,0,0)",
        stroke: "#000",
      },
      shape: {
        width: ligandWidth,
        height: ligandWidth,
      },
      z2: 100,
    });

    this.el.add(this.img);
    this.el.add(this.rect);
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

export class Text {
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
