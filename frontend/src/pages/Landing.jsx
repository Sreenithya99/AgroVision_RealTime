import React from 'react'
import { Box, Typography } from '@mui/material'

export default function Landing() {
  return (
    <Box sx={{
      background: 'linear-gradient(135deg,#1b5e20,#4caf50)',
      color: '#fff',
      p: 4,
      textAlign: 'center'
    }}>
      <Typography variant="h3" fontWeight="bold">
        🌾 AgroVision RT
      </Typography>
      <Typography variant="h6">
        Real-Time Crop Yield Prediction Platform
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography>
          Select a location to get NDVI, weather, crop health, and predicted yield instantly.
        </Typography>
      </Box>
    </Box>
  )
}