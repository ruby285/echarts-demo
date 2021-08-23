import React, { useState, useEffect, useRef, useCallback } from "react";
// import fepChart from "./fepChart";
import fepChart from "./optimizedFep";

import "./style.css";

export default function LigandGraph() {
  const parentRef = useRef();
  const ecRef = useRef();

  const addLigand = useCallback(() => {
    fepChart.addLigand();
  }, []);

  useEffect(() => {
    fepChart.init(parentRef.current, ecRef.current);
    return () => fepChart.dispose();
  }, []);

  return (
    <>
      <div ref={parentRef} className="fep-parent">
        <div ref={ecRef} className="fep-demo2">
          ligand-graph
        </div>
      </div>
      <button className="fep-add" onClick={addLigand}>
        add a ligand
      </button>
    </>
  );
}
