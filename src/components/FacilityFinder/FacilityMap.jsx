
import { useEffect } from 'react'
import {
  APIProvider,
  Map,
  Marker,
  Pin,
  useApiIsLoaded,
  useMap,
} from '@vis.gl/react-google-maps'

const DEFAULT_CENTER = {
  lat: 28.628,
  lng: 77.364,
}

function MapContent({
  facilities,
  selectedFacility,
  onSelectFacility,
  currentLocation,
}) {
  const isLoaded = useApiIsLoaded()
  const map = useMap('accessfind-map')

  useEffect(() => {
    if (!map) return

    const coordinates = selectedFacility?.coordinates || currentLocation

    if (
      coordinates &&
      Number.isFinite(coordinates.lat) &&
      Number.isFinite(coordinates.lng)
    ) {
      map.panTo(coordinates)
      map.setZoom(selectedFacility?.coordinates ? 16 : 14)
    }
  }, [
    map,
    selectedFacility?.id,
    selectedFacility?.coordinates?.lat,
    selectedFacility?.coordinates?.lng,
    currentLocation?.lat,
    currentLocation?.lng,
  ])

  if (!isLoaded) {
    return (
      <div className="finder-map-message" role="status">
        Loading Google Map…
      </div>
    )
  }

  return (
    <Map
      id="accessfind-map"
      defaultCenter={currentLocation || DEFAULT_CENTER}
      defaultZoom={14}
      mapTypeControl={false}
      streetViewControl={false}
      fullscreenControl
      gestureHandling="greedy"
      style={{ width: '100%', height: '100%' }}
    >
      {currentLocation &&
        Number.isFinite(currentLocation.lat) &&
        Number.isFinite(currentLocation.lng) && (
          <Marker
            position={currentLocation}
            title="Your current or searched location"
            zIndex={1000}
          >
            <Pin
              background="#0878f9"
              borderColor="#ffffff"
              glyphColor="#ffffff"
            />
          </Marker>
        )}

      {facilities.map((facility) => {
        const position = facility.coordinates

        if (
          !position ||
          !Number.isFinite(position.lat) ||
          !Number.isFinite(position.lng)
        ) {
          return null
        }

        const isSelected = selectedFacility?.id === facility.id

        return (
          <Marker
            key={facility.id}
            position={position}
            title={facility.name || 'Public toilet'}
            onClick={() => onSelectFacility(facility)}
            zIndex={isSelected ? 100 : 1}
          >
            <Pin
              background={isSelected ? '#0878f9' : '#16a085'}
              borderColor="#ffffff"
              glyphColor="#ffffff"
              scale={isSelected ? 1.35 : 1}
            />
          </Marker>
        )
      })}
    </Map>
  )
}

export default function FacilityMap({
  facilities = [],
  selectedFacility = null,
  onSelectFacility = () => {},
  currentLocation = null,
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <section className="finder-map-panel" aria-label="Facility map">
        <div className="finder-map-message" role="alert">
          Google Maps API key is missing. Check your .env.local file.
        </div>
      </section>
    )
  }

  return (
    <section className="finder-map-panel" aria-label="Facility map">
      <div className="finder-map">
        <APIProvider apiKey={apiKey}>
          <MapContent
            facilities={facilities}
            selectedFacility={selectedFacility}
            onSelectFacility={onSelectFacility}
            currentLocation={currentLocation}
          />
        </APIProvider>
      </div>
    </section>
  )
}
