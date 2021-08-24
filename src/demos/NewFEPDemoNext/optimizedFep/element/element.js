export default class Element {
  state = {
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
    const { selected, hover, relatedHover, firstAdd } = this.state;
    if (selected) {
      return this._updateStyle(this.style.selected);
    }
    if (hover) {
      return this._updateStyle(this.style.hover);
    }
    if (relatedHover) {
      return this._updateStyle(this.style.relatedHover);
    }
    if (firstAdd) {
      return this._updateStyle(this.style.firstAdd);
    }
    return this._updateStyle(this.style.default);
  }
}
