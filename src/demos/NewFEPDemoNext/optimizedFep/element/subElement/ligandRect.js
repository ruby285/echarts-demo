import { Rect } from "zrender";
import { LigandSubElement } from "./subElement";
import { LIGAND_RECT_STYLE } from "../../constant";

class LigandRectElement extends LigandSubElement {
  type = "ligandRect";
  el = new Rect({
    shape: {
      r: LIGAND_RECT_STYLE.INITIAL.RADIUS,
      width: LIGAND_RECT_STYLE.INITIAL.WIDTH,
      height: LIGAND_RECT_STYLE.INITIAL.HEIGHT,
    },
    z2: LIGAND_RECT_STYLE.INITIAL.ZLEVEL_THIRD,
  });

  style = {
    selected: {
      stroke: LIGAND_RECT_STYLE.SELECTED.STROKE,
    },
    hover: {
      stroke: LIGAND_RECT_STYLE.HOVER.STROKE,
    },
    relatedHover: {
      stroke: LIGAND_RECT_STYLE.RELATEDHOVER.STROKE,
    },
    firstAdd: {
      stroke: LIGAND_RECT_STYLE.FIRSTADD.STROKE,
    },
    default: {
      fill: LIGAND_RECT_STYLE.DEFAULT.FILL,
      stroke: LIGAND_RECT_STYLE.DEFAULT.STROKE,
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
