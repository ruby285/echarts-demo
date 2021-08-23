import React, { useState, useEffect, useRef, useCallback } from "react";
import fepChart from "./fepChart";
import "./style.css";

export default function LigandGraph() {
  const ecRef = useRef();

  const addLigand = useCallback(() => {
    fepChart.addLigand();
  }, []);

  useEffect(() => {
    fepChart.init(ecRef.current);
    return () => fepChart.dispose();
  }, []);

  return (
    <>
      <div ref={ecRef} className="fep-demo">
        ligand-graph
      </div>
      <button className="fep-add" onClick={addLigand}>
        add a ligand
      </button>
    </>
  );
}
