import {
  FADEOUT_OPACITY,
  NORMAL_OPACITY,
  ANIMATE_CONFIG,
  SCALE_X,
  SCALE_1,
} from "../../constant";

class SubElement {
  el = null;
  style = {};
  fadeout() {
    this.el.animateTo(
      {
        style: {
          opacity: FADEOUT_OPACITY,
        },
      },
      ANIMATE_CONFIG
    );
  }
  fadein() {
    this.el.animateTo(
      {
        style: {
          opacity: NORMAL_OPACITY,
        },
      },
      ANIMATE_CONFIG
    );
  }
  updateStyle(state = "default") {
    const style = this.style[state];
    this.el.animateTo(
      {
        style,
      },
      ANIMATE_CONFIG
    );
  }
}

export class LigandSubElement extends SubElement {
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
  moveTo() {}
}

export class EdgeSubElement extends SubElement {
  toScale1() {}
  toScaleX() {}
  draw() {}
}
