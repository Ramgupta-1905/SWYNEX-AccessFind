
import {
  Accessibility,
  Baby,
  Footprints,
  BriefcaseBusiness,
  Users,
} from 'lucide-react'


import wheelchairImage from '../../assets/images/wheelchair-access.png'
import familyImage from '../../assets/images/family-care.png'
import travellerImage from '../../assets/images/traveller.png'
import commuterImage from '../../assets/images/commuter.png'
import everyoneImage from '../../assets/images/everyone.png'


const audiences = [
  {
    title: 'People with Disabilities',
    description:
      'Find facilities with accessible features and useful information.',
    icon: Accessibility,
    color: 'blue',
    image: wheelchairImage,
    imageAlt: 'Wheelchair-accessible public space',
  },
  {
    title: 'Families & Caregivers',
    description:
      'Locate baby-changing facilities and family-friendly amenities.',
    icon: Baby,
    color: 'pink',
    image: familyImage,
    imageAlt: 'Parent spending time with a young child',
  },
  {
    title: 'Travellers',
    description:
      'Explore new cities and find essential facilities on the go.',
    icon: Footprints,
    color: 'green',
    image: travellerImage,
    imageAlt: 'Traveller exploring a new destination',
  },
  {
    title: 'Commuters',
    description:
      'Find convenient facilities during your daily travels.',
    icon: BriefcaseBusiness,
    color: 'purple',
    image: commuterImage,
    imageAlt: 'Commuter travelling through a public space',
  },
  {
    title: 'Everyone',
    description:
      'A more inclusive and comfortable experience for all.',
    icon: Users,
    color: 'orange',
    image: everyoneImage,
    imageAlt: 'People of different ages sharing a public space',
  },
]

export default function AudienceSection() {
  return (
    <section id="about" className="audience-section">
      <header className="audience-heading">
        <span className="audience-eyebrow">
          Designed for Everyone
        </span>

        <h2>Making Public Spaces More Accessible</h2>

        <p>
          AccessFind helps a wide range of people find facilities
          that meet their needs, whether at home, commuting or
          exploring a new place.
        </p>
      </header>

      <div className="audience-grid">
        {audiences.map(
          ({
            title,
            description,
            icon: Icon,
            color,
            image,
            imageAlt,
          }) => (
            <article className="audience-item" key={title}>
              <div className="audience-photo">
                <img
                  src={image}
                  alt={imageAlt}
                  loading="lazy"
                />
              </div>

              <h3>
                <span
                  className={`audience-category-icon ${color}`}
                >
                  <Icon size={14} strokeWidth={2.2} />
                </span>

                {title}
              </h3>

              <p>{description}</p>
            </article>
          ),
        )}
      </div>
    </section>
  )
}
