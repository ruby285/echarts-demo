import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import graph from "./data.json";
import "./style.css";

let nodes = graph.nodes;
let links = graph.links;

let nodesMap = new Map();

let imgNodes = nodes.map((node) => {
  nodesMap.set(node.id, node);
  return [node.x, node.y, 80, node.id, 1];
});
let lineLinks = links.map((link) => {
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

let cusTomLines = lineLinks.map((link) => [...link.coords.flat(), 1]);

// console.log(cusTomLines);

const imgUrl =
  "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcdn.duitang.com%2Fuploads%2Fitem%2F201303%2F29%2F20130329205806_kTTnv.thumb.700_0.jpeg&refer=http%3A%2F%2Fcdn.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1631434123&t=10e9062e4ccd3bae84c279fcdd598f1d";

export default function CustomLigandGraph() {
  const ecRef = useRef();

  useEffect(() => {
    const myChart = echarts.init(ecRef.current);

    const renderLine = (params, api) => {
      var x1 = api.value(0);
      var y1 = api.value(1);
      var x2 = api.value(2);
      var y2 = api.value(3);
      var width = api.value(4);
      const pos1 = api.coord([x1, y1]);
      const pos2 = api.coord([x2, y2]);

      console.log(pos1, pos2);

      const image = {
        type: "line",
        // id,
        // transition: ["scaleX", "scaleY"],
        // scaleX: scale,
        // scaleY: scale,
        // invisible: true,
        shape: {
          x1: pos1[0],
          y1: pos1[1],
          x2: pos2[0],
          y2: pos2[1],
          // percent: 0.9,
          symbol: ["none", "arrow"],
        },
        symbol: ["none", "arrow"],
        style: {
          lineWidth: width,
          stroke: "#333",
          symbol: ["none", "arrow"],
          transition: ["lineWidth"],
        },
        curveness: 0.1,
      };
      return image;
    };

    const renderImage = (params, api) => {
      var cx = api.value(0);
      var cy = api.value(1);
      var r = api.value(2);
      const pos = api.coord([cx, cy]);
      var id = api.value(3);
      var scale = api.value(4);

      const image = {
        type: "image",
        id,
        transition: ["scaleX", "scaleY"],
        scaleX: scale,
        scaleY: scale,
        style: {
          image: imgUrl,
          x: pos[0],
          y: pos[1],
          width: r,
          height: r,
        },
      };
      return image;
    };

    var option = {
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
          id: "images",
          type: "custom",
          renderItem: renderImage,
          clip: true,
          data: imgNodes,
        },
        // {
        //   id: "lines",
        //   type: "custom",
        //   renderItem: renderLine,
        //   clip: true,
        //   data: cusTomLines,
        // },
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
      ],
    };

    myChart.setOption(option);

    myChart.on("click", function (params) {
      // 当 name 为 'aaa' 的图形元素被点击时，此回调被触发。
      console.log(params);
      lineLinks = lineLinks.map((link) => ({
        ...link,
        lineStyle: { width: 10 },
      }));

      imgNodes = imgNodes.map((img) => {
        img[4] = 1.5;
        return img;
      });

      // cusTomLines = cusTomLines.map((line) => {
      //   line[4] = 10;
      //   return line;
      // });
      myChart.setOption({
        series: [
          // {
          //   id: "lines",
          //   data: lineLinks,
          // },
          // {
          //   id: "lines",
          //   data: cusTomLines,
          // },
          {
            id: "images",
            data: imgNodes,
          },
        ],
      });
    });

    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <div ref={ecRef} className="ligand-graph">
      ligand-graph
    </div>
  );
}
