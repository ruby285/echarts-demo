import { Text as ZrText } from "zrender";
import { LigandSubElement } from "./subElement";
import { ELEMENT_Z2 } from "../../constant";

class LigandOrderElement extends LigandSubElement {
  type = "ligandRect";

  updateStyle() {}

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
