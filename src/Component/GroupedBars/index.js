import lcjs from "@arction/lcjs";
import { createWaterDropDataGenerator } from "@arction/xydata";

import React, { useRef, useEffect } from "react";

const {
  lightningChart,
  emptyLine,
  AutoCursorModes,
  UIOrigins,
  LegendBoxBuilders,
  AxisScrollStrategies,
  AxisTickStrategies,
  UIElementBuilders,
  Themes,
} = lcjs;

const GroupedBars = (props) => {
  const { id } = props;
  const chartRef = useRef(undefined);
  const categories = ["Engineers", "Sales", "Marketing"];
  const data = [[48, 27, 24], [19, 40, 14], [33, 33, 62]];

  const groups = ["Finland", "Germany", "UK"]


  useEffect(() => {
    const lc = lightningChart();

    let barChart;
    {
      barChart = (options) => {
        const figureThickness = 10;
        const figureGap = figureThickness * 0.25;
        const groupGap = figureGap * 3.0;
        const groups = [];
        const categories = [];

        const chart = lc
          .ChartXY(options)
          .setTitle("Grouped Bars (Employee Count)")
          .setAutoCursorMode(AutoCursorModes.onHover)
          .setMouseInteractions(false)
          .setPadding({ bottom: 30 });

        const axisX = chart
          .getDefaultAxisX()
          .setMouseInteractions(false)
          .setScrollStrategy(undefined)
          .setTickStrategy(AxisTickStrategies.Empty);

        const axisY = chart
          .getDefaultAxisY()
          .setMouseInteractions(false)
          .setTitle("Number of Employees")
          .setInterval(0, 70)
          .setScrollStrategy(AxisScrollStrategies.fitting);

        chart.setAutoCursor((cursor) =>
          cursor
            .disposePointMarker()
            .disposeTickMarkerX()
            .disposeTickMarkerY()
            .setGridStrokeXStyle(emptyLine)
            .setGridStrokeYStyle(emptyLine)
            .setResultTable((table) => {
              table.setOrigin(UIOrigins.CenterBottom);
            })
        );
        const createSeriesForCategory = (category) => {
          const series = chart.addRectangleSeries();
          series.setCursorResultTableFormatter((builder, series, figure) => {
            let entry = {
              name: category.name,
              value: category.data[category.figures.indexOf(figure)],
            };
            return builder
              .addRow("Department:", entry.name)
              .addRow("# of employees:", String(entry.value));
          });
          return series;
        };
        const legendBox = chart
          .addLegendBox(LegendBoxBuilders.VerticalLegendBox)
          .setAutoDispose({
            type: "max-width",
            maxWidth: 0.2,
          })
          .setTitle("Department");

        const redraw = () => {
          let x = 0;
          for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
            const group = groups[groupIndex];
            const xStart = x;
            for (const category of categories) {
              const value = category.data[groupIndex];
              if (value !== undefined) {
                // Position figure of respective value.
                const figure = category.figures[groupIndex];
                figure.setDimensions({
                  x,
                  y: 0,
                  width: figureThickness,
                  height: value,
                });
                x += figureThickness + figureGap;
              }
            }
            group.tick.setValue((xStart + x - figureGap) / 2);

            x += groupGap;
          }
          axisX.setInterval(-(groupGap + figureGap), x);
        };
        const addGroups = (names) => {
          for (const name of names)
            groups.push({
              name,
              tick: axisX
                .addCustomTick(UIElementBuilders.AxisTick)
                .setGridStrokeLength(0)
                .setTextFormatter((_) => name),
            });
        };
        const addCategory = (entry) => {
          const series = createSeriesForCategory(entry).setName(entry.name);
          entry.figures = entry.data.map((value) =>
            series.add({ x: 0, y: 0, width: 0, height: 0 })
          );
          legendBox.add(series);
          categories.push(entry);
          redraw();
        };
        return {
          addCategory,
          addGroups,
        };
      };
    }

    const chart = barChart({});
    chart.addGroups(groups);

    data.forEach((data, i) =>
      chart.addCategory({
        name: categories[i],
        data,
      })
    );

    chartRef.current = { chart };

    return () => {
      lc.dispose();
      chartRef.current = undefined;
    };
  }, [id]);

  useEffect(() => {
    const components = chartRef.current;
    if (!components) return;
    const { series } = components;
  }, [data, chartRef]);

  return <div id={id} className="chart"></div>;
};

export default GroupedBars;
