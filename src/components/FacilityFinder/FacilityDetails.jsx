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
        <img
          src={facility.image}
          alt={facility.name}
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
        <span className="facility-photo-label">{facility.hours}</span>
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
            <Heart size={21} fill={isFavorite ? 'currentColor' : 'none'} />
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
          <span className={facility.open ? 'status-open' : 'status-closed'}>
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
          <div className={facility.wheelchair ? 'feature-available' : 'feature-unavailable'}>
            <Accessibility size={25} />
            <span>Wheelchair</span>
            <span>Accessible</span>
            {facility.wheelchair && <CheckCircle2 size={14} />}
          </div>

          <div className={facility.babyChanging ? 'feature-available' : 'feature-unavailable'}>
            <Baby size={25} />
            <span>Baby</span>
            <span>Changing</span>
            {facility.babyChanging && <CheckCircle2 size={14} />}
          </div>

          <div className={facility.free ? 'feature-available' : 'feature-unavailable'}>
            <strong>{facility.free ? 'FREE' : 'PAID'}</strong>
            <span>{facility.free ? 'Free to' : 'Paid'} </span>
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
            className={`facility-save-button ${isFavorite ? 'is-saved' : ''}`}
            onClick={onFavorite}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
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