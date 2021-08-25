import { Text as ZrText } from "zrender";
import SubElement from "./subElement";
import {
  LIGAND_WIDTH,
  ELEMENT_Z2,
  SCALE_X,
  SCALE_1,
  ANIMATE_CONFIG,
} from "../../constant";

class LigandOrderElement extends SubElement {
  type = "ligandRect";

  style = {};

  updateStyle() {}

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
  moveTo({ x, y }) {
    this.el.attr({
      origin: [45, 45],
      x: x + 5,
      y: y + 5,
    });
  }
  updateIdx(idx) {
    this.el.attr({
      style: {
        text: `{a|${idx}}`,
      },
    });
  }
  constructor({ idx, x, y }) {
    super();
    this.el = new ZrText({
      style: {
        text: `{a|${idx}}`,
        rich: {
          a: {
            fill: "#fff",
            lineHeight: 12,
            fontSize: 12,
            fontWeight: 600,
            align: "center",
            backgroundColor: "blue",
            width: 14,
            height: 14,
            borderRadius: 7,
          },
        },
      },
      z2: ELEMENT_Z2,
    });

    this.moveTo({ x, y });
  }
}

export default LigandOrderElement;
