import React, { useState, useEffect, useRef } from "react";
// import graphChart from "./func/fepChart";
// import { layout } from "./func/layout/main";
import fepChart from "./fepChart";
import "./style.css";

export default function LigandGraph() {
  const ecRef = useRef();

  useEffect(() => {
    fepChart.init(ecRef.current);
    // layout.init(ecRef.current);
    // layout.run();
    // graphChart.init(ecRef.current);
    // graphChart.setDefaultData();
    // return () => graphChart.dispose();
    return () => fepChart.dispose();
  }, []);

  return (
    <div ref={ecRef} className="fep-demo">
      ligand-graph
    </div>
  );
}
