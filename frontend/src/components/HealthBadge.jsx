import React from 'react'
import { Chip } from '@mui/material'

export default function HealthBadge({ status = 'Unknown' }) {
  const color = status === 'Good' ? 'success' : status === 'Moderate' ? 'warning' : status === 'Poor' ? 'error' : 'default'
  return <Chip label={status} color={color} />
}