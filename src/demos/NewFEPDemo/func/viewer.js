import {
  Group,
  Image as ZrImage,
  Rect,
  Line as ZrLine,
  Text as ZrText,
} from "zrender";
import imgData from "./ligand.png";
import { getTextPosition } from "./util";

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
const mouseOverHandler = (type, params, ins) => {
  console.log("mouseOverHandler", type);
  console.log("mouseOverHandler", params);
  console.log("mouseOverHandler", ins);
  ins.toFocus();
};
const mouseOutHandler = (type, params, ins) => {
  ins.toNormal();
};
const clickHandler = (type, params, ins) => {
  ins.toSelect();
};

export class Line {
  el = null;
  line = null;
  textGroup = null;

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

  toNormal() {
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
    this.line.animateTo(
      {
        style: this.style.line.select,
      },
      animateConfig
    );
  }
  constructor({ x1, y1, x2, y2, info }) {
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

    this.el.on("mouseover", (params) => mouseOverHandler("line", params, this));
    this.el.on("mouseout", (params) => mouseOutHandler("line", params, this));
    this.el.on("click", (params) => clickHandler("line", params, this));
  }
}

export class Ligand {
  el = null;
  img = null;
  rect = null;

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

  opts = {
    rect: {
      normal: {
        scale: [1, 1],
      },
      focus: {
        scale: [focusScale, focusScale],
      },
      blur: {
        scale: [1, 1],
        opacity: 0.1,
      },
      select: {
        scale: [focusScale, focusScale],
      },
      add: {},
    },
    img: {
      normal: {
        scale: [1, 1],
      },
      focus: {
        scale: [focusScale, focusScale],
      },
      blur: {
        scale: [1, 1],
        opacity: 0.1,
      },
      select: {
        scale: [focusScale, focusScale],
      },
      add: {},
    },
  };

  toNormal() {
    this.rect.animateTo(
      {
        ...this.opts.rect.normal,
        style: this.style.rect.normal,
      },
      animateConfig
    );
    this.img.animateTo(
      {
        ...this.opts.img.normal,
        style: this.style.img.normal,
      },
      animateConfig
    );
  }
  toFocus() {
    this.rect.animateTo(
      {
        ...this.opts.rect.focus,
        style: this.style.rect.focus,
      },
      animateConfig
    );
    this.img.animateTo(
      {
        ...this.opts.img.focus,
        style: this.style.img.focus,
      },
      animateConfig
    );
  }
  toBlur() {
    this.rect.animateTo(
      {
        ...this.opts.rect.blur,
        style: this.style.rect.blur,
      },
      animateConfig
    );
    this.img.animateTo(
      {
        ...this.opts.img.blur,
        style: this.style.img.blur,
      },
      animateConfig
    );
  }
  toSelect() {
    this.rect.animateTo(
      {
        ...this.opts.rect.select,
        style: this.style.rect.select,
      },
      animateConfig
    );
    this.img.animateTo(
      {
        ...this.opts.img.select,
        style: this.style.img.select,
      },
      animateConfig
    );
  }
  toAdd() {
    this.rect.animateTo(
      {
        ...this.opts.rect.add,
        style: this.style.rect.add,
      },
      animateConfig
    );
    this.img.animateTo(
      {
        ...this.opts.img.add,
        style: this.style.img.add,
      },
      animateConfig
    );
  }

  constructor({ x, y, img = imgData }) {
    this.el = new Group();
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
