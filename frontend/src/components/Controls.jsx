import React from 'react'
import { Box, TextField, MenuItem } from '@mui/material'

const crops = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton']
const seasons = ['Kharif', 'Rabi', 'Zaid', 'Summer', 'Winter']

export default function Controls({ crop, setCrop, season, setSeason }) {
  return (
    <Box sx={{ mt: 2 }}>
      <TextField select fullWidth label="Crop" value={crop} onChange={(e) => setCrop(e.target.value)} sx={{ mb: 2 }}>
        {crops.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
      </TextField>
      <TextField select fullWidth label="Season" value={season} onChange={(e) => setSeason(e.target.value)}>
        {seasons.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
      </TextField>
    </Box>
  )
}