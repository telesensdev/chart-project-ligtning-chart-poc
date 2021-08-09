import { lightningChart } from '@arction/lcjs'
import React, { useRef, useEffect } from 'react'

const Chart = (props) => {
    const { data, id } = props
    const chartRef = useRef(undefined)
  
    useEffect(() => {
      const chart = lightningChart().ChartXY({ container: id })
      const series = chart.addLineSeries()
      chartRef.current = { chart, series }
  
      return () => {
        console.log('destroy chart')
        chart.dispose()
        chartRef.current = undefined
      }
    }, [id])
  
    useEffect(() => {
      const components = chartRef.current
      if (!components) return
      const { series } = components
      console.log('set chart data', data)
      series.clear().add(data)
    
    }, [data, chartRef])
  
    return <div id={id} className='chart'></div>
}

export default Chart
