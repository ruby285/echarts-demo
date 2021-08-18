import { init, Circle } from "zrender";

// console.log(zrender);
class FEPGraphChart {
  zr = null;

  init(el) {
    this.zr = init(el);
    var circle = new Circle({
      shape: {
        cx: 150,
        cy: 50,
        r: 40,
      },
      style: {
        fill: "none",
        stroke: "#F00",
      },
    });
    this.zr.add(circle);
  }
  dispose() {
    if (!this.zr) return;
    this.zr.dispose();
  }
}

export default new FEPGraphChart();
