const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export async function fetchNDVI(lat, lon) {
  const r = await fetch(`${BASE}/ndvi?lat=${lat}&lon=${lon}`)
  return r.json()
}

export async function fetchWeather(lat, lon) {
  const r = await fetch(`${BASE}/weather?lat=${lat}&lon=${lon}`)
  return r.json()
}

export async function postPredict(body) {
  const r = await fetch(`${BASE}/predict`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  return r.json()
}

export async function fetchHistory(lat, lon, limit = 20) {
  const r = await fetch(`${BASE}/history?lat=${lat}&lon=${lon}&limit=${limit}`)
  const data = await r.json()
  // add timestamp fallback if not present
  return data.map(d => ({ timestamp: d.timestamp || Math.floor(Date.now()/1000), ...d }))
}

export async function fetchLocationName(lat, lon) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
    const data = await r.json()
    return data.display_name || "Unknown Location"
  } catch (e) {
    console.error("Reverse geocoding failed", e)
    return "Unknown Location"
  }
}

export async function searchLocation(query) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
    const data = await r.json()
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), name: data[0].display_name }
    }
    return null
  } catch (e) {
    console.error("Geocoding failed", e)
    return null
  }
}