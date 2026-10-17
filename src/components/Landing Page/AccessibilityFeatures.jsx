import {
  Accessibility,
  Smile,
  Baby,
  Clock3,
  MapPin,
  MoreHorizontal,
} from 'lucide-react'

const features = [
  {
    icon: Accessibility,
    label: 'Wheelchair',
    secondLine: 'Accessible',
    color: 'blue',
  },
  {
    icon: Smile,
    label: 'Free to Use',
    color: 'green',
  },
  {
    icon: Baby,
    label: 'Baby Changing',
    secondLine: 'Facilities',
    color: 'pink',
  },
  {
    icon: Clock3,
    label: 'Opening Hours',
    color: 'purple',
  },
  {
    icon: MapPin,
    label: 'Nearby Locations',
    color: 'orange',
  },

]

export default function AccessibilityFeatures() {
  return (
    <section
      id="features"
      className="accessibility-strip"
      aria-labelledby="accessibility-heading"
    >
      <span className="accessibility-leaves accessibility-leaves-left" aria-hidden="true">
        ❧
      </span>

      <div className="accessibility-intro">
        <h2 id="accessibility-heading">
          Find the right facility, with the right information.
        </h2>
        <p>
          Filter by your needs and quickly see which facilities match your
          requirements.
        </p>
      </div>

      <div className="accessibility-features">
        {features.map(({ icon: Icon, label, secondLine, color }) => (
          <div className="accessibility-feature" key={label}>
            <span className={`accessibility-icon ${color}`}>
              <Icon size={23} strokeWidth={2.5} />
            </span>

            <span className="accessibility-feature-label">
              {label}
              {secondLine && <span>{secondLine}</span>}
            </span>
          </div>
        ))}
      </div>

      <span className="accessibility-leaves accessibility-leaves-right" aria-hidden="true">
        ❧
      </span>
    </section>
  )
}