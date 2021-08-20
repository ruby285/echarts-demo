import React, { useState, useEffect, useRef } from "react";
import graphChart from "./func/fepChart";
import { layout } from "./func/layout/main";
import "./style.css";

export default function LigandGraph() {
  const ecRef = useRef();

  useEffect(() => {
    graphChart.init(ecRef.current);
    // graphChart.setDefaultData();

    return () => graphChart.dispose();
  }, []);

  return (
    <div ref={ecRef} className="fep-demo">
      ligand-graph
    </div>
  );
}
