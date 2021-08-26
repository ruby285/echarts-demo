import { Line as ZrLine } from "zrender";
import { EdgeSubElement } from "./subElement";
import { EDGE_LINE_STYLE } from "../../constant";

class EdgeLineElement extends EdgeSubElement {
  type = "edgeLine";
  el = new ZrLine();

  style = {
    virtual: {
      stroke: EDGE_LINE_STYLE.VIRTUAL.STROKE,
    },
    selected: {
      stroke: EDGE_LINE_STYLE.SELECTED.STROKE,
    },
    hover: {
      stroke: EDGE_LINE_STYLE.HOVER.STROKE,
    },
    relatedHover: {
      stroke: EDGE_LINE_STYLE.RELATEDHOVER.STROKE,
    },
    default: {
      stroke: EDGE_LINE_STYLE.DEFAULT.STROKE,
    },
  };

  draw({ x1, y1, x2, y2, virtual }) {
    const style = {
      lineWidth: EDGE_LINE_STYLE.INITIAL.LINEWIDTH,
    };
    if (virtual) {
      style.lineDash = EDGE_LINE_STYLE.INITIAL.LINEDASH;
    }
    this.el.attr({
      style,
      shape: {
        x1,
        y1,
        x2,
        y2,
      },
    });
  }
}

export default EdgeLineElement;
