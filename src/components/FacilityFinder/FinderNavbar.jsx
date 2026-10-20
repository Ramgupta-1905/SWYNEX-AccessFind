
import { useEffect, useRef, useState } from 'react'
import {
  Heart,
  MapPin,
  Search,
  Accessibility,
  Baby,
  Tag,
  Clock3,
  RotateCcw,
  LoaderCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const filterOptions = [
  { key: 'wheelchair', label: 'Wheelchair Access', icon: Accessibility },
  { key: 'babyChanging', label: 'Baby Changing', icon: Baby },
  { key: 'free', label: 'Free to Use', icon: Tag },
  { key: 'open', label: 'Open Now', icon: Clock3 },
]

const PHOTON_URL = 'https://photon.komoot.io/api/'

export default function FinderNavbar({
  savedCount = 0,
  search = '',
  setSearch = () => {},
  onSearch = () => {},
  filters = {},
  toggleFilter = () => {},
  clearFilters = () => {},
}) {
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [suggestionsError, setSuggestionsError] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)

  const wrapperRef = useRef(null)
  const requestIdRef = useRef(0)
  const abortControllerRef = useRef(null)

  // Fetch real location suggestions while the user types.
  useEffect(() => {
    const query = search.trim()
    const requestId = ++requestIdRef.current

    abortControllerRef.current?.abort()
    abortControllerRef.current = null

    setSuggestions([])
    setActiveIndex(-1)
    setSuggestionsError('')

    if (query.length < 3) {
      setSuggestionsLoading(false)
      return
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    const timeoutId = setTimeout(async () => {
      setSuggestionsLoading(true)

      try {
        const params = new URLSearchParams({
          q: query,
          limit: '6',
          lang: 'en',
        })

        const response = await fetch(
          `${PHOTON_URL}?${params.toString()}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error('Location suggestions are temporarily unavailable.')
        }

        const data = await response.json()

        if (
          controller.signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return
        }

        const results = (data.features || [])
          .map((feature, index) => {
            const coordinates = feature.geometry?.coordinates
            const properties = feature.properties || {}

            if (
              !Array.isArray(coordinates) ||
              !Number.isFinite(coordinates[0]) ||
              !Number.isFinite(coordinates[1])
            ) {
              return null
            }

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
                (value, i, values) => values.indexOf(value) === i,
              )
              .join(', ')

            if (!label) return null

            return {
              id: `${coordinates[0]}-${coordinates[1]}-${index}`,
              label,
              latitude: coordinates[1],
              longitude: coordinates[0],
            }
          })
          .filter(Boolean)

        setSuggestions(results)
        setSuggestionsOpen(true)
      } catch (error) {
        if (
          error.name !== 'AbortError' &&
          requestId === requestIdRef.current
        ) {
          setSuggestionsError(
            'Could not load suggestions. You can still submit your search.',
          )
        }
      } finally {
        if (
          !controller.signal.aborted &&
          requestId === requestIdRef.current
        ) {
          setSuggestionsLoading(false)
        }
      }
    }, 350)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [search])

  // Close suggestions when clicking outside the search area.
  useEffect(() => {
    function handleOutsideClick(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setSuggestionsOpen(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  function submitSearch(event) {
    event.preventDefault()

    const query = search.trim()
    if (!query) return

    setSuggestionsOpen(false)
    setActiveIndex(-1)

    // FacilityFinder handles typed location searches.
    onSearch(query)
  }

  function chooseSuggestion(suggestion) {
    setSuggestionsOpen(false)
    setActiveIndex(-1)
    setSuggestions([])
    setSuggestionsLoading(false)

    setSearch(suggestion.label)

    // Send coordinates directly to FacilityFinder.
    onSearch({
      label: suggestion.label,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    })
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setSuggestionsOpen(false)
      setActiveIndex(-1)
      return
    }

    if (event.key === 'ArrowDown' && suggestions.length > 0) {
      event.preventDefault()
      setSuggestionsOpen(true)
      setActiveIndex((current) =>
        current < suggestions.length - 1 ? current + 1 : 0,
      )
      return
    }

    if (event.key === 'ArrowUp' && suggestions.length > 0) {
      event.preventDefault()
      setSuggestionsOpen(true)
      setActiveIndex((current) =>
        current > 0 ? current - 1 : suggestions.length - 1,
      )
      return
    }

    if (event.key === 'Enter' && activeIndex >= 0 && suggestionsOpen) {
      event.preventDefault()
      chooseSuggestion(suggestions[activeIndex])
    }
  }

  function clearSearch() {
    abortControllerRef.current?.abort()
    setSearch('')
    setSuggestions([])
    setSuggestionsError('')
    setSuggestionsLoading(false)
    setActiveIndex(-1)
    setSuggestionsOpen(false)
  }

  return (
    <header className="finder-header">
      <Link to="/" className="finder-brand" aria-label="AccessFind home">
        <span className="finder-brand-icon">
          <MapPin size={25} fill="currentColor" />
        </span>
        <span>
          Access<span className="finder-brand-accent">Find</span>
        </span>
      </Link>

      <div className="finder-navbar-search" ref={wrapperRef}>
        <section className="finder-search-toolbar">
          <form className="finder-search-form" onSubmit={submitSearch}>
            <Search
              className="finder-search-icon"
              size={17}
              aria-hidden="true"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setSuggestionsOpen(true)
              }}
              onFocus={() => {
                if (search.trim().length >= 3) {
                  setSuggestionsOpen(true)
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search facilities or locations..."
              aria-label="Search facilities or locations"
              aria-autocomplete="list"
              aria-expanded={suggestionsOpen && suggestions.length > 0}
              aria-controls="facility-location-suggestions"
              role="combobox"
              autoComplete="off"
            />

            {search && (
              <button
                type="button"
                className="finder-search-clear"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}

            <button
              type="submit"
              className="finder-search-submit"
              aria-label="Search facilities"
            >
              <Search size={14} aria-hidden="true" />
              <span>Search</span>
            </button>
          </form>

          {suggestionsOpen && search.trim().length >= 3 && (
            <ul
              id="facility-location-suggestions"
              className="finder-location-suggestions"
              role="listbox"
            >
              {suggestions.map((suggestion, index) => (
                <li key={suggestion.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={activeIndex === index}
                    className={
                      activeIndex === index ? 'is-active' : ''
                    }
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => chooseSuggestion(suggestion)}
                  >
                    <MapPin size={16} aria-hidden="true" />
                    <span>{suggestion.label}</span>
                  </button>
                </li>
              ))}

              {!suggestionsLoading &&
                suggestions.length === 0 &&
                !suggestionsError && (
                  <li className="finder-suggestion-empty">
                    No matching places found.
                  </li>
                )}
            </ul>
          )}

          {suggestionsOpen && suggestionsLoading && (
            <div className="finder-suggestion-status" role="status">
              <LoaderCircle size={16} className="animate-spin" />
              Finding locations…
            </div>
          )}

          {suggestionsOpen && suggestionsError && (
            <div className="finder-suggestion-status" role="status">
              {suggestionsError}
            </div>
          )}

          <div className="finder-filter-options">
            {filterOptions.map(({ key, label, icon: Icon }) => {
              const isActive = Boolean(filters[key])

              return (
                <button
                  key={key}
                  type="button"
                  className={`finder-filter-chip ${
                    isActive ? 'is-active' : ''
                  }`}
                  onClick={() => toggleFilter(key)}
                  aria-pressed={isActive}
                >
                  <Icon size={15} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className="finder-clear-filters"
            onClick={clearFilters}
          >
            <RotateCcw size={13} aria-hidden="true" />
            <span>Clear</span>
          </button>
        </section>
      </div>

      <button
        type="button"
        className="finder-saved-button"
        onClick={() =>
          window.dispatchEvent(new CustomEvent('accessfind:show-saved'))
        }
        aria-label={`${savedCount} saved facilities`}
      >
        <Heart size={19} />
        <span>Saved</span>
        <span className="finder-saved-count">{savedCount}</span>
      </button>
    </header>
  )
}
