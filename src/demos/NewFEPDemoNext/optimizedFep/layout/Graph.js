import Vertex from "./Vertex";

class Graph {
  constructor(ligands = [], edges = []) {
    this.nVerts = 0;
    this.vertices = {};
    this.adj = {};

    for (let i = 0; i < ligands.length; ++i) {
      this.addVertex(ligands[i].id);
    }

    for (let i = 0; i < edges.length; ++i) {
      this.addEdge(edges[i].source, edges[i].target);
    }
  }
  addVertex(id) {
    this.vertices[id] = new Vertex(id);
    ++this.nVerts;
    return id;
  }
  deleteVertex(id) {
    delete this.vertices[id];
    --this.nVerts;
    return id;
  }

  addEdge(u, v) {
    this.adj[u] = this.adj[u] || [];
    this.adj[u].push(v);
    this.vertices[u].edgeNum++;
    this.adj[v] = this.adj[v] || [];
    this.adj[v].push(u);
    this.vertices[v].edgeNum++;
  }

  deleteEdge(u, v) {
    this.removeAdj(u, v);
    this.removeAdj(v, u);
  }

  removeAdj(a, b) {
    if (!this.adj[a]) return;
    const idx = this.adj[a].indexOf(b);
    if (idx < 0) return;
    this.adj[a].splice(idx, 1);
    this.vertices[a].edgeNum--;
  }

  getVertex(id) {
    return this.vertices[id];
  }

  getSize() {
    return this.nVerts;
  }

  getDegree(v) {
    return this.adj[v].length;
  }

  forEachVertex(callback) {
    for (let i in this.vertices) {
      if (this.vertices.hasOwnProperty(i)) {
        callback(this.vertices[i], i);
      }
    }
  }

  forEachEdge(callback) {
    this.forEachVertex((v, i) => {
      if (!this.adj[i]) return;
      let j = this.adj[i].length;

      while (j--) {
        callback(v, this.vertices[this.adj[i][j]]);
      }
    }, this);
  }
}

export default Graph;
