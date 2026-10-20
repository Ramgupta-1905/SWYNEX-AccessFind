
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

const DEFAULT_SEARCH_RADIUS_METERS = 20000
const EARTH_RADIUS_KM = 6371

// Cache successful searches for 5 minutes.
const CACHE_TTL_MS = 5 * 60 * 1000
const MAX_CACHE_ENTRIES = 30

const facilityCache = new Map()

function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180

  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2

  const safeA = Math.min(1, Math.max(0, a))

  return (
    EARTH_RADIUS_KM *
    2 *
    Math.atan2(Math.sqrt(safeA), Math.sqrt(1 - safeA))
  )
}

function cleanValue(value) {
  if (typeof value !== 'string') return null

  const cleaned = value.trim()
  return cleaned.length > 0 ? cleaned : null
}

function getAddress(tags) {
  const street = [
    tags['addr:housenumber'],
    tags['addr:street'],
  ]
    .map(cleanValue)
    .filter(Boolean)
    .join(' ')

  const locality = [
    tags['addr:suburb'] || tags['addr:neighbourhood'],
    tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
    tags['addr:state'],
    tags['addr:postcode'],
    tags['addr:country'],
  ]
    .map(cleanValue)
    .filter(Boolean)

  const parts = [street, ...locality].filter(Boolean)

  return [...new Set(parts)].join(', ') || null
}

function getBooleanTag(value) {
  if (typeof value !== 'string') return null

  const normalized = value.trim().toLowerCase()

  if (['yes', 'designated', 'permissive'].includes(normalized)) {
    return true
  }

  if (['no', 'private'].includes(normalized)) {
    return false
  }

  return null
}

function getFee(tags) {
  const fee = cleanValue(tags.fee)?.toLowerCase()

  // true means free; false means a fee is required.
  if (fee === 'no') return true
  if (fee === 'yes') return false

  return null
}

function getCoordinates(element) {
  const rawLat = element.lat ?? element.center?.lat
  const rawLng = element.lon ?? element.center?.lon

  if (rawLat == null || rawLng == null) return null

  const lat = Number(rawLat)
  const lng = Number(rawLng)

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return null
  }

  return { lat, lng }
}

function mapFacility(element, referenceLocation) {
  const tags = element.tags || {}
  const coordinates = getCoordinates(element)

  if (!coordinates) return null

  const name =
    cleanValue(tags.name) ||
    cleanValue(tags['name:en']) ||
    cleanValue(tags.operator) ||
    null

  const distance = calculateDistance(
    referenceLocation.lat,
    referenceLocation.lng,
    coordinates.lat,
    coordinates.lng,
  )

  if (distance > referenceLocation.radiusKm) return null

  return {
    id: `osm-${element.type}-${element.id}`,
    osmId: element.id,
    osmType: element.type,
    source: 'OpenStreetMap',

    name: name || 'Public toilet',
    hasName: Boolean(name),

    address: getAddress(tags),
    coordinates,
    distance,

    // OSM does not generally provide ratings or live status.
    rating: null,
    reviewCount: null,
    hours: cleanValue(tags.opening_hours),
    open: null,

    wheelchair: getBooleanTag(tags.wheelchair),
    babyChanging: getBooleanTag(tags.changing_table),
    free: getFee(tags),

    // Only use a photo URL explicitly present in OSM.
    image: cleanValue(tags.image),
    description: cleanValue(tags.description),

    access: cleanValue(tags.access),
    operator: cleanValue(tags.operator),
    toilets: cleanValue(tags.toilets),
    changingTable: cleanValue(tags.changing_table),

    tags: { ...tags },

    osmUrl: `https://www.openstreetmap.org/${element.type}/${element.id}`,
  }
}

function createCacheKey(latitude, longitude, radius) {
  return `${latitude}:${longitude}:${radius}`
}

function getCachedFacilities(key) {
  const cached = facilityCache.get(key)

  if (!cached) return null

  if (Date.now() - cached.timestamp >= CACHE_TTL_MS) {
    facilityCache.delete(key)
    return null
  }

  // Refresh insertion order so recently used entries stay in the cache.
  facilityCache.delete(key)
  facilityCache.set(key, cached)

  // Return copies so consumers cannot modify the cached top-level data.
  return cached.facilities.map((facility) => ({
    ...facility,
    coordinates: { ...facility.coordinates },
    tags: { ...facility.tags },
  }))
}

function cacheFacilities(key, facilities) {
  // Evict the oldest entry when the cache reaches its size limit.
  if (
    !facilityCache.has(key) &&
    facilityCache.size >= MAX_CACHE_ENTRIES
  ) {
    const oldestKey = facilityCache.keys().next().value

    if (oldestKey !== undefined) {
      facilityCache.delete(oldestKey)
    }
  }

  facilityCache.set(key, {
    timestamp: Date.now(),
    facilities,
  })
}

export async function fetchNearbyFacilities(
  latitude,
  longitude,
  radius = DEFAULT_SEARCH_RADIUS_METERS,
  signal,
) {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error(
      'A valid location is required to find nearby facilities.',
    )
  }

  if (!Number.isFinite(radius) || radius <= 0) {
    throw new Error('The search radius must be a positive number.')
  }

  if (signal?.aborted) {
    throw new DOMException('Request cancelled.', 'AbortError')
  }

  const cacheKey = createCacheKey(latitude, longitude, radius)
  const cachedFacilities = getCachedFacilities(cacheKey)

  if (cachedFacilities !== null) {
    return cachedFacilities
  }

  const query = `
    [out:json][timeout:60];
    (
      node["amenity"="toilets"](around:${radius},${latitude},${longitude});
      way["amenity"="toilets"](around:${radius},${latitude},${longitude});
      relation["amenity"="toilets"](around:${radius},${latitude},${longitude});
    );
    out center tags;
  `

  let response

  try {
    response = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: `data=${encodeURIComponent(query)}`,
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error

    throw new Error(
      'Could not connect to the facility service. Check your connection and try again.',
    )
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        'The facility service is busy. Please wait a little and try again.',
      )
    }

    if (response.status >= 500) {
      throw new Error(
        'The facility service is temporarily unavailable. Please try again shortly.',
      )
    }

    throw new Error(
      `The facility service returned an error (${response.status}).`,
    )
  }

  let data

  try {
    data = await response.json()
  } catch {
    throw new Error(
      'The facility service returned invalid data. Please try again.',
    )
  }

  if (data.remark) {
    throw new Error(
      'The facility service could not complete this search. Please try again.',
    )
  }

  if (!Array.isArray(data.elements)) {
    throw new Error(
      'The facility service returned an unexpected response.',
    )
  }

  const uniqueElements = new Map()

  for (const element of data.elements) {
    if (!element?.type || element.id == null) continue

    const key = `${element.type}-${element.id}`

    if (!uniqueElements.has(key)) {
      uniqueElements.set(key, element)
    }
  }

  const referenceLocation = {
    lat: latitude,
    lng: longitude,
    radiusKm: radius / 1000,
  }

  const facilities = [...uniqueElements.values()]
    .map((element) => mapFacility(element, referenceLocation))
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)

  // Cache only a completed, successful response.
  cacheFacilities(cacheKey, facilities)

  return facilities.map((facility) => ({
    ...facility,
    coordinates: { ...facility.coordinates },
    tags: { ...facility.tags },
  }))
}
