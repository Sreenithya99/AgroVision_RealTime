import React from 'react'
import { Box, Typography } from '@mui/material'

export default function YieldCards({ yieldTph = 0 }) {
  return (
    <Box>
      <Typography variant="h4">{yieldTph.toFixed(2)} t/ha</Typography>
      <Typography variant="body2">Predicted yield (tons/hectare)</Typography>
    </Box>
  )
}