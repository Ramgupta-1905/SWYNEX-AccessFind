import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Search,
  LocateFixed,
  ShieldCheck,
  Accessibility,
} from 'lucide-react'

import restroomHero from '../../assets/images/public-restroom-hero.png'

export default function Hero() {
  const [location, setLocation] = useState('')
  const [locationError, setLocationError] = useState('')

  const navigate = useNavigate()

  function handleSearch(event) {
    event.preventDefault()

    const searchLocation = location.trim()

    setLocationError('')

    if (searchLocation) {
      navigate('/facilities', {
        state: { location: searchLocation },
      })
    } else {
      navigate('/facilities')
    }
  }

  function handleCurrentLocation() {
    setLocationError('')

    if (!navigator.geolocation) {
      setLocationError(
        'Your browser does not support location access.',
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const currentLocation =
          `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`

        setLocation(currentLocation)
        setLocationError('')
      },
      () => {
        setLocationError(
          'Location access was unavailable. Please enter a location instead.',
        )
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    )
  }

  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-eyebrow">
            More Accessible. More Inclusive. A More Confident Journey.
          </span>

          <h1 className="hero-title">
            Find Public Facilities
            <span>That Fit Your Needs</span>
          </h1>

          <p className="hero-description">
            Discover nearby public restrooms and other essential facilities
            with detailed accessibility information. Filter by your
            requirements and find a place with confidence.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <MapPin size={17} className="hero-search-pin" />

            <input
              type="text"
              value={location}
              onChange={(event) => {
                setLocation(event.target.value)
                setLocationError('')
              }}
              placeholder="Enter a city, area or allow your location"
              aria-label="Enter a city, area, or landmark"
              aria-invalid={Boolean(locationError)}
            />

            <button type="submit" className="hero-search-button">
              <Search size={15} />
              Find Facilities
            </button>
          </form>

          {locationError && (
            <p className="hero-error" role="alert">
              {locationError}
            </p>
          )}

          <div className="hero-quick-links">
            <button
              type="button"
              onClick={handleCurrentLocation}
            >
              <LocateFixed size={13} />
              Use my current location
            </button>

            <span className="hero-quick-divider" />

            <span>
              <ShieldCheck size={13} />
              No account required
            </span>

            <span className="hero-quick-divider" />

            <span>
              <Accessibility size={13} />
              Free to use
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <img
            className="hero-image"
            src={restroomHero}
            alt="Accessible public restroom pavilion in a green park"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  )
}