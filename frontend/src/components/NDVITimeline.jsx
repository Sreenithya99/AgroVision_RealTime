import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'

export default function NDVITimeline({ history }) {
  const data = useMemo(() => {
    const labels = (history || []).map(h => new Date(h.timestamp * 1000).toLocaleString())
    const ndvi = (history || []).map(h => h.ndvi)
    return {
      labels,
      datasets: [{
        label: 'NDVI',
        data: ndvi,
        borderColor: '#64b5f6',
        backgroundColor: 'rgba(100,181,246,0.2)',
        tension: 0.3
      }]
    }
  }, [history])

  const options = { responsive: true }
  return <Line data={data} options={options} />
}