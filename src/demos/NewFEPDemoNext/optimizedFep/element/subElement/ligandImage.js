import { Image as ZrImage } from "zrender";
import SubElement from "./subElement";
import {
  LIGAND_WIDTH,
  ELEMENT_Z2,
  SCALE_X,
  SCALE_1,
  ANIMATE_CONFIG,
} from "../../constant";

class LigandImageElement extends SubElement {
  type = "ligandImage";

  style = {
    selected: {
      shadowColor: "#f00",
      shadowBlur: 20,
    },
    hover: {
      shadowColor: "#ff0",
      shadowBlur: 20,
    },
    relatedHover: {
      shadowBlur: 0,
    },
    firstAdd: {
      shadowColor: "#f0f",
      shadowBlur: 20,
    },
    default: {
      shadowBlur: 0,
    },
  };

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
  moveTo({ x, y, originX, originY }) {
    this.el.attr({
      origin: [originX, originY],
      style: {
        x,
        y,
      },
    });
  }

  constructor(img) {
    super();
    this.el = new ZrImage({
      opacity: 1,
      style: {
        image: img,
        width: LIGAND_WIDTH,
        height: LIGAND_WIDTH,
      },
      z2: ELEMENT_Z2,
    });
  }
}

export default LigandImageElement;
