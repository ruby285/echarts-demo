import { Path } from "zrender";
import SubElement from "./subElement";
import {
  LIGAND_WIDTH,
  ELEMENT_Z2,
  SCALE_X,
  SCALE_1,
  ANIMATE_CONFIG,
} from "../../constant";

const Arrow = Path.extend({
  type: "arrow",

  shape: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },

  buildPath: function (ctx, shape) {
    const height = shape.height;
    const width = shape.width;
    const x = shape.x;
    const y = shape.y;
    const dx = (width / 3) * 2;
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + height);
    ctx.lineTo(x, y + (height / 4) * 3);
    ctx.lineTo(x - dx, y + height);
    ctx.lineTo(x, y);
    ctx.closePath();
  },
});

class EdgeArrowElement extends SubElement {
  type = "edgeArrow";
  el = new Arrow();

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

  draw({ x1, y1, rotation }) {
    this.el.attr({
      rotation: rotation - Math.PI * 1.5,
      origin: [x1, y1],
      shape: {
        x: x1,
        y: y1,
        width: 10,
        height: 10,
      },
    });
  }
}

export default EdgeArrowElement;
