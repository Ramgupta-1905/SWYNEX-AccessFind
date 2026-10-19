import { MapPin, LocateFixed, Plus, Minus } from 'lucide-react'
import { useState } from 'react'

export default function FacilityMap({
  facilities,
  selectedId,
  onSelect,
}) {
  const [zoom, setZoom] = useState(1)

  return (
    <section className="finder-map-panel" aria-label="Facility map">
      <div className="finder-map">
        <div
          className="finder-map-art"
          style={{ transform: `scale(${zoom})` }}
        >
          <div className="map-park map-park-one" />
          <div className="map-park map-park-two" />
          <div className="map-water" />

          <div className="map-road map-road-one" />
          <div className="map-road map-road-two" />
          <div className="map-road map-road-three" />
          <div className="map-road map-road-four" />
          <div className="map-road map-road-five" />
          <div className="map-road map-road-six" />
          <div className="map-road map-road-seven" />

          <span className="map-label map-label-park">CENTRAL PARK</span>
          <span className="map-label map-label-city">CITY MALL</span>
          <span className="map-label map-label-metro">METRO STATION</span>
          <span className="map-label map-label-river">RIVERSIDE PARK</span>

          {facilities.map((facility) => (
            <button
              key={facility.id}
              type="button"
              className={`map-marker ${
                selectedId === facility.id ? 'is-active' : ''
              }`}
              style={facility.position}
              onClick={() => onSelect(facility.id)}
              aria-label={`Select ${facility.name}`}
              title={facility.name}
            >
              <MapPin size={24} fill="currentColor" />
            </button>
          ))}
        </div>

        <div className="finder-map-area-button">
          <LocateFixed size={17} />
          <span>Sample map</span>
        </div>

        <div className="finder-map-zoom">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => setZoom((current) => Math.min(1.25, current + 0.1))}
          >
            <Plus size={19} />
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => setZoom((current) => Math.max(0.85, current - 0.1))}
          >
            <Minus size={19} />
          </button>
        </div>

        <div className="finder-map-attribution">
          Illustrative map · Sample locations
        </div>
      </div>
    </section>
  )
}