import { Image as ZrImage } from "zrender";
import { LigandSubElement } from "./subElement";
import { LIGAND_IMAGE_STYLE } from "../../constant";

class LigandImageElement extends LigandSubElement {
  type = "ligandImage";

  style = {
    selected: {
      shadowColor: LIGAND_IMAGE_STYLE.SELECTED.SHADOWCOLOR,
      shadowBlur: LIGAND_IMAGE_STYLE.SELECTED.SHADOWBLUR,
    },
    hover: {
      shadowColor: LIGAND_IMAGE_STYLE.HOVER.SHADOWCOLOR,
      shadowBlur: LIGAND_IMAGE_STYLE.HOVER.SHADOWBLUR,
    },
    relatedHover: {
      shadowBlur: LIGAND_IMAGE_STYLE.RELATEDHOVER.SHADOWBLUR,
    },
    firstAdd: {
      shadowColor: LIGAND_IMAGE_STYLE.FIRSTADD.SHADOWCOLOR,
      shadowBlur: LIGAND_IMAGE_STYLE.FIRSTADD.SHADOWBLUR,
    },
    default: {
      shadowBlur: LIGAND_IMAGE_STYLE.DEFAULT.SHADOWBLUR,
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
        width: LIGAND_IMAGE_STYLE.INITIAL.WIDTH,
        height: LIGAND_IMAGE_STYLE.INITIAL.HEIGHT,
      },
      z2: LIGAND_IMAGE_STYLE.INITIAL.ZLEVEL_THIRD,
    });
  }
}

export default LigandImageElement;
