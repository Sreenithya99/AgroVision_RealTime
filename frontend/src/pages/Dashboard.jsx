import React from 'react'
import { Grid, Paper, Typography } from '@mui/material'
import NDVIGauge from '../components/NDVIGauge.jsx'
import YieldCards from '../components/YieldCards.jsx'
import WeatherPanel from '../components/WeatherPanel.jsx'
import HealthBadge from '../components/HealthBadge.jsx'
import HistoryChart from '../components/HistoryChart.jsx'
import NDVITimeline from '../components/NDVITimeline.jsx'

export default function Dashboard({ ndvi, weather, result, history, locationName }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5" color="primary">
            Report for: {locationName}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">NDVI</Typography>
          <NDVIGauge value={ndvi ?? 0} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Crop Health</Typography>
          <HealthBadge status={result?.health_status || 'Unknown'} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Confidence: {result ? Math.round(result.confidence * 100) : 0}%
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Predicted Yield</Typography>
          <YieldCards yieldTph={result?.predicted_yield_tph ?? 0} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Weather</Typography>
          <WeatherPanel weather={weather} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Prediction History</Typography>
          <HistoryChart history={history} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">NDVI Timeline</Typography>
          <NDVITimeline history={history} />
        </Paper>
      </Grid>
    </Grid>
  )
}