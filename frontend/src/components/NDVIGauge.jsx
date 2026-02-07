import React from 'react'
import { Box } from '@mui/material'

export default function NDVIGauge({ value = 0 }) {
  const pct = Math.round(((value + 1) / 2) * 100) // map [-1,1] -> [0,100]
  const color = value >= 0.6 ? '#2e7d32' : value >= 0.3 ? '#f9a825' : '#c62828'
  return (
    <Box>
      <Box sx={{ fontSize: 36, fontWeight: 'bold', color }}>{value.toFixed(3)}</Box>
      <Box sx={{ width: '100%', height: 10, background: '#eee', borderRadius: 8 }}>
        <Box sx={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 8 }} />
      </Box>
    </Box>
  )
}