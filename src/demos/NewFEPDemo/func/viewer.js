import * as echarts from "echarts";
import { renderImage, renderText } from "./viewerHelper";

export function getDefaultOption(visualNodes, visualLinks, visualTexts) {
  const tooltip = {
    show: false,
  };
  const grid = {
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
  };
  const xAxis = {
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
  };
  const yAxis = xAxis;
  const imagesSeries = {
    id: "images",
    type: "custom",
    renderItem: renderImage,
    clip: true,
    data: visualNodes,
  };
  const linesSeries = {
    id: "lines",
    type: "lines",
    coordinateSystem: "cartesian2d",
    lineStyle: {
      curveness: 0.1,
    },
    emphasis: {
      focus: "none",
      blurScope: "series",
      lineStyle: {
        width: 10,
      },
    },
    symbol: ["none", "arrow"],

    data: visualLinks,
  };
  const textsSeries = {
    id: "text",
    type: "custom",
    renderItem: renderText,
    clip: true,
    data: visualTexts,
  };
  const defaultOption = {
    tooltip,
    grid,
    xAxis,
    yAxis,
    series: [imagesSeries, linesSeries, textsSeries],
  };

  return defaultOption;
}
