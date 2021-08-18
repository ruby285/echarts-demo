import * as echarts from "echarts";
import { getDefaultOption } from "./viewer";
import controller from "./controller";
import graph from "./data.json";

class FEPGraphChart {
  chartIns = null;
  initEvents() {
    this.chartIns.on("mouseover", (params) => {
      // console.log(params);
    });
    this.chartIns.on("click", (params) => {
      // console.log(params);
    });
  }

  init(el) {
    this.chartIns = echarts.init(el);
    controller.init(graph.nodes, graph.links);
    const { visualNodes, visualLinks, visualTexts } = controller;
    const defaultOption = getDefaultOption(
      visualNodes,
      visualLinks,
      visualTexts
    );
    this.chartIns.setOption(defaultOption);
    this.initEvents();
  }
  dispose() {
    if (!this.chartIns) return;
    this.chartIns.dispose();
  }
}

export default new FEPGraphChart();
