
import {
  Heart,
  MapPin,
  Search,
  Accessibility,
  Baby,
  Tag,
  Clock3,
  RotateCcw,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const filterOptions = [
  {
    key: 'wheelchair',
    label: 'Wheelchair Access',
    icon: Accessibility,
  },
  {
    key: 'babyChanging',
    label: 'Baby Changing',
    icon: Baby,
  },
  {
    key: 'free',
    label: 'Free to Use',
    icon: Tag,
  },
  {
    key: 'open',
    label: 'Open Now',
    icon: Clock3,
  },
]

export default function FinderNavbar({
  savedCount = 0,
  search = '',
  setSearch = () => {},
  filters = {},
  toggleFilter = () => {},
  clearFilters = () => {},
}) {
  return (
    <header className="finder-header">
      {/* Brand */}
      <Link
        to="/"
        className="finder-brand"
        aria-label="AccessFind home"
      >
        <span className="finder-brand-icon">
          <MapPin size={25} fill="currentColor" />
        </span>

        <span>
          Access<span className="finder-brand-accent">Find</span>
        </span>
      </Link>

      {/* Search and filters */}
      <div className="finder-navbar-search">
        <section className="finder-search-toolbar">
          <form
            className="finder-search-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <Search
              className="finder-search-icon"
              size={17}
              aria-hidden="true"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search facilities or locations..."
              aria-label="Search facilities or locations"
            />

            {search && (
              <button
                type="button"
                className="finder-search-clear"
                onClick={() => setSearch('')}
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

          {/* Facility filters */}
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

          {/* Clear search and filters */}
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

      {/* Saved facilities */}
      <button
        type="button"
        className="finder-saved-button"
        onClick={() =>
          window.dispatchEvent(
            new CustomEvent('accessfind:show-saved')
          )
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
