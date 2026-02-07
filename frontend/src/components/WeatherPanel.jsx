import React from 'react'
import { Grid, Typography } from '@mui/material'

export default function WeatherPanel({ weather }) {
  if (!weather) return <Typography variant="body2">Loading weather...</Typography>
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}><Typography>Temp: {Math.round(weather.temperature)} °C</Typography></Grid>
      <Grid item xs={4}><Typography>Rain: {weather.rainfall ?? 0} mm</Typography></Grid>
      <Grid item xs={4}><Typography>Humidity: {Math.round(weather.humidity)}%</Typography></Grid>
    </Grid>
  )
}