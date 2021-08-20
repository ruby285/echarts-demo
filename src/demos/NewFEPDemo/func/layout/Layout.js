import FRLayout from "./FRLayout";

class Layout {
  constructor(graph) {
    this.graph = graph;
    this.layoutAlgorithm = new FRLayout(
      {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      },
      graph
    );
  }

  updateGraphics() {
    // 更新节点的位置信息，并执行绘制
  }

  step() {
    this.layoutAlgorithm.updatePhysics();
    this.updateGraphics();
  }

  run() {
    this.step();
    if (this.layoutAlgorithm.isDone()) return;
    window.requestAnimationFrame(this.run);
  }
}

export default Layout;
