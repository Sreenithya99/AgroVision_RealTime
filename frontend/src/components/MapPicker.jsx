import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import { TextField, Button, Box, Alert } from '@mui/material'
import { searchLocation } from '../utils/api'
import 'leaflet/dist/leaflet.css'

function ClickHandler({ setLatlon }) {
  useMapEvents({
    click(e) {
      setLatlon({ lat: e.latlng.lat, lon: e.latlng.lng })
    }
  })
  return null
}

function MapUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, 10)
  }, [center, map])
  return null
}

export default function MapPicker({ latlon, setLatlon }) {
  const [query, setQuery] = useState('')
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    setError(null)
    if (!query) return

    // Check if query is "lat, lon" format
    const coords = query.split(',').map(n => parseFloat(n.trim()))
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      setLatlon({ lat: coords[0], lon: coords[1] })
      return
    }

    // Otherwise search by name
    const result = await searchLocation(query)
    if (result) {
      setLatlon({ lat: result.lat, lon: result.lon })
    } else {
      setError('Location not found')
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField 
          size="small" 
          fullWidth 
          label="Search location or lat,lon" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="outlined" onClick={handleSearch}>Search</Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
      <MapContainer center={[latlon.lat, latlon.lon]} zoom={8} style={{ height: 300 }}>
        <TileLayer
  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
  attribution="&copy; OpenStreetMap contributors &copy; CARTO"
/>
        <ClickHandler setLatlon={setLatlon} />
        <MapUpdater center={[latlon.lat, latlon.lon]} />
        <Marker position={[latlon.lat, latlon.lon]} />
      </MapContainer>
    </Box>
  )
}