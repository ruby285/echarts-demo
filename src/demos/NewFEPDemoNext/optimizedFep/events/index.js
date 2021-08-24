import emitter from "./emitter";
import EventsHandler from "./handler";

class Events {
  onClick(el, ev) {
    switch (el.type) {
      case "ligand":
        this.handler.onLigandClick(el);
        break;
      case "edge":
        this.handler.onEdgeClick(el);
        break;
      case "deleteLigand":
        ev.cancelBubble = true;
        this.handler.onDeleteLigandClick(el.ligand);
        break;
      case "addEdge":
        ev.cancelBubble = true;
        this.handler.onAddEdgeClick(el.edge);
        break;
      case "deleteEdge":
        ev.cancelBubble = true;
        this.handler.onDeleteEdgeClick(el.edge);
        break;
      case "calculation":
        ev.cancelBubble = true;
        this.handler.onAddCalculationClick(el.edge);
        break;
    }
  }
  onMouseover(el) {
    switch (el.type) {
      case "ligand":
        this.handler.onLigandMouseOver(el);
        break;
      case "edge":
        this.handler.onEdgeMouseOver(el);
        break;
    }
  }
  onMouseout(el) {
    this.handler.onMouseOut(el);
  }
  onDblclick(ev) {
    this.handler.onDblclick(ev);
  }
  constructor(ctx) {
    this.ctx = ctx;
    this.handler = new EventsHandler(ctx);
    ctx.renderer.on("dblclick", (...args) => this.onDblclick(...args));
    emitter.on("click", (...args) => this.onClick(...args));
    emitter.on("mouseover", (...args) => this.onMouseover(...args));
    emitter.on("mouseout", (...args) => this.onMouseout(...args));
    emitter.on("addVirtualEdge", (...args) =>
      this.handler.onAddVirtualEdge(...args)
    );
    emitter.on("deleteEdge", (...args) =>
      this.handler.onDeleteEdgeClick(...args)
    );
  }
}

export default Events;
