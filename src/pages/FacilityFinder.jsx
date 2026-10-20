
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LocateFixed, LoaderCircle } from 'lucide-react'

import FinderNavbar from '../components/FacilityFinder/FinderNavbar'
import FacilityCard from '../components/FacilityFinder/FacilityCard'
import FacilityMap from '../components/FacilityFinder/FacilityMap'
import FacilityDetails from '../components/FacilityFinder/FacilityDetails'
import { fetchNearbyFacilities } from '../services/facilityApi'

import './FacilityFinder.css'

const emptyFilters = {
  wheelchair: false,
  babyChanging: false,
  free: false,
  open: false,
}

const PHOTON_URL = 'https://photon.komoot.io/api/'
const SEARCH_RADIUS_METERS = 20000

export default function FacilityFinder() {
  const routeLocation = useLocation()

  const [facilities, setFacilities] = useState([])
  // Addresses discovered by Photon are shared between cards and details.
  const [addressOverrides, setAddressOverrides] = useState({})
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ ...emptyFilters })
  const [sortBy, setSortBy] = useState('nearest')
  const [selectedId, setSelectedId] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentLocation, setCurrentLocation] = useState(null)
  const [locationStatus, setLocationStatus] = useState('')

  const requestIdRef = useRef(0)
  const abortControllerRef = useRef(null)

  const [favorites, setFavorites] = useState([])

  // Cancel the previous request when a new request starts.
  const beginRequest = useCallback(() => {
    abortControllerRef.current?.abort()

    const controller = new AbortController()
    abortControllerRef.current = controller

    const requestId = ++requestIdRef.current

    return { controller, requestId }
  }, [])

  // Load real OpenStreetMap facilities around the requested coordinates.
  const loadFacilities = useCallback(
    async (latitude, longitude, label = '', controller = null) => {
      const request = controller
        ? {
            controller,
            requestId: requestIdRef.current,
          }
        : beginRequest()

      const { signal } = request.controller
      const { requestId } = request

      setLoading(true)
      setError('')
      setLocationStatus(label)
      setShowSaved(false)

      try {
        const results = await fetchNearbyFacilities(
          latitude,
          longitude,
          SEARCH_RADIUS_METERS,
          signal,
        )

        if (
          signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return
        }

        setCurrentLocation({
          lat: latitude,
          lng: longitude,
        })

        setFacilities(results)

        setSelectedId((previousId) =>
          results.some((facility) => facility.id === previousId)
            ? previousId
            : results[0]?.id ?? null,
        )

        if (results.length === 0) {
          setError(
            'No mapped public toilets were found within 20 km. Try another location.',
          )
        }
      } catch (err) {
        if (
          err.name === 'AbortError' ||
          requestId !== requestIdRef.current
        ) {
          return
        }

        console.error('Failed to load facilities:', err)

        setError(
          err.message ||
            'Could not load nearby facilities. Please try again.',
        )

        setFacilities([])
        setSelectedId(null)
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false)
        }
      }
    },
    [beginRequest],
  )

  // Handle both autocomplete selections and manually typed locations.
  const searchLocation = useCallback(
    async (selection) => {
      const selectedPlace =
        typeof selection === 'object' && selection !== null
          ? selection
          : null

      const query =
        typeof selection === 'string'
          ? selection.trim()
          : selectedPlace?.query?.trim() ||
            selectedPlace?.label?.trim() ||
            ''

      // An autocomplete selection already includes coordinates.
      if (
        selectedPlace &&
        Number.isFinite(selectedPlace.latitude) &&
        Number.isFinite(selectedPlace.longitude)
      ) {
        const { controller } = beginRequest()

        setSearch('')
        setFilters({ ...emptyFilters })
        setSortBy('nearest')
        setDetailsOpen(false)
        setError('')

        await loadFacilities(
          selectedPlace.latitude,
          selectedPlace.longitude,
          selectedPlace.label || selectedPlace.query || 'Selected location',
          controller,
        )

        return
      }

      if (!query) {
        setError('Enter a location in the navbar search.')
        return
      }

      const { controller, requestId } = beginRequest()

      setLoading(true)
      setError('')
      setLocationStatus(`Searching for ${query}…`)
      setDetailsOpen(false)

      try {
        const params = new URLSearchParams({
          q: query,
          limit: '1',
          lang: 'en',
        })

        const response = await fetch(
          `${PHOTON_URL}?${params.toString()}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(
            'Location search failed. Please try again.',
          )
        }

        const data = await response.json()

        if (
          controller.signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return
        }

        const place = data.features?.[0]
        const coordinates = place?.geometry?.coordinates

        if (
          !Array.isArray(coordinates) ||
          !Number.isFinite(coordinates[0]) ||
          !Number.isFinite(coordinates[1])
        ) {
          throw new Error(
            `We couldn't find "${query}". Try a more specific location.`,
          )
        }

        const properties = place.properties || {}

        const label = [
          properties.name,
          properties.street,
          properties.city ||
            properties.town ||
            properties.village,
          properties.state,
          properties.country,
        ]
          .filter(Boolean)
          .filter(
            (value, index, array) =>
              array.indexOf(value) === index,
          )
          .join(', ') || query

        setSearch('')
        setFilters({ ...emptyFilters })
        setSortBy('nearest')

        await loadFacilities(
          coordinates[1],
          coordinates[0],
          label,
          controller,
        )
      } catch (err) {
        if (
          err.name === 'AbortError' ||
          requestId !== requestIdRef.current
        ) {
          return
        }

        console.error('Location search failed:', err)

        setError(
          err.message || 'Unable to search this location.',
        )
        setLoading(false)
      }
    },
    [beginRequest, loadFacilities],
  )

  // Request the user's actual device location.
  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLoading(false)
      setError(
        'Your browser does not support location access. Search for a place instead.',
      )
      return
    }

    const { controller, requestId } = beginRequest()

    setLoading(true)
    setError('')
    setLocationStatus('Detecting your current location…')

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        if (
          controller.signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return
        }

        const location = {
          lat: coords.latitude,
          lng: coords.longitude,
        }

        // Update the map location immediately.
        setCurrentLocation(location)
        setLocationStatus('Your current location')

        setSearch('')
        setFilters({ ...emptyFilters })
        setSortBy('nearest')
        setDetailsOpen(false)

        await loadFacilities(
          location.lat,
          location.lng,
          'Your current location',
          controller,
        )
      },
      (geoError) => {
        if (
          controller.signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return
        }

        setLoading(false)

        setError(
          geoError.code === 1
            ? 'Location permission was denied. Allow it in browser settings or search for a location.'
            : 'Could not detect your location. Please try again or search for a place.',
        )
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      },
    )
  }, [beginRequest, loadFacilities])

  // On page entry, use the supplied destination or request current location.
  useEffect(() => {
    const stateLocation = routeLocation.state?.location

    if (
      typeof stateLocation === 'string' &&
      stateLocation.trim()
    ) {
      searchLocation(stateLocation)
    } else {
      useCurrentLocation()
    }

    return () => {
      requestIdRef.current += 1
      abortControllerRef.current?.abort()
    }
  }, [
    routeLocation.state?.location,
    searchLocation,
    useCurrentLocation,
  ])

  // Share addresses discovered in FacilityDetails with the facility cards.
  const facilitiesWithAddresses = useMemo(
    () => facilities.map((facility) => ({
      ...facility,
      address: addressOverrides[facility.id] || facility.address,
    })),
    [facilities, addressOverrides],
  )

  const handleAddressFound = useCallback((facilityId, address) => {
    if (!facilityId || !address) return
    setAddressOverrides((current) =>
      current[facilityId] === address
        ? current
        : { ...current, [facilityId]: address },
    )
  }, [])

  // Filter and sort the facilities returned by the API.
  const filteredFacilities = useMemo(() => {
    const query = search.trim().toLowerCase()

    const results = facilitiesWithAddresses.filter((facility) => {
      const name = (facility.name || '').toLowerCase()
      const address = (facility.address || '').toLowerCase()

      const matchesSearch =
        !query ||
        name.includes(query) ||
        address.includes(query)

      const matchesWheelchair =
        !filters.wheelchair || facility.wheelchair === true

      const matchesBabyChanging =
        !filters.babyChanging || facility.babyChanging === true

      const matchesFree =
        !filters.free || facility.free === true

      const matchesOpen =
        !filters.open || facility.open === true

      return (
        matchesSearch &&
        matchesWheelchair &&
        matchesBabyChanging &&
        matchesFree &&
        matchesOpen
      )
    })

    return [...results].sort((a, b) => {
      if (sortBy === 'nearest') {
        return (
          (a.distance ?? Number.POSITIVE_INFINITY) -
          (b.distance ?? Number.POSITIVE_INFINITY)
        )
      }

      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '')
      }

      return 0
    })
  }, [facilitiesWithAddresses, search, filters, sortBy])

  function toggleFilter(filterName) {
    setFilters((current) => ({
      ...current,
      [filterName]: !current[filterName],
    }))
  }

  function clearFilters() {
    setSearch('')
    setFilters({ ...emptyFilters })
    setSortBy('nearest')
    setShowSaved(false)
    setError('')
  }

  function toggleFavorite(facilityId) {
    setFavorites((current) =>
      current.includes(facilityId)
        ? current.filter((id) => id !== facilityId)
        : [...current, facilityId],
    )
  }

  function selectFacility(facility) {
    setSelectedId(facility.id)
    setDetailsOpen(true)
  }

  // Respond to the navbar's saved-facilities action.
  useEffect(() => {
    function showSavedFacilities() {
      setSearch('')
      setFilters({ ...emptyFilters })
      setShowSaved(true)
    }

    window.addEventListener(
      'accessfind:show-saved',
      showSavedFacilities,
    )

    return () => {
      window.removeEventListener(
        'accessfind:show-saved',
        showSavedFacilities,
      )
    }
  }, [])

  const visibleFacilities = showSaved
    ? filteredFacilities.filter((facility) =>
        favorites.includes(facility.id),
      )
    : filteredFacilities

  const visibleSelectedFacility =
    visibleFacilities.find(
      (facility) => facility.id === selectedId,
    ) ||
    visibleFacilities[0] ||
    null

  return (
    <main className="finder-page">
      <FinderNavbar
        savedCount={favorites.length}
        search={search}
        setSearch={setSearch}
        onSearch={searchLocation}
        filters={filters}
        toggleFilter={toggleFilter}
        clearFilters={clearFilters}
      />

      <div
        className={`finder-layout ${
          detailsOpen ? '' : 'details-collapsed'
        }`}
      >
        <section className="facility-list">
          <div className="facility-list-header">
            <div>
              <h2>{visibleFacilities.length} facilities found</h2>
            </div>

            <label className="finder-sort">
              <span>Sort by</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="nearest">Nearest First</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>

          {loading && (
            <div
              role="status"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '24px 8px',
                color: '#475569',
              }}
            >
              <LoaderCircle size={20} className="animate-spin" />
              Finding public toilets within 20 km…
            </div>
          )}

          {!loading && error && (
            <div
              role="alert"
              style={{
                padding: '16px',
                marginBottom: '16px',
                borderRadius: '12px',
                background: '#fff4ed',
                color: '#9a3412',
              }}
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={() => {
                  if (currentLocation) {
                    loadFacilities(
                      currentLocation.lat,
                      currentLocation.lng,
                      locationStatus,
                    )
                  } else {
                    useCurrentLocation()
                  }
                }}
              >
                Try again
              </button>
            </div>
          )}

          {showSaved && (
            <div className="saved-view-heading">
              Saved facilities
              <button
                type="button"
                onClick={() => setShowSaved(false)}
              >
                Show all
              </button>
            </div>
          )}

          <div className="facility-list-items">
            {!loading && visibleFacilities.length > 0 ? (
              visibleFacilities.map((facility) => (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                  selected={
                    visibleSelectedFacility?.id === facility.id
                  }
                  isFavorite={favorites.includes(facility.id)}
                  onSelect={() => selectFacility(facility)}
                  onFavorite={() => toggleFavorite(facility.id)}
                />
              ))
            ) : !loading && !error ? (
              <div className="finder-empty-state">
                <h3>
                  {showSaved
                    ? 'No saved facilities'
                    : 'No facilities found'}
                </h3>

                <p>
                  {showSaved
                    ? 'Save a facility to find it here later.'
                    : 'Try another location or change your filters.'}
                </p>

                <button type="button" onClick={clearFilters}>
                  {showSaved ? 'Show all facilities' : 'Clear filters'}
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="finder-map-panel">
          <FacilityMap
            facilities={visibleFacilities}
            selectedFacility={visibleSelectedFacility}
            onSelectFacility={selectFacility}
            currentLocation={currentLocation}
          />
        </section>

        {detailsOpen && visibleSelectedFacility && (
          <FacilityDetails
            facility={visibleSelectedFacility}
            isFavorite={favorites.includes(
              visibleSelectedFacility.id,
            )}
            onFavorite={() =>
              toggleFavorite(visibleSelectedFacility.id)
            }
            onClose={() => setDetailsOpen(false)}
            onAddressFound={handleAddressFound}
          />
        )}
      </div>
    </main>
  )
}
