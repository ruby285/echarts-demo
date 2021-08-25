import { init } from "zrender";
import { mockLigands, mockEdges } from "./mockData";
import { ligandGroup, EdgeGroup } from "./group";
import Room from "./room";
import Layout from "./layout";
import Events from "./events";
import emitter from "./events/emitter";

// TODO: 布局计算的优化

// TODO: 代码优化 90%
// TODO-BUG:  selector order
// TODO: 样式优化
// TODO: more

class FepChart {
  renderer = null;
  room = null;
  ligandGroup = null;
  edgeGroup = null;
  layout = null;
  events = null;
  emitter = null;

  initRoom(parent, dom, len) {
    this.room = new Room(parent, dom);
    this.room.init(len);
  }

  initGroup(ligands, edges) {
    this.ligandGroup = new ligandGroup(ligands);
    this.edgeGroup = new EdgeGroup(edges);
    this.renderer.add(this.ligandGroup.group);
    this.renderer.add(this.edgeGroup.group);
  }

  initLayout(ligands, edges) {
    this.layout = new Layout(this.room, this.ligandGroup, this.edgeGroup);
    this.layout.init(ligands, edges);
    this.layout.run();
  }

  initEvents() {
    this.events = new Events(this);
    this.emitter = emitter;
  }

  init(parent, dom, ligands = mockLigands, edges = mockEdges) {
    this.initRoom(parent, dom, ligands.length);
    // this.renderer = init(dom, { devicePixelRatio: 2 });
    // this.renderer = init(dom, { renderer: "vml" });
    // this.renderer = init(dom, { renderer: "svg" });
    this.renderer = init(dom);

    this.initGroup(ligands, edges);
    this.initLayout(ligands, edges);
    this.initEvents();
  }

  addLigand() {
    const id = this.ligandGroup.acSize + 1;
    this.ligandGroup.add({ id, firstAdd: true });
    this.layout.addLigand({ id });
    this.layout.reRun();
  }

  dispose() {
    if (!this.renderer) return;
    this.renderer.dispose();
  }
}

export default new FepChart();
