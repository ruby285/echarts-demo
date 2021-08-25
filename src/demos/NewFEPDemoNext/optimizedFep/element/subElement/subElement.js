import {
  FADEOUT_OPACITY,
  NORMAL_OPACITY,
  ANIMATE_CONFIG,
} from "../../constant";

class SubElement {
  el = null;
  style = {};
  fadeout() {
    this.el.animateTo(
      {
        opacity: FADEOUT_OPACITY,
      },
      ANIMATE_CONFIG
    );
  }
  fadein() {
    this.el.animateTo(
      {
        opacity: NORMAL_OPACITY,
      },
      ANIMATE_CONFIG
    );
  }
  toScale1() {}
  toScaleX() {}
  moveTo() {}
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

export default SubElement;
