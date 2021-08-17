import * as echarts from "echarts";
import graph from "./data.json";
import imgData from "./img.jpg";

// 第一层: 原始数据 originNodes originLinks
// 第二层: 控制数据 node2Links link2Nodes selectedList
// 第三层: 视图数据 visualNodes visualLinks visualTexts
let myChart = null,
  originNodes = graph.nodes,
  originLinks = graph.links,
  node2Links = new Map(),
  link2Nodes = new Map(),
  selectedList = new Set(),
  visualNodes = [],
  visualLinks = originLinks,
  visualTexts = [];

const nodesMap = new Map();
originNodes.forEach((node) => {
  nodesMap.set(node.id, node);
  node2Links.set(node.id, new Set());
  visualNodes.push([node.x, node.y, 100, 1]);
  visualTexts.push([node.x, node.y, node.name]);
});

originLinks.forEach((link) => {
  const sourceId = link.source;
  const targetId = link.target;
  node2Links.get(sourceId).add(link.id);
  node2Links.get(targetId).add(link.id);
  link2Nodes.set(link.id, [sourceId, targetId]);
});

let lineLinks = originLinks.map((link) => {
  const { x: x1, y: y1 } = nodesMap.get(link.source);
  const { x: x2, y: y2 } = nodesMap.get(link.target);
  return {
    coords: [
      [x1, y1],
      [x2, y2],
    ],
    symbol: ["none", "arrow"],
    lineStyle: {
      width: 1,
    },
  };
});

const OriginScale = 1;
const highLightScale = 1.5;

const renderImage = (params, api) => {
  var cx = api.value(0);
  var cy = api.value(1);
  var r = api.value(2);
  const pos = api.coord([cx, cy]);
  var id = api.value(3);
  var scale = api.value(4) || 1;

  const image = {
    type: "image",
    id,
    style: {
      image: imgData,
      x: pos[0] - r / 2,
      y: pos[1] - r / 2,
      width: r,
      height: r,
    },
    focus: "self",
    blurScope: "coordinateSystem",
    emphasis: {
      style: {
        x: pos[0] - (r / 2) * scale,
        y: pos[1] - (r / 2) * scale,
        width: r * scale,
        height: r * scale,
      },
    },
    z2: 100,
  };
  return image;
};

const renderText = (params, api) => {
  var x = api.value(0);
  var y = api.value(1);
  var text = api.value(2);
  const pos = api.coord([x, y]);
  // var id = api.value(3);
  // var scale = api.value(4) || 1;

  const image = {
    type: "text",
    // id,
    style: {
      text,
      x: pos[0] + 40,
      y: pos[1] - 80,
      textAlign: "center",
      stroke: "#ff0",
    },
    focus: "self",
    blurScope: "coordinateSystem",
    z2: 100,
  };
  return image;
};

const defaultOption = {
  tooltip: {
    show: false,
  },
  grid: {
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
  },
  xAxis: {
    type: "value",
    show: false,
    min: 0,
    max: 250,
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: false,
    },
  },
  yAxis: {
    type: "value",
    show: false,
    min: 0,
    max: 200,
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: false,
    },
  },
  series: [
    {
      id: "lines",
      type: "lines",
      coordinateSystem: "cartesian2d",
      lineStyle: {
        curveness: 0.1,
      },
      emphasis: {
        focus: "self",
        blurScope: "series",
        lineStyle: {
          width: 10,
        },
      },
      blur: {
        lineStyle: {
          opacity: 0.1,
        },
      },
      data: lineLinks,
    },
    {
      id: "images",
      type: "custom",
      renderItem: renderImage,
      clip: true,
      data: visualNodes,
    },
    {
      id: "text",
      type: "custom",
      renderItem: renderText,
      clip: true,
      data: visualTexts,
    },
  ],
};

const init = (el) => {
  myChart = echarts.init(el);
  myChart.setOption(defaultOption);
  console.log(myChart);
};

const setDefaultData = () => {};

const graphChart = {
  init,
  setDefaultData,
  dispose() {
    if (!myChart) return;
    myChart.dispose();
  },
};

export default graphChart;
