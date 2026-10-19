import {
  MapPin,
  Heart,
  Accessibility,
  Baby,
  Clock3,
  IndianRupee,
} from 'lucide-react'

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
        <div className="facility-card-image">
          <img
            src={facility.image}
            alt=""
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
          <MapPin className="facility-image-fallback" size={28} />
        </div>

        <div className="facility-card-info">
          <strong className="facility-card-name">{facility.name}</strong>

          <span className="facility-card-address">
            <MapPin size={15} />
            {facility.address}
          </span>

          <span className="facility-card-distance">
            <Accessibility size={14} />
            {facility.distance.toFixed(1)} km
            <span className="facility-status-dot">•</span>
            <span className={facility.open ? 'status-open' : 'status-closed'}>
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
        className={`facility-favorite ${isFavorite ? 'is-favorite' : ''}`}
        onClick={onFavorite}
        aria-label={
          isFavorite
            ? `Remove ${facility.name} from saved facilities`
            : `Save ${facility.name}`
        }
      >
        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
    </article>
  )
}