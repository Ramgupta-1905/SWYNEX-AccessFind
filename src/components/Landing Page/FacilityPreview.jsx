import {
  MapPin,
  Navigation,
  Accessibility,
  Baby,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react'

const benefits = [
  'Interactive map with nearby locations',
  'View distance and key facility details',
  'Filter and compare multiple facilities',
  'Open in your favourite maps app',
]

export default function FacilityPreview() {
  return (
    <section id="facilities" className="facility-preview">
      <div className="facility-preview-container">
        {/* Map preview */}
        <div className="facility-map">
          <div className="map-road map-road-horizontal" />
          <div className="map-road map-road-diagonal" />
          <div className="map-road map-road-vertical" />

          <div className="map-park map-park-one" />
          <div className="map-park map-park-two" />
          <div className="map-park map-park-three" />

          {[ 
            { top: '19%', left: '25%' },
            { top: '35%', left: '53%' },
            { top: '22%', left: '76%' },
            { top: '59%', left: '35%' },
            { top: '47%', left: '82%' },
          ].map((pin, index) => (
            <span
              className="facility-map-pin"
              key={index}
              style={{ top: pin.top, left: pin.left }}
            >
              <MapPin size={22} fill="currentColor" />
            </span>
          ))}

          <div className="facility-map-label label-one">City Centre</div>
          <div className="facility-map-label label-two">Public Park</div>

          {/* Sample facility card */}
          <article className="facility-map-card">
            <div className="facility-card-photo">
              <img
                src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=300&q=80"
                alt="Example public facility"
                loading="lazy"
              />
            </div>

            <div className="facility-card-info">
              <h3>City Library</h3>
              <p>
                <MapPin size={12} />
                Main Street, 0.5 km
              </p>
              <p className="facility-card-status">
                <Clock3 size={12} />
                Open · Closes 9:00 PM
              </p>

              <div className="facility-card-tags">
                <span title="Wheelchair accessible">
                  <Accessibility size={13} />
                </span>
                <span title="Baby changing available">
                  <Baby size={13} />
                </span>
                <span title="Free to use">Free</span>
              </div>
            </div>

            <button
              className="facility-card-directions"
              type="button"
              onClick={() => {
                window.open(
                  'https://www.google.com/maps/search/?api=1&query=public+restroom+near+me',
                  '_blank',
                  'noopener,noreferrer',
                )
              }}
            >
              Get Directions
            </button>
          </article>
        </div>

        {/* Section information */}
        <div className="facility-preview-content">
          <span className="facility-preview-eyebrow">
            Explore with confidence
          </span>

          <h2>
            Explore Nearby Facilities
            <span>on a Map</span>
          </h2>

          <p className="facility-preview-description">
            See facilities around you and check accessibility information.
            Compare details at a glance and choose the best option for your
            needs.
          </p>

          <ul className="facility-benefits">
            {benefits.map((benefit) => (
              <li key={benefit}>
                <CheckCircle2 size={16} />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="facility-preview-link"
            onClick={() => {
              window.open(
                'https://www.google.com/maps/search/?api=1&query=public+restroom+near+me',
                '_blank',
                'noopener,noreferrer',
              )
            }}
          >
            Explore on Maps
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}