import emitter from "./emitter";

class Events {
  onClick(el, ev) {
    console.log("onClick", el, ev);
  }
  onMouseover(el, ev) {
    console.log("onMouseover", el, ev);
  }
  onMouseout(el, ev) {
    console.log("onMouseout", el, ev);
  }
  onDblclick() {}
  constructor(renderer) {
    this.renderer = renderer;
    renderer.on("dblclick", () => {
      console.log("dblclick");
    });

    emitter.on("click", (...args) => this.onClick(...args));
    emitter.on("mouseover", (...args) => this.onMouseover(...args));
    emitter.on("mouseout", (...args) => this.onMouseout(...args));
  }
}

export default Events;
