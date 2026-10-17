
import {
  Accessibility,
  Baby,
  Clock3,
  Map,
  MapPin,
  Search,
  SlidersHorizontal,
  Toilet,
  LocateFixed,
  CheckCircle2,
} from 'lucide-react'

const filters = [
  { label: 'All', icon: Map, active: true },
  { label: 'Restrooms', icon: Toilet },
  { label: 'Wheelchair accessible', icon: Accessibility },
  { label: 'Baby changing', icon: Baby },
  { label: 'Free to use', icon: CheckCircle2 },
  { label: 'Open now', icon: Clock3 },
]

const pins = [
  { x: 16, y: 29, type: 'restroom' },
  { x: 47, y: 29, type: 'restroom' },
  { x: 64, y: 26, type: 'accessible' },
  { x: 7, y: 54, type: 'restroom' },
  { x: 21, y: 66, type: 'accessible' },
  { x: 42, y: 77, type: 'restroom' },
]

const benefits = [
  {
    icon: Map,
    title: 'Discover nearby facilities',
    description:
      'Explore restrooms and other public facilities through a clear and easy-to-read map.',
    tone: 'blue',
  },
  {
    icon: SlidersHorizontal,
    title: 'Compare what matters',
    description:
      'Check distance, opening times, and accessibility features in one place.',
    tone: 'green',
  },
  {
    icon: Accessibility,
    title: 'Find facilities for your needs',
    description:
      'Look for wheelchair access, baby-changing facilities, and free-to-use options.',
    tone: 'purple',
  },
]

function goToFacilitySearch() {
  const section = document.querySelector('#home')

  if (!section) return

  section.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })

  window.setTimeout(() => {
    section.querySelector('input')?.focus()
  }, 450)
}

export default function FacilityPreview() {
  return (
    <section id="facilities" className="facility-preview">
      {/* Decorative leaves */}
      <div className="facility-leaves" aria-hidden="true">
        <span className="facility-leaf leaf-a" />
        <span className="facility-leaf leaf-b" />
        <span className="facility-leaf leaf-c" />
        <span className="facility-leaf leaf-d" />
        <span className="facility-leaf leaf-e" />
        <span className="facility-leaf leaf-f" />
      </div>

      <div className="facility-preview-container">
        {/* Left: illustrative map */}
        <div className="facility-map">
          <div className="facility-map-scenery">
            <div className="map-river" />

            <div className="map-park park-one" />
            <div className="map-park park-two" />
            <div className="map-park park-three" />
            <div className="map-park park-four" />

            <div className="map-road road-one" />
            <div className="map-road road-two" />
            <div className="map-road road-three" />
            <div className="map-road road-four" />
            <div className="map-road road-five" />
            <div className="map-road road-six" />

            <span className="map-place place-city">City Centre</span>
            <span className="map-place place-park">Central Park</span>
            <span className="map-place place-river">Riverside Walk</span>
            <span className="map-place place-metro">Metro Station</span>

            {pins.map((pin, index) => (
              <span
                key={index}
                className={`facility-map-pin ${pin.type}`}
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                }}
                aria-label={
                  pin.type === 'accessible'
                    ? 'Example accessible facility location'
                    : 'Example restroom location'
                }
              >
                {pin.type === 'accessible' ? (
                  <Accessibility size={18} />
                ) : (
                  <Toilet size={18} />
                )}
              </span>
            ))}

            <div className="facility-current-location">
              <span className="location-pulse" />
              <b>You are here</b>
            </div>
          </div>

          {/* Map search and illustrative filters */}
          <div className="facility-map-toolbar">
            <div className="facility-map-search">
              <Search size={20} />

              <span>Search nearby restrooms, facilities...</span>

              <button
                type="button"
                aria-label="Go to facility search"
                onClick={goToFacilitySearch}
              >
                <LocateFixed size={20} />
              </button>
            </div>

            <div className="facility-map-filters">
              {filters.map(({ label, icon: Icon, active }) => (
                <span
                  key={label}
                  className={`facility-filter${active ? ' active' : ''}`}
                >
                  <Icon size={15} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Sample facility card — always visible */}
          <article className="facility-map-card">
            <div className="facility-card-heading">
              <div className="facility-card-photo" aria-hidden="true">
                <div className="restroom-illustration">
                  <Toilet size={36} />
                  <Accessibility size={23} />
                </div>
              </div>

              <div className="facility-card-main">
                <div className="facility-card-title">
                  <h3>Central Park Restroom</h3>
                  <span>Example</span>
                </div>

                <p className="facility-card-location">
                  <MapPin size={14} />
                  <span>Central Park · 0.3 km</span>
                </p>

                <p className="facility-card-status">
                  <Clock3 size={14} />
                  <span>Example hours · Closes 10 PM</span>
                </p>
              </div>
            </div>

            <div className="facility-card-tags">
              <span>
                <Accessibility size={14} />
                Wheelchair accessible
              </span>

              <span>
                <Baby size={14} />
                Baby changing
              </span>

              <span>
                <CheckCircle2 size={14} />
                Free to use
              </span>

              <span>
                <Clock3 size={14} />
                Open now
              </span>
            </div>
          </article>

          {/* Map legend */}
          <div className="facility-map-legend">
            <span>
              <i className="legend-blue" />
              Nearby facilities
            </span>

            <span>
              <i className="legend-location" />
              Your location
            </span>
          </div>

          {/* Illustrative map label */}
          <span className="facility-map-caption">
            Illustrative map preview
          </span>
        </div>

        {/* Right: feature content */}
        <div className="facility-preview-content">
          <span className="facility-preview-eyebrow">
            <MapPin size={16} />
            Explore with confidence
          </span>

          <h2>
            Explore Nearby
            <br />
            Facilities <span>on a Map</span>
          </h2>

          <p className="facility-preview-description">
            Find clean and accessible public facilities around you. Review key
            details, compare options, and choose the one that suits your needs.
          </p>

          <div className="facility-benefits">
            {benefits.map(({ icon: Icon, title, description, tone }) => (
              <div className="facility-benefit" key={title}>
                <div className={`facility-benefit-icon ${tone}`}>
                  <Icon size={27} strokeWidth={2.1} />
                </div>

                <div className="facility-benefit-copy">
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="facility-preview-note">
            Discover what’s around you and choose with confidence.
          </p>
        </div>
      </div>
    </section>
  )
}
