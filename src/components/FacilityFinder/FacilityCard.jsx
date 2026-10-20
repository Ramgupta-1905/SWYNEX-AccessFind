
import { useEffect, useState } from 'react'
import {
  MapPin,
  Heart,
  Accessibility,
  Baby,
  Clock3,
  IndianRupee,
  CircleHelp,
} from 'lucide-react'

const PHOTON_URL = 'https://photon.komoot.io/reverse'

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

export default function FacilityCard({
  facility,
  selected = false,
  isFavorite = false,
  onSelect = () => {},
  onFavorite = () => {},
  onAddressFound,
}) {
  const [lookedUpAddress, setLookedUpAddress] = useState(null)

  useEffect(() => {
    setLookedUpAddress(null)

    if (facility.address || !facility.coordinates) return

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
      try {
        const params = new URLSearchParams({
          lat: String(lat),
          lon: String(lng),
        })

        const response = await fetch(
          `${PHOTON_URL}?${params.toString()}`,
          { signal: controller.signal },
        )

        if (!response.ok) return

        const data = await response.json()
        const address = formatPhotonAddress(
          data.features?.[0]?.properties,
        )

        if (controller.signal.aborted || !address) return

        setLookedUpAddress(address)
        onAddressFound?.(facility.id, address)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn('Could not look up facility address.')
        }
      }
    }

    lookupAddress()

    return () => controller.abort()
  }, [
    facility.id,
    facility.address,
    facility.coordinates?.lat,
    facility.coordinates?.lng,
    onAddressFound,
  ])

  const distance =
    Number.isFinite(facility.distance) && facility.distance >= 0
      ? `${facility.distance.toFixed(1)} km away`
      : 'Distance unavailable'

  const hasRealName =
    typeof facility.name === 'string' &&
    facility.name.trim().length > 0 &&
    ![
      'Public Toilet',
      'Public toilet',
      'Name not listed',
    ].includes(facility.name.trim()) &&
    facility.hasName !== false

  const facilityName = hasRealName
    ? facility.name.trim()
    : 'Public toilet'

  const facilityAddress =
    typeof facility.address === 'string' &&
    facility.address.trim().length > 0 &&
    ![
      'Address not available',
      'Address not mapped',
    ].includes(facility.address.trim())
      ? facility.address.trim()
      : lookedUpAddress

  const operator =
    typeof facility.operator === 'string' &&
    facility.operator.trim().length > 0
      ? facility.operator.trim()
      : null

  const hours =
    typeof facility.hours === 'string' &&
    facility.hours.trim().length > 0
      ? facility.hours.trim()
      : null

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
          {facility.image ? (
            <img
              src={facility.image}
              alt={`Photo of ${facilityName}`}
              loading="lazy"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                inset: 0,
              }}
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div
              role="img"
              aria-label="No facility photo available"
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
          )}
        </div>

        <div className="facility-card-info">
          <strong className="facility-card-name">
            {facilityName}
          </strong>

          <span className="facility-card-address">
            <MapPin size={15} />
            <span>
              {facilityAddress ||
                'Address not available'}
            </span>
          </span>

          <span className="facility-card-distance">
            <span>{distance}</span>

            <span
              className="facility-status-dot"
              aria-hidden="true"
            >
              •
            </span>

            {facility.open === true ? (
              <span className="status-open">Open now</span>
            ) : facility.open === false ? (
              <span className="status-closed">Closed</span>
            ) : (
              <span>Opening status unknown</span>
            )}
          </span>

          {operator && (
            <span className="facility-card-badges">
              <span>{operator}</span>
            </span>
          )}

          <span className="facility-card-badges">
            {facility.wheelchair === true && (
              <span title="Wheelchair accessibility is listed">
                <Accessibility size={17} />
                Accessible
              </span>
            )}

            {facility.babyChanging === true && (
              <span title="Baby-changing facility is listed">
                <Baby size={17} />
                Baby changing
              </span>
            )}

            {facility.free === true ? (
              <span className="facility-free-badge">
                Free
              </span>
            ) : facility.free === false ? (
              <span title="A fee is listed">
                <IndianRupee size={16} />
                Fee applies
              </span>
            ) : (
              <span title="Fee information is not listed">
                <CircleHelp size={16} />
                Fee unknown
              </span>
            )}

            <span className="facility-hours-badge">
              <Clock3 size={16} />
              {hours || 'Hours not listed'}
            </span>
          </span>
        </div>
      </button>

      <button
        type="button"
        className={`facility-favorite ${
          isFavorite ? 'is-favorite' : ''
        }`}
        onClick={(event) => {
          event.stopPropagation()
          onFavorite()
        }}
        aria-label={
          isFavorite
            ? `Remove ${facilityName} from saved facilities`
            : `Save ${facilityName}`
        }
        aria-pressed={isFavorite}
      >
        <Heart
          size={20}
          fill={isFavorite ? 'currentColor' : 'none'}
        />
      </button>
    </article>
  )
}
