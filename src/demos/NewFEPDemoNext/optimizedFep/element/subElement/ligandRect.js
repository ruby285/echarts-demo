import { Rect } from "zrender";
import { LigandSubElement } from "./subElement";
import {
  LIGAND_WIDTH,
  ELEMENT_Z2,
  SCALE_X,
  SCALE_1,
  ANIMATE_CONFIG,
} from "../../constant";

class LigandRectElement extends LigandSubElement {
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
