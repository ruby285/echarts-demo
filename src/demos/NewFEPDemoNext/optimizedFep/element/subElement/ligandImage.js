import { Image as ZrImage } from "zrender";
import { LigandSubElement } from "./subElement";
import { LIGAND_IMAGE_STYLE } from "../../constant";

class LigandImageElement extends LigandSubElement {
  type = "ligandImage";

  style = {
    selected: {},
    hover: {},
    relatedHover: {},
    firstAdd: {},
    default: {},
  };

  moveTo({ x, y, originX, originY }) {
    this.el.attr({
      origin: [originX, originY],
      style: {
        x: x + LIGAND_IMAGE_STYLE.POSITION.OFFSET,
        y: y + LIGAND_IMAGE_STYLE.POSITION.OFFSET,
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
