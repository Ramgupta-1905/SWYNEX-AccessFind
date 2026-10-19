
import {
  MapPin,
  Heart,
  Accessibility,
  Baby,
  Clock3,
  IndianRupee,
} from 'lucide-react'

const FACILITY_IMAGES = {
  restroom:
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80',
  mall:
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80',
  metro:
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=500&q=80',
  park:
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=500&q=80',
  hospital:
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=500&q=80',
}

function getFacilityImage(facility) {
  const name = facility.name.toLowerCase()

  if (name.includes('metro') || name.includes('station')) {
    return FACILITY_IMAGES.metro
  }

  if (name.includes('mall')) return FACILITY_IMAGES.mall

  if (name.includes('park')) return FACILITY_IMAGES.park

  if (name.includes('community')) return FACILITY_IMAGES.park

  if (name.includes('hospital') || name.includes('medical')) {
    return FACILITY_IMAGES.hospital
  }

  return FACILITY_IMAGES.restroom
}

export default function FacilityCard({
  facility,
  selected,
  isFavorite,
  onSelect,
  onFavorite,
}) {
  return (
    <article
      className={`facility-card ${selected ? 'is-selected' : ''}`}
    >
      <button
        type="button"
        className="facility-card-select"
        onClick={onSelect}
        aria-pressed={selected}
      >
        <div
          className="facility-card-image"
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, #dcefe9, #d6e5f8)',
              color: '#477bb8',
            }}
          >
            <MapPin size={30} />
          </div>

          <img
            src={getFacilityImage(facility)}
            alt={`${facility.name} preview`}
            loading="lazy"
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              inset: 0,
              zIndex: 1,
            }}
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        </div>

        <div className="facility-card-info">
          <strong className="facility-card-name">
            {facility.name}
          </strong>

          <span className="facility-card-address">
            <MapPin size={15} />
            {facility.address}
          </span>

          <span className="facility-card-distance">
            <Accessibility size={14} />
            {facility.distance.toFixed(1)} km
            <span className="facility-status-dot">•</span>
            <span
              className={facility.open ? 'status-open' : 'status-closed'}
            >
              {facility.open ? 'Open Now' : 'Closed'}
            </span>
          </span>

          <span className="facility-card-badges">
            {facility.wheelchair && (
              <span title="Wheelchair accessible">
                <Accessibility size={17} />
              </span>
            )}

            {facility.babyChanging && (
              <span title="Baby changing available">
                <Baby size={17} />
              </span>
            )}

            {facility.free ? (
              <span className="facility-free-badge">FREE</span>
            ) : (
              <span title="Paid facility">
                <IndianRupee size={16} />
              </span>
            )}

            <span className="facility-hours-badge">
              <Clock3 size={16} />
              {facility.hours}
            </span>
          </span>
        </div>
      </button>

      <button
        type="button"
        className={`facility-favorite ${
          isFavorite ? 'is-favorite' : ''
        }`}
        onClick={onFavorite}
        aria-label={
          isFavorite
            ? `Remove ${facility.name} from saved facilities`
            : `Save ${facility.name}`
        }
      >
        <Heart
          size={20}
          fill={isFavorite ? 'currentColor' : 'none'}
        />
      </button>
    </article>
  )
}
