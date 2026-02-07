import React from 'react'
import { FormControlLabel, Switch } from '@mui/material'

export default function ModeToggle({ mode, setMode }) {
  return (
    <FormControlLabel
      control={<Switch checked={mode === 'dark'} onChange={() => setMode(mode === 'light' ? 'dark' : 'light')} />}
      label="Dark Mode"
    />
  )
}