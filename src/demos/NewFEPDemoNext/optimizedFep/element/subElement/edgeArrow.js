import { Path } from "zrender";
import { EdgeSubElement } from "./subElement";
import { EDGE_ARROW_STYLE } from "../../constant";

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

class EdgeArrowElement extends EdgeSubElement {
  type = "edgeArrow";
  el = new Arrow({
    shape: {
      width: EDGE_ARROW_STYLE.INITIAL.WIDTH,
      height: EDGE_ARROW_STYLE.INITIAL.HEIGHT,
    },
  });

  style = {
    virtual: {
      fill: EDGE_ARROW_STYLE.VIRTUAL.FILL,
    },
    selected: {
      fill: EDGE_ARROW_STYLE.SELECTED.FILL,
    },
    hover: {
      fill: EDGE_ARROW_STYLE.HOVER.FILL,
    },
    relatedHover: {
      fill: EDGE_ARROW_STYLE.RELATEDHOVER.FILL,
    },
    default: {
      fill: EDGE_ARROW_STYLE.DEFAULT.FILL,
    },
  };

  draw({ x1, y1, rotation }) {
    this.el.attr({
      rotation: rotation - Math.PI * 1.5,
      origin: [x1, y1],
      shape: {
        x: x1,
        y: y1,
      },
    });
  }
}

export default EdgeArrowElement;
