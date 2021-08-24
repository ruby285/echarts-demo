import { Group } from "zrender";
import { Ligand, Edge } from "./element";
import imgData from "./ligand.png";

export const ligandMap = new Map();
export const edgeMap = new Map();

export class ligandGroup {
  group = new Group();
  map = ligandMap;
  acSize = 0;
  add(props) {
    const ligand = new Ligand({ ...props, img: imgData });
    ligandMap.set(props.id, ligand);
    this.group.add(ligand.el);
    this.acSize++;
  }
  delete(ligand) {
    const { id } = ligand;
    ligandMap.delete(id);
    this.group.remove(ligand.el);
    return { id };
  }
  forEach(cb) {
    if (!cb) return;
    for (let [id, ligand] of this.map) {
      cb(ligand, id);
    }
  }
  constructor(ligands) {
    ligands.forEach((props) => this.add(props));
  }
}

export class EdgeGroup {
  group = new Group();
  map = edgeMap;
  add(props) {
    const edge = new Edge(props);
    edgeMap.set(props.id, edge);
    this.group.add(edge.el);
    return edge;
  }
  delete(edge) {
    const { id, source, target } = edge;
    edgeMap.delete(id, edge);
    this.group.remove(edge.el);
    return { id, source, target };
  }
  forEach(cb) {
    if (!cb) return;
    for (let [id, edge] of this.map) {
      cb(edge, id);
    }
  }
  reDraw() {
    this.forEach((edge) => edge.reDraw());
  }
  constructor(edges) {
    edges.forEach((props) => this.add(props));
  }
}
