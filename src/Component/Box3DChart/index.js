import lcjs  from '@arction/lcjs';
import {createWaterDropDataGenerator}  from '@arction/xydata'

import React, { useRef, useEffect } from 'react'

const {
  lightningChart,
  AxisScrollStrategies,
  PalettedFill,
  ColorRGBA,
  LUT,
  UILayoutBuilders,
  UIOrigins,
  UIElementBuilders,
  Themes
} = lcjs;

const Box3D = (props) => {
    const { data, id } = props
    const chartRef = useRef(undefined)
    const resolution = 10;

    const lut = new LUT( {
      steps: [
          { value: 0, color: ColorRGBA( 0, 0, 0 ) },
          { value: 30, color: ColorRGBA( 255, 255, 0 ) },
          { value: 45, color: ColorRGBA( 255, 204, 0 ) },
          { value: 60, color: ColorRGBA( 255, 128, 0 ) },
          { value: 100, color: ColorRGBA( 255, 0, 0 ) }
      ],
      interpolate: true
  } )

    useEffect(() => {
      const chart3D = lightningChart().Chart3D({}).setTitle( 'BoxSeries3D with rounded edges enabled' );
      chart3D.getDefaultAxisY().setScrollStrategy( AxisScrollStrategies.expansion ).setTitle( 'Height' );
      chart3D.getDefaultAxisX().setTitle( 'X' );
      chart3D.getDefaultAxisZ().setTitle( 'Z' );
      const boxSeries = chart3D.addBoxSeries();
      boxSeries.setFillStyle( new PalettedFill({lut, lookUpProperty: 'y' })).setRoundedEdges( 0.4 );

      const legend = chart3D.addLegendBox().setAutoDispose({type: 'max-width', maxWidth: 0.30}).add(chart3D);
      
      createWaterDropDataGenerator().setRows( resolution ).setColumns( resolution ).generate().then( waterdropData => {
            let t = 0
            const step = () => {
                const result = []
                for ( let x = 0; x < resolution; x++ ) {
                    for ( let y = 0; y < resolution; y++ ) {
                        const s = 1
                        const height = Math.max(
                            waterdropData[y][x] +
                            50 * Math.sin( ( t + x * .50 ) * Math.PI / resolution ) +
                            20 * Math.sin( ( t + y * 1.0 ) * Math.PI / resolution ), 0 )
                        const box = {
                            xCenter: x,
                            yCenter: height / 2,
                            zCenter: y,
                            xSize: s,
                            ySize: height,
                            zSize: s,
                            // Specify an ID for each Box in order to modify it during later frames, instead of making new Boxes.
                            id: String( result.length ),
                        }
                        result.push( box )
                    }
                }
            
                boxSeries
                    .invalidateData( result )
            
                t += 0.1
                requestAnimationFrame( step )
            }
            step()
        })

      chartRef.current = { chart3D, boxSeries }
  
      return () => {
        chart3D.dispose()
        chartRef.current = undefined
      }
    }, [id])
  
    useEffect(() => {
      const components = chartRef.current
      if (!components) return
      const { series } = components
    }, [data, chartRef])
  
    return <div id={id} className='chart'></div>
}

export default Box3D;
