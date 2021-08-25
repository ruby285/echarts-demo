import { Rect } from "zrender";
import SubElement from "./subElement";
import {
  LIGAND_WIDTH,
  ELEMENT_Z2,
  SCALE_X,
  SCALE_1,
  ANIMATE_CONFIG,
} from "../../constant";

class LigandRectElement extends SubElement {
  type = "ligandRect";
  el = new Rect({
    shape: {
      width: LIGAND_WIDTH,
      height: LIGAND_WIDTH,
    },
    z2: ELEMENT_Z2,
  });

  style = {
    selected: {
      stroke: "#f00",
    },
    hover: {
      stroke: "#ff0",
    },
    relatedHover: {
      stroke: "#000",
    },
    firstAdd: {
      stroke: "#f0f",
    },
    default: {
      fill: "rgba(0,0,0,0)",
      stroke: "#000",
    },
  };

  toScale1() {
    this.el.animateTo(
      {
        scale: SCALE_1,
      },
      ANIMATE_CONFIG
    );
  }
  toScaleX() {
    this.el.animateTo(
      {
        scale: SCALE_X,
      },
      ANIMATE_CONFIG
    );
  }
  moveTo({ x, y, originX, originY }) {
    this.el.attr({
      origin: [originX, originY],
      shape: {
        x,
        y,
      },
    });
  }
}

export default LigandRectElement;
