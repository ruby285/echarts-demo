import {
  Selector,
  hoverLigand,
  hoverEdge,
  relatedHoverLigand,
  relatedHoverEdge,
  fateoutLigand,
  fadeoutEdge,
} from "./collection";

const forEachSet = (set, callback) => Array.from(set).forEach(callback);

class EventsHandler {
  hoverEl = null;

  onDblclick(ev) {
    console.log("onDblclick", ev.target);
  }

  onMouseOver(el) {
    this.hoverEl = el;
    forEachSet(hoverLigand, (ligand) => ligand.onHover());
    forEachSet(fateoutLigand, (ligand) => ligand.fadeout());
    forEachSet(relatedHoverLigand, (ligand) => ligand.onRelatedHover());
    forEachSet(hoverEdge, (edge) => edge.onHover());
    forEachSet(fadeoutEdge, (edge) => edge.fadeout());
    forEachSet(relatedHoverEdge, (edge) => edge.onRelatedHover());
  }

  onMouseOut() {
    this.hoverEl = null;
    forEachSet(hoverLigand, (ligand) => ligand.onHoverEnd());
    forEachSet(fateoutLigand, (ligand) => ligand.fadein());
    forEachSet(relatedHoverLigand, (ligand) => ligand.onRelatedHoverEnd());
    forEachSet(hoverEdge, (edge) => edge.onHoverEnd());
    forEachSet(fadeoutEdge, (edge) => edge.fadein());
    forEachSet(relatedHoverEdge, (edge) => edge.onRelatedHoverEnd());
    hoverLigand.clear();
    fateoutLigand.clear();
    relatedHoverLigand.clear();
    hoverEdge.clear();
    fadeoutEdge.clear();
    relatedHoverEdge.clear();
  }

  onLigandMouseOver(ligand) {
    if (this.hoverEl === ligand) return;
    if (ligand.selected) return;
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
    if (!edge.isVirtual) {
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
