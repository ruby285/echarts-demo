import Vertex from "./Vertex";

class Graph {
  constructor(vertices = [], edges = []) {
    this.nVerts = 0;
    this.vertices = {};
    this.adj = {};

    for (let i = 0; i < vertices.length; ++i) {
      this.addVertex(vertices[i].id);
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
    this.adj[u] = this.adj[u] || new Set();
    this.adj[u].add(v);
    this.vertices[u].edgeNum++;
    this.adj[v] = this.adj[v] || new Set();
    this.adj[v].add(u);
    this.vertices[v].edgeNum++;
  }

  deleteEdge(u, v) {
    this.removeAdj(u, v);
    this.removeAdj(v, u);
  }

  removeAdj(a, b) {
    if (!this.adj[a]) return;
    this.adj[a].delete(b);
    if (!this.vertices[a]) return;
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
      Array.from(this.adj[i]).forEach((n) => callback(v, this.vertices[n]));
      // let j = this.adj[i].size;

      // while (j--) {
      //   callback(v, this.vertices[this.adj[i][j]]);
      // }
    }, this);
  }
}

export default Graph;
