import React, { useEffect, useState } from "react";
import SimpleChart from "./Component/simpleChart";
import LargeDataToogler from "./Component/LargeDataToogler";
import Box3D from './Component/Box3DChart';
import GroupedBars from './Component/GroupedBars';
import { simple_mock_data } from "./mock_data";

import "./App.css";

const App = (props) => {
  const [simpleChartData, setSimpleChartData] = useState([]);
  const [useLargeData, toogleUseLargeData] = useState(false);
  const [largeDataCount, updateLargeDataCount] = useState(666);

  const getSimpleChartLargeData = () => {
    let arr = [];
    for (let i = 0; i < largeDataCount; i++) {
      arr.push({ x: i, y: Math.random() * 100 });
    }
    return arr;
  };

  useEffect(() => {
    setSimpleChartData(
      useLargeData ? getSimpleChartLargeData() : simple_mock_data
    );
  }, [useLargeData, largeDataCount]);

  return (
    <div className="fill">
      <LargeDataToogler
        updateLargeDataCount={updateLargeDataCount}
        largeDataCount={largeDataCount}
        checked={useLargeData}
        handleTooggle={toogleUseLargeData}
      />
      <GroupedBars id="chart-0" />
      <SimpleChart id="chart-1" data={simpleChartData} />
      <Box3D id="chart-2" />
    </div>
  );
};
   

export default App;
