
import {
  ArrowRight,
} from 'lucide-react'

import searchLocationImage from '../../assets/images/search-location.png'
import applyFiltersImage from '../../assets/images/apply-filters.png'
import compareResultsImage from '../../assets/images/compare-results.png'
import getDirectionsImage from '../../assets/images/get-directions.png'

const steps = [
  {
    number: 1,
    title: 'Search a Location',
    description:
      'Enter a city, neighbourhood or use your current location to find nearby facilities.',
    image: searchLocationImage,
    imageAlt: 'Searching for nearby facilities on a map',
  },
  {
    number: 2,
    title: 'Apply Filters',
    description:
      'Filter by accessibility, fees, baby-changing facilities, opening hours and more.',
    image: applyFiltersImage,
    imageAlt: 'Selecting accessibility and facility filters',
  },
  {
    number: 3,
    title: 'Compare Results',
    description:
      'View key details like distance, facilities, opening hours and accessibility information.',
    image: compareResultsImage,
    imageAlt: 'Comparing nearby facilities and their accessibility features',
  },
  {
    number: 4,
    title: 'Get Directions',
    description:
      'Open your preferred maps app to get directions and reach your destination.',
    image: getDirectionsImage,
    imageAlt: 'Following a map route to a selected facility',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how-section">
      <header className="how-heading">
        <h2>How It Works</h2>
        <p>
          Finding a suitable public facility is simple and fast.
        </p>
      </header>

      <div className="how-steps">
        {steps.map((step, index) => (
          <article className="how-step" key={step.number}>
            <div className="how-art">
              <img
                className="how-art-image"
                src={step.image}
                alt={step.imageAlt}
                loading="lazy"
              />
            </div>

            {index < steps.length - 1 && (
              <span
                className="how-connector"
                aria-hidden="true"
              >
                <ArrowRight size={23} strokeWidth={1.5} />
              </span>
            )}

            <div className="how-step-title">
              <span className="how-number">
                {step.number}
              </span>
              <h3>{step.title}</h3>
            </div>

            <p className="how-step-description">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
