import * as echarts from "echarts";
import graph from "./data.json";
import imgData from "./img.jpg";

let myChart = null,
  data = [],
  links = [],
  selectedList = new Set(),
  pointsMap = new Map();

const OriginScale = 1;
const highLightScale = 1.5;

const defaultOption = {
  animation: true,
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
      id: "graph",
      type: "graph",
      layout: "none",
      animation: true,
      coordinateSystem: "cartesian2d",
      data: [],
      symbolSize: 100,
      links: [],
      categories: [],
      roam: true,
      itemStyle: {
        opacity: 0,
      },
      label: {
        show: false,
      },
      lineStyle: {
        color: "source",
        curveness: 0.1,
      },
      emphasis: {
        focus: "none",
        scale: false,
      },
    },
  ],
};
const getGraphicOption = (data) => {
  return {
    graphic: data.map((data, dataIndex) => {
      const item = data[3];
      const { x, y, symbolSize, id } = item;
      const imgW = symbolSize,
        imgH = symbolSize;
      const [imgX, imgY] = myChart.convertToPixel({ seriesId: "graph" }, [
        x,
        y,
      ]);
      const params = { ...item, dataIndex };

      const res = {
        id,
        type: "image",
        originX: imgX,
        originY: imgY,
        style: {
          image: imgData,
          width: imgW,
          height: imgH,
          x: imgX - imgW / 2,
          y: imgY - imgH / 2,
        },
        draggable: false,
        onclick: echarts.util.curry(onPointClick, params),
        onmouseover: echarts.util.curry(onPointMouseOver, params),
        onmouseout: echarts.util.curry(onPointMouseOut, params),
        z: 100,
      };

      return res;
    }),
  };
};

const init = (el) => {
  myChart = echarts.init(el);
  myChart.setOption(defaultOption);
  initChartEvents();
};
const setDefaultData = () => {
  links = graph.links;
  data = graph.nodes.map((node) => {
    node.links = new Set();
    pointsMap.set(node.id, node);
    return [node.x, node.y, 80, node];
  });
  links.forEach((link) => {
    pointsMap.get(link.source).links.add(link);
    pointsMap.get(link.target).links.add(link);
  });
  const graphicOption = getGraphicOption(data);
  myChart.setOption({
    ...graphicOption,
    series: [
      {
        id: "graph",
        data: data,
        links: links,
      },
    ],
  });
};

const initChartEvents = () => {
  myChart.on("mouseover", onLineMouseOver);
  myChart.on("mouseout", onLineMouseOut);
};

const graphChart = {
  init,
  setDefaultData,
  dispose() {
    if (!myChart) return;
    myChart.dispose();
  },
};

export default graphChart;

// function onPointDragging(params) {
//   const { dataIndex } = params;
//   const { x: transX, y: transY } = this;
//   const { x: styleX, y: styleY } = this.style;
//   const [resX, resY] = myChart.convertFromPixel({ seriesId: "graph" }, [
//     transX + styleX + 40,
//     transY + styleY + 40,
//   ]);
//   data[dataIndex][0] = resX;
//   data[dataIndex][1] = resY;
//   myChart.setOption({
//     series: [
//       {
//         id: "graph",
//         data: data,
//       },
//     ],
//   });
// }

// function onPointMouseDown() {
//   console.log("onPointMouseDown", this);
// }
// function onPointMouseUp() {
//   console.log("onPointMouseUp", this);
// }

function onPointClick(item) {
  // TODO: 完善选择的逻辑
  const { id } = item;
  if (selectedList.has(id)) {
    selectedList.delete(id);
    myChart.setOption({
      graphic: [
        {
          id,
          type: "image",
          style: {
            shadowBlur: 0,
          },
          z: 100,
        },
      ],
    });
    return;
  }
  selectedList.add(id);
  myChart.setOption({
    graphic: [
      {
        id,
        type: "image",
        style: {
          shadowBlur: 10,
          shadowColor: "#333",
        },
      },
    ],
  });
}
function onPointMouseOver(item) {
  const { id, dataIndex } = item;
  const current = data[dataIndex][3];
  const linesHightLight = Array.from(current.links).map((link) => link.id);
  const pointsHightLightSet = Array.from(current.links).reduce((a, b) => {
    a.add(b.target);
    a.add(b.source);
    return a;
  }, new Set());

  const graphic = data.map((arr) => {
    const item = arr[3];
    if (pointsHightLightSet.has(item.id)) {
      return {
        id: item.id,
        type: "image",
        scaleX: highLightScale,
        scaleY: highLightScale,
      };
    }
    return {
      id: item.id,
      type: "image",
      style: {
        opacity: 0.1,
      },
    };
  });

  links = links.map((link) => {
    if (linesHightLight.includes(link.id)) {
      return {
        ...link,
        lineStyle: {
          width: 6,
        },
      };
    }
    return {
      ...link,
      lineStyle: {
        opacity: 0.1,
      },
    };
  });

  myChart.setOption({
    series: [
      {
        id: "graph",
        links: links,
      },
    ],
    graphic,
  });
}
function onPointMouseOut(item) {
  const graphic = data.map((arr) => ({
    id: arr[3].id,
    type: "image",
    scaleX: OriginScale,
    scaleY: OriginScale,
    style: {
      opacity: 1,
    },
  }));

  links = links.map((link) => ({
    ...link,
    lineStyle: {
      width: 1,
      opacity: 1,
    },
  }));

  myChart.setOption({
    series: [
      {
        id: "graph",
        links: links,
      },
    ],
    graphic,
  });
}

function onLineMouseOver(params) {
  const { data: seriesData, seriesId } = params;
  if (seriesId !== "graph") return;
  const { source, target, id } = seriesData;

  const graphic = data.map((arr) => {
    const item = arr[3];
    if (item.id === source || item.id === target) {
      return {
        id: item.id,
        type: "image",
        scaleX: highLightScale,
        scaleY: highLightScale,
      };
    }
    return {
      id: item.id,
      type: "image",
      style: {
        opacity: 0.1,
      },
    };
  });

  links = links.map((link) => {
    if (link.id === id) {
      return {
        ...link,
        lineStyle: {
          width: 6,
        },
      };
    }
    return {
      ...link,
      lineStyle: {
        opacity: 0.1,
      },
    };
  });

  myChart.setOption({
    series: [
      {
        id: "graph",
        links: links,
      },
    ],
    graphic,
  });
}

function onLineMouseOut(params) {
  const { seriesId } = params;
  if (seriesId !== "graph") return;

  const graphic = data.map((arr) => ({
    id: arr[3].id,
    type: "image",
    scaleX: OriginScale,
    scaleY: OriginScale,
    style: {
      opacity: 1,
    },
  }));

  links = links.map((link) => ({
    ...link,
    lineStyle: {
      width: 1,
      opacity: 1,
    },
  }));

  myChart.setOption({
    series: [
      {
        id: "graph",
        links: links,
      },
    ],
    graphic,
  });
}

function setPointHighlight(point) {}
function setLineHighlight() {}

function setPointsScale() {}
function setPointsOpacity() {}
function setLineScale(id) {}
function setLinesOpacity(id) {}
