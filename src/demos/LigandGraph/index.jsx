import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import graph from "./data.json";
import imgData from "./img.jpg";
import graphChart from "./graphChart.js";
import "./style.css";

const cartesianData = graph.nodes.map((node) => [node.x, node.y, 80, node]);
const selectedList = new Set();

export default function LigandGraph() {
  const ecRef = useRef();
  const [state, setstate] = useState();

  useEffect(() => {
    graphChart.init(ecRef.current);
    graphChart.setDefaultData();

    return () => graphChart.dispose();
  }, []);

  useEffect(() => {
    if (!state) return;
    const myChart = echarts.init(ecRef.current);
    graph.nodes.forEach(function (node) {
      node.label = {
        show: node.symbolSize > 30,
      };
    });
    const option = {
      tooltip: {},
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
      // animationDuration: 1500,
      // animationEasingUpdate: "quinticInOut",
      // selectedMode: "multiple",
      series: [
        {
          id: "graph",
          type: "graph",
          layout: "none",
          animation: false,
          coordinateSystem: "cartesian2d",
          data: cartesianData,
          symbolSize: 80,
          links: graph.links,
          categories: graph.categories,
          roam: true,
          label: {
            show: false,
          },
          lineStyle: {
            color: "source",
            curveness: 0.1,
          },
          emphasis: {
            focus: "adjacency",
            lineStyle: {
              width: 10,
            },
          },
        },
      ],
    };

    myChart.setOption(option);

    const graphicOption = {
      graphic: echarts.util.map(cartesianData, function (data, dataIndex) {
        const item = data[3];
        const { x, y, symbolSize, id } = item;
        const imgW = symbolSize,
          imgH = symbolSize;
        const [imgX, imgY] = myChart.convertToPixel({ seriesId: "graph" }, [
          x,
          y,
        ]);

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
          draggable: true,
          ondrag: echarts.util.curry(onPointDragging, dataIndex),
          onclick: echarts.util.curry(onPointClick, { ...item, dataIndex }),
          onmousemove: echarts.util.curry(onPointMouseMove, {
            ...item,
            dataIndex,
          }),
          onmouseout: echarts.util.curry(onPointMouseOut, {
            ...item,
            dataIndex,
          }),
          z: 100,
        };

        return res;
      }),
    };

    myChart.setOption(graphicOption);

    function onPointDragging(dataIndex) {
      const { x: transX, y: transY } = this;
      const { x: styleX, y: styleY } = this.style;
      const [resX, resY] = myChart.convertFromPixel({ seriesId: "graph" }, [
        transX + styleX + 40,
        transY + styleY + 40,
      ]);
      cartesianData[dataIndex][0] = resX;
      cartesianData[dataIndex][1] = resY;
      myChart.setOption({
        series: [
          {
            id: "graph",
            data: cartesianData,
          },
        ],
      });
    }

    function onPointClick(item, ev) {
      const updateList = [];
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

    function onPointMouseMove(item) {
      const { id, dataIndex } = item;
      myChart.setOption({
        graphic: [
          {
            id,
            type: "image",
            scaleX: 1.4,
            scaleY: 1.4,
          },
        ],
      });
      myChart.dispatchAction({
        type: "highlight",
        seriesId: "graph",
        dataIndex: dataIndex,
      });
    }
    function onPointMouseOut(item) {
      const { id, dataIndex } = item;
      myChart.dispatchAction({
        type: "downplay",
        seriesId: "graph",
        dataIndex: dataIndex,
      });
      myChart.setOption({
        graphic: [
          {
            id,
            type: "image",
            scaleX: 1,
            scaleY: 1,
          },
        ],
      });
    }

    function onLineMouseOver(params) {
      const { data, seriesId } = params;
      if (seriesId !== "graph") return;
      const { source, target } = data;

      myChart.setOption({
        graphic: [
          {
            id: source,
            type: "image",
            scaleX: 1.4,
            scaleY: 1.4,
          },
          {
            id: target,
            type: "image",
            scaleX: 1.4,
            scaleY: 1.4,
          },
        ],
      });
    }

    function onLineMouseOut(params) {
      const { data, seriesId } = params;
      if (seriesId !== "graph") return;
      const { source, target } = data;

      myChart.setOption({
        graphic: [
          {
            id: source,
            type: "image",
            scaleX: 1.1,
            scaleY: 1.1,
          },
          {
            id: target,
            type: "image",
            scaleX: 1.1,
            scaleY: 1.1,
          },
        ],
      });
    }

    myChart.on("mouseover", onLineMouseOver);
    myChart.on("mouseout", onLineMouseOut);

    return () => {
      myChart.dispose();
    };
  }, [state]);

  return (
    <div ref={ecRef} className="ligand-graph">
      ligand-graph
    </div>
  );
}
