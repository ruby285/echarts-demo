import { Image as ZrImage } from "zrender";
import { LigandSubElement } from "./subElement";
import { LIGAND_WIDTH, ELEMENT_Z2 } from "../../constant";

class LigandImageElement extends LigandSubElement {
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
