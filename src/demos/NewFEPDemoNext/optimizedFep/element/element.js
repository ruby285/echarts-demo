import { Group } from "zrender";
import { ArrSet } from "../helper";

export default class Element {
  el = new Group();
  subElements = new ArrSet();
  state = {
    virtual: false,
    selected: false,
    hover: false,
    relatedHover: false,
    firstAdd: false,
  };
  onHover() {
    this.toScaleX();
    this.state.hover = true;
    this.updateStyle();
  }
  onHoverEnd() {
    this.toScale1();
    this.state.hover = false;
    this.updateStyle();
  }
  onRelatedHover() {
    this.state.relatedHover = true;
    this.updateStyle();
  }
  onRelatedHoverEnd() {
    this.state.relatedHover = false;
    this.updateStyle();
  }
  onSelected() {
    this.el.children().forEach((item) => {
      item.attr({
        z: 100,
      });
    });
    this.state.selected = true;
    this.updateStyle();
  }
  onSelectedEnd() {
    this.el.children().forEach((item) => {
      item.attr({
        z: 0,
      });
    });
    this.state.selected = false;
    this.updateStyle();
  }
  onFirstAdd() {
    this.state.firstAdd = true;
    this.updateStyle();
  }
  onFirstAddEnd() {
    this.state.firstAdd = false;
    this.updateStyle();
  }

  updateStyle() {
    const stateList = [
      "virtual",
      "selected",
      "hover",
      "relatedHover",
      "firstAdd",
    ];
    let state = "default";
    stateList.some((s) => {
      if (this.state[s]) {
        state = s;
        return true;
      }
      return false;
    });
    this.subElements.forEach((element) => element.updateStyle(state));
  }

  toScale1() {
    this.subElements.forEach((element) => element.toScale1());
  }

  toScaleX() {
    this.subElements.forEach((element) => element.toScaleX());
  }

  fadeout() {
    this.subElements.forEach((element) => element.fadeout());
  }

  fadein() {
    this.subElements.forEach((element) => element.fadein());
  }
}
