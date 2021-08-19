import {
  Group,
  Image as ZrImage,
  Rect,
  Line as ZrLine,
  Text as ZrText,
} from "zrender";
import imgData from "./ligand.png";
import { getTextPosition } from "./util";
import {
  mouseOverHandler,
  mouseOutHandler,
  clickHandler,
  ligandMap,
} from "./events";

const ligandWidth = 100;
const focusScale = 1.5;
const animateConfig = {
  duration: 200,
  easing: "cubicOut",
};

// 元素的几种状态
// 一般状态
// focus状态（hover）
// blur状态
// select状态
// add高亮状态

export class Line {
  id = "";
  source = "";
  target = "";
  sourceNode = null;
  targetNode = null;
  el = null;
  line = null;
  textGroup = null;
  selected = false;

  style = {
    line: {
      normal: { opacity: 1, lineWidth: 1, stroke: "#000" },
      focus: {
        stroke: "#ff0",
        lineWidth: 10,
      },
      blur: {
        opacity: 0.1,
      },
      select: {
        stroke: "#f00",
        lineWidth: 10,
      },
    },
  };
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
    this.img.animateTo(
      {
        scale: [focusScale, focusScale],
      },
      animateConfig
    );
    this.rect.animateTo(
      {
        scale: [focusScale, focusScale],
      },
      animateConfig
    );
  }
  toNormal(cancleSelect) {
    if (cancleSelect) this.selected = false;
    this.line.animateTo(
      {
        style: this.style.line.normal,
      },
      animateConfig
    );
  }
  toFocus() {
    this.line.animateTo(
      {
        style: this.style.line.focus,
      },
      animateConfig
    );
  }
  toBlur() {
    this.line.animateTo(
      {
        style: this.style.line.blur,
      },
      animateConfig
    );
  }
  toSelect() {
    this.selected = true;
    this.line.animateTo(
      {
        style: this.style.line.select,
      },
      animateConfig
    );
  }

  onCreate() {
    this.sourceNode.addLine(this);
    this.targetNode.addLine(this);
  }

  constructor({ x1, y1, x2, y2, info, id, source, target }) {
    this.id = id;
    this.source = source;
    this.target = target;
    this.sourceNode = ligandMap.get(source);
    this.targetNode = ligandMap.get(target);
    this.el = new Group();
    this.textGroup = new Group();
    this.line = new ZrLine({
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
    this.el.add(this.line);
    this.el.add(this.textGroup);
    this.onCreate();

    this.el.on("mouseover", (params) => mouseOverHandler("line", params, this));
    this.el.on("mouseout", (params) => mouseOutHandler("line", params, this));
    this.el.on("click", (params) => clickHandler("line", params, this));
  }
}

export class Ligand {
  id = "";
  el = null;
  img = null;
  rect = null;
  lineMap = new Map();
  selected = false;

  style = {
    rect: {
      normal: { opacity: 1, stroke: "#000" },
      focus: {
        stroke: "#ff0",
      },
      blur: {
        opacity: 0.1,
      },
      select: {
        stroke: "#f00",
      },
      add: {},
    },
    img: {
      normal: { shadowBlur: 0, opacity: 1 },
      focus: {
        shadowBlur: 20,
        shadowColor: "#ff0",
      },
      blur: {
        opacity: 0.1,
        shadowBlur: 0,
      },
      select: {
        shadowBlur: 20,
        shadowColor: "#f00",
      },
      add: {},
    },
  };

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
    this.img.animateTo(
      {
        scale: [focusScale, focusScale],
      },
      animateConfig
    );
    this.rect.animateTo(
      {
        scale: [focusScale, focusScale],
      },
      animateConfig
    );
  }
  toNormal(cancleSelect) {
    if (cancleSelect) this.selected = false;
    this.rect.animateTo(
      {
        style: this.selected ? { opacity: 1 } : this.style.rect.normal,
      },
      animateConfig
    );
    this.img.animateTo(
      {
        style: this.selected ? { opacity: 1 } : this.style.img.normal,
      },
      animateConfig
    );
  }
  toFocus() {
    this.rect.animateTo(
      {
        style: this.style.rect.focus,
      },
      animateConfig
    );
    this.img.animateTo(
      {
        style: this.style.img.focus,
      },
      animateConfig
    );
  }
  toBlur() {
    this.rect.animateTo(
      {
        style: this.style.rect.blur,
      },
      animateConfig
    );
    this.img.animateTo(
      {
        style: this.style.img.blur,
      },
      animateConfig
    );
  }
  toSelect(idx) {
    this.selected = true;
    this.rect.animateTo(
      {
        style: this.style.rect.select,
      },
      animateConfig
    );
    this.img.animateTo(
      {
        style: this.style.img.select,
      },
      animateConfig
    );
  }
  toAdd() {
    this.rect.animateTo(
      {
        style: this.style.rect.add,
      },
      animateConfig
    );
    this.img.animateTo(
      {
        style: this.style.img.add,
      },
      animateConfig
    );
  }

  addLine(line) {
    this.lineMap.set(line.id, line);
  }

  constructor({ x, y, img = imgData, id }) {
    this.el = new Group();
    this.id = id;
    this.img = new ZrImage({
      origin: [x + 50, y + 50],
      style: {
        image: img,
        x,
        y,
        width: ligandWidth,
        height: ligandWidth,
      },
    });
    this.rect = new Rect({
      origin: [x + 50, y + 50],
      style: {
        fill: "rgba(0,0,0,0)",
        stroke: "#000",
      },
      shape: {
        x,
        y,
        width: ligandWidth,
        height: ligandWidth,
      },
    });

    this.el.add(this.img);
    this.el.add(this.rect);
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
