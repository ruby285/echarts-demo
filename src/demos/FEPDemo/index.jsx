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

  useEffect(() => {
    graphChart.init(ecRef.current);
    graphChart.setDefaultData();

    return () => graphChart.dispose();
  }, []);

  return (
    <div ref={ecRef} className="ligand-graph">
      ligand-graph
    </div>
  );
}
