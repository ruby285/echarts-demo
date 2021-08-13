import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import graph from "./data.json";
import "./style.css";

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
      animationDuration: 1500,
      animationEasingUpdate: "quinticInOut",
      selectedMode: "multiple",
      series: [
        {
          name: "Les Miserables",
          type: "graph",
          layout: "none",
          data: graph.nodes,
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
          },
          markPoint: {
            symbol: "rect",
            data: [
              {
                name: "某个坐标",
                coord: [10, 20],
              },
            ],
          },
        },
      ],
    };

    myChart.setOption(option);

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
