
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import FinderNavbar from '../components/FacilityFinder/FinderNavbar'
import FacilityCard from '../components/FacilityFinder/FacilityCard'
import FacilityMap from '../components/FacilityFinder/FacilityMap'
import FacilityDetails from '../components/FacilityFinder/FacilityDetails'

import './FacilityFinder.css'

const initialFacilities = [
  {
    id: 1,
    name: 'Central Park Public Restroom',
    address: 'Central Park, Sector 62, Ghaziabad',
    distance: 0.4,
    rating: 4.8,
    hours: '24 Hours',
    open: true,
    wheelchair: true,
    babyChanging: true,
    free: true,
    image: '/images/central-park-restroom.jpg',
    description:
      'A public restroom with wheelchair access and baby-changing facilities.',
    position: { top: '36%', left: '68%' },
  },
  {
    id: 2,
    name: 'City Mall Restroom',
    address: 'City Mall, Sector 63',
    distance: 1.2,
    rating: 4.6,
    hours: '10 AM – 10 PM',
    open: true,
    wheelchair: true,
    babyChanging: true,
    free: true,
    image: '/images/city-mall-restroom.jpg',
    description: 'A convenient restroom inside the shopping centre.',
    position: { top: '48%', left: '35%' },
  },
  {
    id: 3,
    name: 'Metro Station Restroom',
    address: 'Sector 62 Metro Station',
    distance: 1.5,
    rating: 4.5,
    hours: '6 AM – 11 PM',
    open: true,
    wheelchair: true,
    babyChanging: true,
    free: false,
    image: '/images/metro-restroom.jpg',
    description:
      'A restroom near the metro station and public transport.',
    position: { top: '63%', left: '27%' },
  },
  {
    id: 4,
    name: 'Community Center',
    address: 'Sector 61, Near Library',
    distance: 2.1,
    rating: 4.4,
    hours: '8 AM – 9 PM',
    open: true,
    wheelchair: true,
    babyChanging: true,
    free: true,
    image: '/images/community-center.jpg',
    description: 'Community facilities near the local library.',
    position: { top: '78%', left: '49%' },
  },
  {
    id: 5,
    name: 'Riverside Park Restroom',
    address: 'Riverside Park, Sector 58',
    distance: 2.3,
    rating: 4.3,
    hours: '8 AM – 8 PM',
    open: false,
    wheelchair: true,
    babyChanging: false,
    free: true,
    image: '/images/riverside-restroom.jpg',
    description: 'A public restroom located inside Riverside Park.',
    position: { top: '85%', left: '69%' },
  },
  {
    id: 6,
    name: 'City Hospital Restroom',
    address: 'City Hospital, Sector 60',
    distance: 2.8,
    rating: 4.2,
    hours: '24 Hours',
    open: true,
    wheelchair: true,
    babyChanging: false,
    free: true,
    image: '/images/hospital-restroom.jpg',
    description: 'A restroom near the main hospital entrance.',
    position: { top: '91%', left: '82%' },
  },
]

const emptyFilters = {
  wheelchair: false,
  babyChanging: false,
  free: false,
  open: false,
}

export default function FacilityFinder() {
  const location = useLocation()

  const [facilities] = useState(initialFacilities)
  const [search, setSearch] = useState('')
  const [locationQuery, setLocationQuery] = useState(
    location.state?.location || '',
  )
  const [filters, setFilters] = useState(emptyFilters)
  const [sortBy, setSortBy] = useState('nearest')
  const [selectedId, setSelectedId] = useState(1)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('accessfind-favorites') || '[]',
      )
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (location.state?.location) {
      setLocationQuery(location.state.location)
    }
  }, [location.state])

  useEffect(() => {
    localStorage.setItem(
      'accessfind-favorites',
      JSON.stringify(favorites),
    )
  }, [favorites])

  const filteredFacilities = useMemo(() => {
    const query = `${search} ${locationQuery}`
      .trim()
      .toLowerCase()

    const results = facilities.filter((facility) => {
      const matchesSearch =
        !query ||
        facility.name.toLowerCase().includes(query) ||
        facility.address.toLowerCase().includes(query)

      const matchesWheelchair =
        !filters.wheelchair || facility.wheelchair

      const matchesBabyChanging =
        !filters.babyChanging || facility.babyChanging

      const matchesFree = !filters.free || facility.free
      const matchesOpen = !filters.open || facility.open

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
        return a.distance - b.distance
      }

      if (sortBy === 'rating') {
        return b.rating - a.rating
      }

      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }

      return 0
    })
  }, [facilities, search, locationQuery, filters, sortBy])

  function toggleFilter(filterName) {
    setFilters((current) => ({
      ...current,
      [filterName]: !current[filterName],
    }))
  }

  function clearFilters() {
    setSearch('')
    setLocationQuery('')
    setFilters({ ...emptyFilters })
    setSortBy('nearest')
    setShowSaved(false)
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

  useEffect(() => {
    function showSavedFacilities() {
      setSearch('')
      setLocationQuery('')
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
        filters={filters}
        toggleFilter={toggleFilter}
        clearFilters={clearFilters}
      />

      <div
        className={`finder-layout ${
          detailsOpen ? '' : 'details-collapsed'
        }`}
      >
        {/* Facility list */}
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
                <option value="rating">Highest Rated</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>

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
            {visibleFacilities.length > 0 ? (
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
            ) : (
              <div className="finder-empty-state">
                <h3>
                  {showSaved
                    ? 'No saved facilities'
                    : 'No facilities found'}
                </h3>

                <p>
                  {showSaved
                    ? 'Save a facility to find it here later.'
                    : 'Try changing your search or clearing some filters.'}
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  {showSaved ? 'Show all facilities' : 'Clear filters'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Map */}
        <section className="finder-map-panel">
          <FacilityMap
            facilities={visibleFacilities}
            selectedFacility={visibleSelectedFacility}
            onSelectFacility={selectFacility}
          />
        </section>

        {/* Details open only after selecting a facility */}
        {detailsOpen && (
          <FacilityDetails
            facility={visibleSelectedFacility}
            isFavorite={
              visibleSelectedFacility
                ? favorites.includes(visibleSelectedFacility.id)
                : false
            }
            onFavorite={() => {
              if (visibleSelectedFacility) {
                toggleFavorite(visibleSelectedFacility.id)
              }
            }}
            onClose={() => setDetailsOpen(false)}
          />
        )}
      </div>
    </main>
  )
}
