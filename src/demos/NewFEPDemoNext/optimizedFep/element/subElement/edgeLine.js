import { Line as ZrLine } from "zrender";
import SubElement from "./subElement";
import {
  LIGAND_WIDTH,
  ELEMENT_Z2,
  SCALE_X,
  SCALE_1,
  ANIMATE_CONFIG,
} from "../../constant";

class EdgeLineElement extends SubElement {
  type = "edgeLine";
  el = new ZrLine();

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
    default: {
      fill: "rgba(0,0,0,0)",
      stroke: "#000",
    },
  };

  updateStyle(state) {
    const style = this.style[state];
    this.el.animateTo(
      {
        style,
      },
      ANIMATE_CONFIG
    );
  }

  toScale1() {
    // this.el.animateTo(
    //   {
    //     scale: SCALE_1,
    //   },
    //   ANIMATE_CONFIG
    // );
  }
  toScaleX() {
    // this.el.animateTo(
    //   {
    //     scale: SCALE_X,
    //   },
    //   ANIMATE_CONFIG
    // );
  }

  draw({ x1, y1, x2, y2, isVirtual }) {
    const style = isVirtual
      ? {
          lineDash: [2, 6],
        }
      : {};
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
