import { Text as ZrText } from "zrender";
import { LigandSubElement } from "./subElement";
import { LIGAND_ORDER_STYLE, SCALE_X } from "../../constant";

class LigandOrderElement extends LigandSubElement {
  type = "ligandRect";

  updateStyle() {}

  moveTo({ x, y }) {
    this.el.attr({
      origin: LIGAND_ORDER_STYLE.POSITION.ORIGIN,
      x: x + LIGAND_ORDER_STYLE.POSITION.OFFSET,
      y: y + LIGAND_ORDER_STYLE.POSITION.OFFSET,
    });
  }
  updateIdx(idx) {
    this.el.attr({
      style: {
        text: `{order|${idx}}`,
      },
    });
  }
  constructor({ idx, x, y, hover }) {
    super();
    this.el = new ZrText({
      style: {
        text: `{order|${idx}}`,
        rich: {
          order: {
            fill: LIGAND_ORDER_STYLE.INITIAL.FILL,
            fontWeight: LIGAND_ORDER_STYLE.INITIAL.FONTWEIGHT,
            align: LIGAND_ORDER_STYLE.INITIAL.ALIGN,
            backgroundColor: LIGAND_ORDER_STYLE.INITIAL.BACKGROUNDCOLOR,
            width: LIGAND_ORDER_STYLE.INITIAL.WIDTH,
            height: LIGAND_ORDER_STYLE.INITIAL.HEIGHT,
            borderRadius: LIGAND_ORDER_STYLE.INITIAL.BORDERRADIUS,
          },
        },
      },
      z2: LIGAND_ORDER_STYLE.INITIAL.ZLEVEL_THIRD,
    });
    if (hover) {
      this.el.attr({
        scale: SCALE_X.slice(),
      });
    }
    this.moveTo({ x, y });
  }
}

export default LigandOrderElement;
