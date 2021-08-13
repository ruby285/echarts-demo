import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
// import graph from "./data.json";
import "./style.css";

const imgUrl =
  "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcdn.duitang.com%2Fuploads%2Fitem%2F201303%2F29%2F20130329205806_kTTnv.thumb.700_0.jpeg&refer=http%3A%2F%2Fcdn.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1631434123&t=10e9062e4ccd3bae84c279fcdd598f1d";

const points = [
  [144.05643723300403, 391.989177697125],
  [143.44979081559802, 145.79831664249298],
  [354.9171590330541, 515.8021849807043],
  [396.52409124434405, 116.6004114139717],
  [98.39748846940002, 83.26703414775676],
  [356.62745709368414, 173.81855690543318],
  [311.8633768372581, 335.67090255321824],
];

export default function CustomLigandGraph() {
  const ecRef = useRef();

  useEffect(() => {
    const myChart = echarts.init(ecRef.current);

    const renderItem = (params, api) => {
      var color = api.visual("color");
      var cx = api.value(0);
      var cy = api.value(1);
      var r = api.value(2);
      const pos = api.coord([cx, cy]);
      var id = api.value(3);
      var name = api.value(4);

      console.log(pos);
      const circle = {
        type: "circle",
        transition: ["shape"],
        shape: {
          // points: points,
          cx,
          cy,
          r,
        },
        style: api.style({
          fill: color,
          stroke: color,
        }),
      };
      // const image = {
      //   type: "image",
      //   x: 200,
      //   y: 200,
      //   style: {
      //     image: imgUrl,
      //     // x: 30,
      //     // y: 30,
      //     width: 40,
      //     height: 40,
      //     stroke: "#ccc",
      //     lineWidth: 6,
      //   },
      // };
      return {
        type: "group",
        children: [circle],
      };
    };

    var option = {
      xAxis: {
        type: "value",
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          type: "custom",
          renderItem: renderItem,
          clip: true,
          data: [
            [200, 100, 20, 47, "MmeBurgon"],
            [300, 100, 30, 48, "MmeBurgon2"],
          ],
          nodes: [
            {
              id: "47",
              name: "MmeBurgon",
              symbolSize: 4.495239333333333,
              x: 488.13535,
              y: 356.8573,
            },
          ],
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
