import { Text as ZrText } from "zrender";
import { EdgeSubElement } from "./subElement";
import { LIGAND_WIDTH } from "../../constant";

class EdgeTextElement extends EdgeSubElement {
  type = "edgeText";
  el = new ZrText();

  style = {
    selected: {
      backgroundColor: "#f00",
    },
    hover: {
      backgroundColor: "#ff0",
    },
    relatedHover: {
      backgroundColor: "#fff",
    },
    default: {
      backgroundColor: "#fff",
    },
  };

  draw({ x, y, rotation, info }) {
    this.el.attr({
      x,
      y,
      rotation,
      style: {
        text: info.map((item, i) => `{a${i + 1}|${item}}`).join("\n"),
        align: "center",
        rich: {
          a1: {
            fill: "red",
          },
          a2: {
            fill: "green",
          },
          a3: {
            fill: "blue",
          },
        },
      },
    });
  }
}

export default EdgeTextElement;
