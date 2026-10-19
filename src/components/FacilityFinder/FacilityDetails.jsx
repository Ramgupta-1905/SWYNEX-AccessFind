
import {
  MapPin,
  Heart,
  Accessibility,
  Baby,
  Clock3,
  CheckCircle2,
  Navigation,
  Info,
} from 'lucide-react'

const FACILITY_IMAGES = {
  restroom:
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80',
  mall:
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80',
  metro:
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80',
  park:
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=900&q=80',
  hospital:
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80',
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

export default function FacilityDetails({
  facility,
  isFavorite,
  onFavorite,
}) {
  if (!facility) {
    return (
      <aside className="facility-details">
        <div className="finder-empty-details">
          <MapPin size={34} />
          <h2>No facility selected</h2>
          <p>Try changing your search or filters.</p>
        </div>
      </aside>
    )
  }

  function openDirections() {
    const query = encodeURIComponent(
      `${facility.name}, ${facility.address}`,
    )

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <aside className="facility-details">
      <div className="facility-details-photo">
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(135deg, #dcefe9, #d6e5f8)',
          }}
        >
          <MapPin size={36} color="#477bb8" />
        </div>

        <img
          src={getFacilityImage(facility)}
          alt={`${facility.name} preview`}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
          }}
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />

        <span className="facility-photo-label">
          {facility.hours}
        </span>
      </div>

      <div className="facility-details-content">
        <div className="facility-details-title-row">
          <h2>{facility.name}</h2>

          <button
            type="button"
            className={`facility-favorite details-favorite ${
              isFavorite ? 'is-favorite' : ''
            }`}
            onClick={onFavorite}
            aria-label={
              isFavorite ? 'Remove saved facility' : 'Save facility'
            }
          >
            <Heart
              size={21}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <p className="facility-details-address">
          <MapPin size={17} />
          {facility.address}
        </p>

        <div className="facility-details-status">
          <span>
            <Accessibility size={15} />
            {facility.distance.toFixed(1)} km away
          </span>

          <span
            className={facility.open ? 'status-open' : 'status-closed'}
          >
            <span className="facility-status-dot">●</span>
            {facility.open ? 'Open Now' : 'Closed'}
          </span>
        </div>

        <div className="facility-details-notice">
          <Info size={19} />
          <p>{facility.description}</p>
        </div>

        <h3>Accessibility Features</h3>

        <div className="facility-feature-grid">
          <div
            className={
              facility.wheelchair
                ? 'feature-available'
                : 'feature-unavailable'
            }
          >
            <Accessibility size={25} />
            <span>Wheelchair</span>
            <span>Accessible</span>
            {facility.wheelchair && <CheckCircle2 size={14} />}
          </div>

          <div
            className={
              facility.babyChanging
                ? 'feature-available'
                : 'feature-unavailable'
            }
          >
            <Baby size={25} />
            <span>Baby</span>
            <span>Changing</span>
            {facility.babyChanging && <CheckCircle2 size={14} />}
          </div>

          <div
            className={
              facility.free
                ? 'feature-available'
                : 'feature-unavailable'
            }
          >
            <strong>{facility.free ? 'FREE' : 'PAID'}</strong>
            <span>{facility.free ? 'Free to' : 'Paid'}</span>
            <span>Use</span>
            {facility.free && <CheckCircle2 size={14} />}
          </div>

          <div className="feature-available">
            <Clock3 size={25} />
            <span>{facility.hours}</span>
            <span>Opening hours</span>
          </div>
        </div>

        <h3 className="facility-opening-title">
          <Clock3 size={18} />
          Opening Hours
        </h3>

        <div className="facility-opening-table">
          <div>
            <span>Monday – Friday</span>
            <span>{facility.hours}</span>
          </div>
          <div>
            <span>Saturday</span>
            <span>{facility.hours}</span>
          </div>
          <div>
            <span>Sunday</span>
            <span>{facility.hours}</span>
          </div>
        </div>

        <div className="facility-details-actions">
          <button
            type="button"
            className="facility-directions-button"
            onClick={openDirections}
          >
            <Navigation size={18} />
            Directions
          </button>

          <button
            type="button"
            className={`facility-save-button ${
              isFavorite ? 'is-saved' : ''
            }`}
            onClick={onFavorite}
          >
            <Heart
              size={18}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
            {isFavorite ? 'Saved' : 'Save Facility'}
          </button>
        </div>

        <p className="facility-demo-note">
          Sample facility information for demonstration.
        </p>
      </div>
    </aside>
  )
}
