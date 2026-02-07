import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

export default function HistoryChart({ history }) {
  const data = useMemo(() => {
    const labels = (history || []).map(h => new Date(h.timestamp * 1000).toLocaleString())
    const yields = (history || []).map(h => h.predicted_yield_tph)
    return {
      labels,
      datasets: [{
        label: 'Yield (t/ha)',
        data: yields,
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46,125,50,0.2)',
        tension: 0.3
      }]
    }
  }, [history])

  const options = { responsive: true, plugins: { legend: { position: 'top' } } }
  return <Line data={data} options={options} />
}