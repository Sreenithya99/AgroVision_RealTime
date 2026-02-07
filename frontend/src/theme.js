import { createTheme } from '@mui/material/styles'

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: mode === 'light' ? '#2e7d32' : '#81c784' },
    secondary: { main: '#64b5f6' }
  }
})