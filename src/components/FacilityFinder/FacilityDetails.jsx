
import { useEffect, useState } from 'react'
import {
  MapPin,
  Heart,
  Accessibility,
  Baby,
  Clock3,
  CheckCircle2,
  Navigation,
  Info,
  CircleHelp,
  IndianRupee,
  ExternalLink,
} from 'lucide-react'

const PHOTON_URL = 'https://photon.komoot.io/reverse'

function FeatureStatus({ value, label }) {
  const known = value === true || value === false

  return (
    <div
      className={
        !known
          ? 'feature-unavailable'
          : value
            ? 'feature-available'
            : 'feature-unavailable'
      }
    >
      {label === 'Wheelchair accessible' ? (
        <Accessibility size={25} />
      ) : label === 'Baby changing' ? (
        <Baby size={25} />
      ) : label === 'Free to use' ? (
        value === true ? (
          <strong>FREE</strong>
        ) : value === false ? (
          <IndianRupee size={25} />
        ) : (
          <CircleHelp size={25} />
        )
      ) : (
        <Clock3 size={25} />
      )}

      <span>{label}</span>

      <span>
        {!known
          ? 'Information unavailable'
          : value
            ? 'Available'
            : 'Not listed as available'}
      </span>

      {known && value && <CheckCircle2 size={14} />}
    </div>
  )
}

function formatPhotonAddress(properties = {}) {
  const street = [
    properties.housenumber,
    properties.street,
  ]
    .filter(Boolean)
    .join(' ')

  const parts = [
    street,
    properties.name && !street ? properties.name : null,
    properties.district,
    properties.city || properties.town || properties.village,
    properties.state,
    properties.postcode,
    properties.country,
  ].filter(Boolean)

  return [...new Set(parts)].join(', ') || null
}

export default function FacilityDetails({
  facility,
  isFavorite,
  onFavorite,
  onClose,
}) {
  const [lookedUpAddress, setLookedUpAddress] = useState(null)
  const [addressLookupStatus, setAddressLookupStatus] = useState('idle')

  useEffect(() => {
    setLookedUpAddress(null)
    setAddressLookupStatus('idle')

    if (!facility || facility.address || !facility.coordinates) {
      return
    }

    const { lat, lng } = facility.coordinates

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return
    }

    const controller = new AbortController()

    async function lookupAddress() {
      setAddressLookupStatus('loading')

      try {
        const params = new URLSearchParams({
          lat: String(lat),
          lon: String(lng),
        })

        const response = await fetch(
          `${PHOTON_URL}?${params.toString()}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error('Address lookup failed')
        }

        const data = await response.json()
        const properties = data.features?.[0]?.properties

        if (!controller.signal.aborted) {
          const address = formatPhotonAddress(properties)

          setLookedUpAddress(address)
          setAddressLookupStatus(address ? 'success' : 'unavailable')
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setAddressLookupStatus('unavailable')
        }
      }
    }

    lookupAddress()

    return () => controller.abort()
  }, [
    facility?.id,
    facility?.address,
    facility?.coordinates?.lat,
    facility?.coordinates?.lng,
  ])

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

  const distance = Number.isFinite(facility.distance)
    ? `${facility.distance.toFixed(1)} km away`
    : 'Distance unavailable'

  const openingHours = facility.hours || 'Hours not listed'
  const address = facility.address || lookedUpAddress

  function openDirections() {
    const { lat, lng } = facility.coordinates || {}

    const query =
      Number.isFinite(lat) && Number.isFinite(lng)
        ? `${lat},${lng}`
        : [facility.name, address]
            .filter(Boolean)
            .join(', ')

    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <aside className="facility-details">
      <div className="facility-details-photo">
        {facility.image ? (
          <img
            src={facility.image}
            alt={facility.name || 'Public toilet'}
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
        ) : (
          <div
            aria-label="No facility photo available"
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
        )}

        <span className="facility-photo-label">
          {openingHours}
        </span>
      </div>

      <div className="facility-details-content">
        <div className="facility-details-title-row">
          <h2>{facility.name || 'Public Toilet'}</h2>

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
          {address ||
            (addressLookupStatus === 'loading'
              ? 'Looking up address…'
              : 'Address not available')}
        </p>

        <div className="facility-details-status">
          <span>
            <Accessibility size={15} />
            {distance}
          </span>

          <span
            className={
              facility.open === true
                ? 'status-open'
                : facility.open === false
                  ? 'status-closed'
                  : ''
            }
          >
            <span className="facility-status-dot">●</span>
            {facility.open === true
              ? 'Open Now'
              : facility.open === false
                ? 'Closed'
                : 'Opening status unknown'}
          </span>
        </div>

        <div className="facility-details-notice">
          <Info size={19} />
          <p>
            {facility.description ||
              'Additional information is not available for this facility.'}
          </p>
        </div>

        <h3>Accessibility & Facilities</h3>

        <div className="facility-feature-grid">
          <FeatureStatus
            value={facility.wheelchair}
            label="Wheelchair accessible"
          />

          <FeatureStatus
            value={facility.babyChanging}
            label="Baby changing"
          />

          <FeatureStatus
            value={facility.free}
            label="Free to use"
          />

          <div className="feature-unavailable">
            <Clock3 size={25} />
            <span>Opening hours</span>
            <span>{openingHours}</span>
          </div>
        </div>

        <h3 className="facility-opening-title">
          <Clock3 size={18} />
          Opening Hours
        </h3>

        <div className="facility-opening-table">
          <div>
            <span>Reported hours</span>
            <span>{openingHours}</span>
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

        {facility.osmUrl && (
          <p className="facility-demo-note">
            Source:{' '}
            <a
              href={facility.osmUrl}
              target="_blank"
              rel="noreferrer"
            >
              OpenStreetMap <ExternalLink size={12} />
            </a>
          </p>
        )}
      </div>
    </aside>
  )
}
