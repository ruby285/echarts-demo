import {
  Selector,
  hoverLigand,
  hoverEdge,
  relatedHoverLigand,
  relatedHoverEdge,
  fateoutLigand,
  fadeoutEdge,
} from "./collection";

class EventsHandler {
  hoverEl = null;

  onDblclick(ev) {
    if (ev.target) return;
    this.selector.clear();
  }

  onMouseDown(ev) {
    if (ev.target) return;
    const room = this.ctx.room;
    let { pageX: startX, pageY: startY } = ev.event;
    const mousemove = (ev) => {
      const { pageX: endX, pageY: endY } = ev;
      const disX = startX - endX;
      const disY = startY - endY;
      room.move(disX, disY);
      startX = endX;
      startY = endY;
    };
    const mouseup = (ev) => {
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    };
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  }

  onMouseWheel(ev) {
    const { event, wheelDelta } = ev;
    const room = this.ctx.room;
    event.preventDefault();

    if (wheelDelta > 0) {
      room.zoomIn(wheelDelta);
    } else {
      room.zoomOut(wheelDelta);
    }
  }

  onMouseOver(el) {
    this.hoverEl = el;
    hoverLigand.forEach((ligand) => ligand.onHover());
    fateoutLigand.forEach((ligand) => ligand.fadeout());
    relatedHoverLigand.forEach((ligand) => ligand.onRelatedHover());
    hoverEdge.forEach((edge) => edge.onHover());
    fadeoutEdge.forEach((edge) => edge.fadeout());
    relatedHoverEdge.forEach((edge) => edge.onRelatedHover());
  }

  onMouseOut() {
    this.hoverEl = null;
    hoverLigand.forEach((ligand) => ligand.onHoverEnd());
    fateoutLigand.forEach((ligand) => ligand.fadein());
    relatedHoverLigand.forEach((ligand) => ligand.onRelatedHoverEnd());
    hoverEdge.forEach((edge) => edge.onHoverEnd());
    fadeoutEdge.forEach((edge) => edge.fadein());
    relatedHoverEdge.forEach((edge) => edge.onRelatedHoverEnd());
    hoverLigand.clear();
    fateoutLigand.clear();
    relatedHoverLigand.clear();
    hoverEdge.clear();
    fadeoutEdge.clear();
    relatedHoverEdge.clear();
  }

  onLigandMouseOver(ligand) {
    if (this.hoverEl === ligand) return;
    if (ligand.state.firstAdd) {
      ligand.state.firstAdd = false;
    }
    hoverLigand.add(ligand);
    this.ligandGroup.forEach((item) => {
      if (ligand === item) return;
      fateoutLigand.add(item);
    });
    this.edgeGroup.forEach((edge, id) => {
      if (ligand.edgeMap.has(id)) {
        fateoutLigand.delete(edge.sourceLigand);
        fateoutLigand.delete(edge.targetLigand);
        relatedHoverLigand.add(edge.sourceLigand);
        relatedHoverLigand.add(edge.targetLigand);
        relatedHoverEdge.add(edge);
      } else {
        fadeoutEdge.add(edge);
      }
    });
    this.onMouseOver(ligand);
  }

  onEdgeMouseOver(edge) {
    if (this.hoverEl === edge) return;
    if (edge.selected) return;
    hoverEdge.add(edge);
    this.ligandGroup.forEach((item) => {
      if (item === edge.sourceLigand || item === edge.targetLigand) {
        relatedHoverLigand.add(item);
      } else {
        fateoutLigand.add(item);
      }
    });
    this.edgeGroup.forEach((item) => {
      if (edge === item) return;
      fadeoutEdge.add(item);
    });
    this.onMouseOver(edge);
  }

  onLigandClick(ligand) {
    if (ligand.state.selected) {
      return this.selector.delete(ligand);
    }
    return this.selector.add(ligand);
  }

  onEdgeClick(edge) {
    const { sourceLigand, targetLigand, id } = edge;
    this.selector.replaceByEdge(sourceLigand, targetLigand, id);
  }

  onDeleteLigandClick(ligand) {
    const ctx = this.ctx;
    this.selector.delete(ligand);
    for (let [, edge] of ligand.edgeMap) {
      const edgeProps = ctx.edgeGroup.delete(edge);
      ctx.layout.deleteEdge(edgeProps);
    }
    const ligandProps = ctx.ligandGroup.delete(ligand);
    ctx.layout.deleteLigand(ligandProps);
    this.onMouseOut();
    ctx.layout.reRun();
  }

  onAddVirtualEdge(props) {
    const ctx = this.ctx;
    const edge = ctx.edgeGroup.add(props);
    ctx.layout.addEdge(props);
    ctx.layout.reRun();
    return edge;
  }

  onAddEdgeClick(edge) {
    edge.toRealistic();
  }

  onDeleteEdgeClick(edge) {
    const ctx = this.ctx;
    if (!edge.state.virtual) {
      this.selector.clear();
    }
    const edgeProps = ctx.edgeGroup.delete(edge);
    ctx.layout.deleteEdge(edgeProps);
    this.onMouseOut();
    ctx.layout.reRun();
  }

  onAddCalculationClick(edge) {
    console.log("AddCalculation", edge);
  }

  constructor(ctx) {
    const { ligandGroup, edgeGroup } = ctx;
    this.ctx = ctx;
    this.ligandGroup = ligandGroup;
    this.edgeGroup = edgeGroup;
    this.selector = new Selector(ligandGroup.map, edgeGroup.map);
  }
}

export default EventsHandler;
