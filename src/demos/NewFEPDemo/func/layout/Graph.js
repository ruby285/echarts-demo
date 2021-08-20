import Vertex from "./Vertex";

function Graph(data) {
  var i, max;

  if (!(this instanceof Graph)) {
    return new Graph(data);
  }

  this.nVerts = 0;
  this.vertices = {};
  this.adj = {}; // Adjacency list.

  for (i = 0, max = data.vertices.length; i < max; ++i) {
    this.addVertex(data.vertices[i].id, data.vertices[i].data);
  }
}

Graph.prototype = {
  constructor: Graph,

  addVertex: function (id, data, posX, posY) {
    this.vertices[id] = new Vertex(id, data, posX, posY);
    ++this.nVerts;
    return id;
  },

  getVertex: function (id) {
    return this.vertices[id];
  },

  getSize: function () {
    return this.nVerts;
  },

  forEachVertex: function (callback, this_obj) {
    var i;

    if (typeof callback === "function") {
      for (i in this.vertices) {
        if (this.vertices.hasOwnProperty(i)) {
          callback.call(this_obj, this.vertices[i], i);
        }
      }
    }
  },
};

export default Graph;
