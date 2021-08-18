import { Group, Image as ZrImage, Rect, Line as ZrLine } from "zrender";
import imgData from "./ligand.png";

const ligandWidth = 100;

export class Line {
  el = null;
  constructor({ x1, y1, x2, y2 }) {
    this.el = new ZrLine({
      shape: {
        x1,
        y1,
        x2,
        y2,
      },
    });
  }
}

export class Ligand {
  el = null;
  img = null;
  rect = null;
  constructor({ x, y, img = imgData }) {
    this.el = new Group();
    this.img = new ZrImage({
      style: {
        image: img,
        x,
        y,
        width: ligandWidth,
        height: ligandWidth,
      },
    });
    this.rect = new Rect({
      style: {
        fill: null,
        stroke: "#f00",
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
  }
}
