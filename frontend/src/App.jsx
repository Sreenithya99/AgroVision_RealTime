import React, { useState, useEffect, useCallback } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box, Container, Button, Grid, Paper } from '@mui/material'
import { getTheme } from './theme'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ModeToggle from './components/ModeToggle.jsx'
import Controls from './components/Controls.jsx'
import MapPicker from './components/MapPicker.jsx'
import Loader from './components/Loader.jsx'
import PdfButton from './components/PdfButton.jsx'
import { fetchNDVI, fetchWeather, postPredict, fetchHistory, fetchLocationName } from './utils/api'

function App() {
  const [mode, setMode] = useState('light')
  const [latlon, setLatlon] = useState({ lat: 28.6139, lon: 77.2090 }) // Default: New Delhi
  const [locationName, setLocationName] = useState('New Delhi, India')
  const [crop, setCrop] = useState('Wheat')
  const [season, setSeason] = useState('Rabi')
  const [loading, setLoading] = useState(false)
  const [ndvi, setNdvi] = useState(null)
  const [weather, setWeather] = useState(null)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  const refreshAll = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch location name in parallel or separate, but here we do it first for UI update
      fetchLocationName(latlon.lat, latlon.lon).then(setLocationName)

      const [ndviRes, weatherRes] = await Promise.all([
        fetchNDVI(latlon.lat, latlon.lon),
        fetchWeather(latlon.lat, latlon.lon),
      ])
      setNdvi(ndviRes.ndvi)
      setWeather(weatherRes)
      const predictRes = await postPredict({
        lat: latlon.lat, lon: latlon.lon, crop, season
      })
      setResult(predictRes)
      const hist = await fetchHistory(latlon.lat, latlon.lon)
      setHistory(hist)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [latlon, crop, season])

  useEffect(() => {
    refreshAll()
    const interval = setInterval(refreshAll, 300000) // 5 minutes
    return () => clearInterval(interval)
  }, [refreshAll])

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <Landing />
      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <ModeToggle mode={mode} setMode={setMode} />
          <PdfButton />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <MapPicker latlon={latlon} setLatlon={setLatlon} />
              <Controls crop={crop} setCrop={setCrop} season={season} setSeason={setSeason} />
              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={refreshAll}>
                Predict
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            {loading ? <Loader /> : (
              <Dashboard 
                ndvi={ndvi} 
                weather={weather} 
                result={result} 
                history={history} 
                locationName={locationName} 
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

export default App