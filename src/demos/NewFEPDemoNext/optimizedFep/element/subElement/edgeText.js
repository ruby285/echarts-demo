import { Text as ZrText } from "zrender";
import { EdgeSubElement } from "./subElement";
import { EDGE_TEXT_STYLE } from "../../constant";

class EdgeTextElement extends EdgeSubElement {
  type = "edgeText";
  el = new ZrText();

  style = {
    virtual: {
      rich: {
        line1: {
          fill: EDGE_TEXT_STYLE.VIRTUAL.Fill,
        },
        line2: {
          fill: EDGE_TEXT_STYLE.VIRTUAL.Fill,
        },
        line3: {
          fill: EDGE_TEXT_STYLE.VIRTUAL.Fill,
        },
      },
    },
    selected: {
      rich: {
        line1: {
          fill: EDGE_TEXT_STYLE.SELECTED.Fill,
        },
        line2: {
          fill: EDGE_TEXT_STYLE.SELECTED.Fill,
        },
        line3: {
          fill: EDGE_TEXT_STYLE.SELECTED.Fill,
        },
      },
    },
    hover: {
      rich: {
        line1: {
          fill: EDGE_TEXT_STYLE.HOVER.Fill,
        },
        line2: {
          fill: EDGE_TEXT_STYLE.HOVER.Fill,
        },
        line3: {
          fill: EDGE_TEXT_STYLE.HOVER.Fill,
        },
      },
    },
    relatedHover: {
      rich: {
        line1: {
          fill: EDGE_TEXT_STYLE.RELATEDHOVER.Fill1,
        },
        line2: {
          fill: EDGE_TEXT_STYLE.RELATEDHOVER.Fill2,
        },
        line3: {
          fill: EDGE_TEXT_STYLE.RELATEDHOVER.Fill3,
        },
      },
    },
    default: {
      rich: {
        line1: {
          fill: EDGE_TEXT_STYLE.DEFAULT.Fill1,
        },
        line2: {
          fill: EDGE_TEXT_STYLE.DEFAULT.Fill2,
        },
        line3: {
          fill: EDGE_TEXT_STYLE.DEFAULT.Fill3,
        },
      },
    },
  };

  draw({ x, y, rotation, info }) {
    this.el.attr({
      x,
      y,
      rotation,
      style: {
        text: info.map((item, i) => `{line${i + 1}|${item}}`).join("\n"),
        align: EDGE_TEXT_STYLE.INITIAL.ALIGN,
      },
    });
  }
}

export default EdgeTextElement;
