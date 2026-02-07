import React from 'react'
import { Button } from '@mui/material'
import { generatePdf } from '../utils/pdf'

export default function PdfButton() {
  return (
    <Button variant="outlined" onClick={() => generatePdf()}>
      Download PDF Report
    </Button>
  )
}