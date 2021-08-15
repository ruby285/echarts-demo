import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import graph from "./data.json";
import imgData from './img.jpg'
import "./style.css";

// const imgUrl =
//   "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcdn.duitang.com%2Fuploads%2Fitem%2F201303%2F29%2F20130329205806_kTTnv.thumb.700_0.jpeg&refer=http%3A%2F%2Fcdn.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1631434123&t=10e9062e4ccd3bae84c279fcdd598f1d";


const cartesianData = graph.nodes.map(node => ([node.x, node.y, 80, node]))

export default function LigandGraph() {
  console.log(graph);
  const ecRef = useRef();

  useEffect(() => {
    const myChart = echarts.init(ecRef.current);
    graph.nodes.forEach(function (node) {
      node.label = {
        show: node.symbolSize > 30,
      };
    });
    const option = {
      tooltip: {},
      legend: [
        {
          data: graph.categories.map(function (a) {
            return a.name;
          }),
        },
      ],
      grid: {
        left: 0,
        bottom: 0,
        right: 0,
        top: 0
      },
      xAxis: {
        type: 'value',
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
        type: 'value',
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
          name: "Les Miserables",
          id: "graph",
          type: "graph",
          layout: "none",
          animation: false,
          coordinateSystem: 'cartesian2d',
          data: cartesianData,
          // data: graph.nodes,

          symbolSize: 80,
          links: graph.links,
          categories: graph.categories,
          roam: true,
          label: {
            position: "right",
            formatter: "{b}",
          },
          lineStyle: {
            color: "source",
            curveness: 0.3,
          },
          emphasis: {
            focus: "adjacency",
            lineStyle: {
              width: 10,
            },
          }
        },
      ],
    };

    myChart.setOption(option);

    myChart.setOption({
      graphic: echarts.util.map(graph.nodes, function (item, dataIndex) {

        const { x, y, symbolSize } = item
        const imgW = symbolSize, imgH = symbolSize
        const [imgX, imgY] = myChart.convertToPixel({ seriesId: 'graph' }, [x, y]);
        console.log(x, y, symbolSize, imgX, imgY)

        return {
          type: 'image',
          style: {
            image: imgData,
            width: imgW,
            height: imgH,
            x: imgX - imgW / 2,
            y: imgY - imgH / 2,
          },
          draggable: true,
          ondrag: echarts.util.curry(onPointDragging, dataIndex),
          // onmousemove: echarts.util.curry(showTooltip, dataIndex),
          // onmouseout: echarts.util.curry(hideTooltip, dataIndex),
          z: 100
        };
      })
    });

    function onPointDragging(dataIndex, dx, dy) {
      const { x: transX, y: transY } = this
      const { x: styleX, y: styleY } = this.style
      const [resX, resY] = myChart.convertFromPixel({ seriesId: 'graph' }, [transX + styleX + 40, transY + styleY + 40])
      console.log(dataIndex, dx, dy)
      console.log(this)
      console.log(transX + styleX, resX)
      // data[dataIndex] = myChart.convertFromPixel('grid', this.position);
      cartesianData[dataIndex][0] = resX
      cartesianData[dataIndex][1] = resY
      myChart.setOption({
        series: [{
          id: 'graph',
          data: cartesianData
        }]
      });
    }

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
