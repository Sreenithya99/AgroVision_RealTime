import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

export default function Loader() {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight={300} flexDirection="column">
      <CircularProgress />
      <Typography sx={{ mt: 1 }}>Fetching real-time data...</Typography>
    </Box>
  )
}