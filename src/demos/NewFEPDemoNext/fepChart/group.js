import { Group } from "zrender";
import { Ligand, Edge } from "./element";
import imgData from "./ligand.png";

export const ligandMap = new Map();
export const edgeMap = new Map();

export class ligandGroup {
  group = new Group();
  map = ligandMap;
  constructor(ligands) {
    ligands.forEach((item) => {
      const ligand = new Ligand({
        img: imgData,
        id: item.id,
      });
      ligandMap.set(item.id, ligand);
      this.group.add(ligand.el);
    });
  }
}

export class EdgeGroup {
  group = new Group();
  map = edgeMap;
  add(edgeParams) {
    const edge = new Edge(edgeParams);
    edgeMap.set(edgeParams.id, edge);
    this.group.add(edge.el);
    return edge;
  }
  delete(edge) {
    const { id, source, target } = edge;
    edgeMap.delete(id, edge);
    this.group.remove(edge.el);
    return { id, source, target };
  }
  constructor(edges) {
    edges.forEach((item) => {
      const edge = new Edge(item);
      edgeMap.set(item.id, edge);
      this.group.add(edge.el);
    });
  }
}
