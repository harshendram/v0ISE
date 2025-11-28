import { NextRequest, NextResponse } from "next/server"

interface BloodCenter {
  name: string
  location: string
  phone: string
  hours: string
  distance: number
  website?: string
  lat: number
  lng: number
}

interface OverpassElement {
  type: string
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags: Record<string, string>
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

async function geocodeLocation(locationQuery: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // Use Nominatim (OpenStreetMap's free geocoder)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationQuery)}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "ArogyaSetu-BloodBankLocator/1.0",
        },
      }
    )

    if (!response.ok) return null

    const data = await response.json()
    if (data.length === 0) return null

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    }
  } catch (error) {
    console.error("Geocoding error:", error)
    return null
  }
}

async function findBloodCenters(lat: number, lng: number, radiusKm: number): Promise<BloodCenter[]> {
  try {
    // Create bounding box around the location
    const offset = radiusKm / 111.0 // Rough conversion to degrees
    const south = lat - offset
    const west = lng - offset
    const north = lat + offset
    const east = lng + offset

    // Overpass QL query (same as voisehack)
    const overpassQuery = `
    [out:json][timeout:25];
    (
      nwr["amenity"="hospital"]["healthcare:speciality"~"blood_donation|blood_bank"](${south},${west},${north},${east});
      nwr["amenity"="blood_bank"](${south},${west},${north},${east});
      nwr["healthcare"="blood_donation"](${south},${west},${north},${east});
      nwr["amenity"="clinic"]["healthcare:speciality"~"blood_donation|blood_bank"](${south},${west},${north},${east});
      nwr["amenity"="hospital"]["name"~"blood.*bank|blood.*donation|blood.*center"](${south},${west},${north},${east});
      nwr["amenity"="clinic"]["name"~"blood.*bank|blood.*donation|blood.*center"](${south},${west},${north},${east});
      nwr["healthcare"="centre"]["healthcare:speciality"~"blood"](${south},${west},${north},${east});
    );
    out center;
    `

    const overpassUrl = "http://overpass-api.de/api/interpreter"
    const response = await fetch(overpassUrl, {
      method: "POST",
      body: overpassQuery,
      headers: {
        "User-Agent": "ArogyaSetu-BloodBankLocator/1.0",
      },
    })

    if (!response.ok) {
      console.error(`Overpass API error: ${response.status}`)
      return []
    }

    const data = await response.json()
    if (!data.elements || data.elements.length === 0) {
      return []
    }

    const centers: BloodCenter[] = []
    const userLocation = { lat, lng }
    const financialKeywords = [
      "state bank",
      "hdfc bank",
      "icici bank",
      "axis bank",
      "canara bank",
      "corporation bank",
      "syndicate bank",
      "yes bank",
      "reserve bank",
      "south indian bank",
      "union bank",
      "indian bank",
      "punjab bank",
    ]
    const medicalKeywords = [
      "hospital",
      "clinic",
      "blood bank",
      "blood donation",
      "blood center",
      "blood centre",
      "medical",
      "health",
    ]

    for (const element of data.elements as OverpassElement[]) {
      let centerLat: number | null = null
      let centerLon: number | null = null

      // Get coordinates
      if (element.type === "way" || element.type === "relation") {
        if (element.center) {
          centerLat = element.center.lat
          centerLon = element.center.lon
        } else {
          continue
        }
      } else if (element.lat !== undefined && element.lon !== undefined) {
        centerLat = element.lat
        centerLon = element.lon
      } else {
        continue
      }

      // Calculate distance
      const distance = calculateDistance(lat, lng, centerLat, centerLon)

      if (distance <= radiusKm) {
        const tags = element.tags || {}
        const name = tags.name || "Unnamed Blood Center"
        const nameLower = name.toLowerCase()
        const amenity = (tags.amenity || "").toLowerCase()

        // Skip financial institutions
        if (amenity === "bank" || financialKeywords.some((kw) => nameLower.includes(kw))) {
          continue
        }

        // Only include if it's likely a medical facility
        const healthcare = (tags.healthcare || "").toLowerCase()
        const speciality = (tags["healthcare:speciality"] || "").toLowerCase()

        if (
          !medicalKeywords.some((kw) => nameLower.includes(kw) || amenity.includes(kw)) &&
          !("blood" in healthcare || "blood" in speciality)
        ) {
          continue
        }

        const center: BloodCenter = {
          name: name,
          location: tags["addr:full"] || `${tags["addr:street"] || ""}, ${tags["addr:city"] || ""}`.replace(/^,\s*/, ""),
          phone: tags.phone || tags["contact:phone"] || "N/A",
          hours: tags.opening_hours || "N/A",
          distance: Math.round(distance * 100) / 100,
          website: tags.website || tags["contact:website"],
          lat: centerLat,
          lng: centerLon,
        }

        centers.push(center)
      }
    }

    // Sort by distance and return top 10
    centers.sort((a, b) => a.distance - b.distance)
    return centers.slice(0, 10)
  } catch (error) {
    console.error("Blood center search error:", error)
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { location, radius = 5 } = body

    if (!location) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 })
    }

    if (radius < 1 || radius > 50) {
      return NextResponse.json({ error: "Radius must be between 1 and 50 km" }, { status: 400 })
    }

    // Geocode the location
    const coords = await geocodeLocation(location)
    if (!coords) {
      return NextResponse.json({ error: `Could not find location: ${location}` }, { status: 404 })
    }

    // Find blood centers using Overpass API
    const centers = await findBloodCenters(coords.lat, coords.lng, radius)

    return NextResponse.json({
      success: true,
      location,
      coordinates: coords,
      radius,
      centers,
      totalFound: centers.length,
    })
  } catch (error) {
    console.error("Blood bank search error:", error)
    return NextResponse.json({ error: "Failed to search blood banks" }, { status: 500 })
  }
}
