
import { ArrowRight } from 'lucide-react'
import heroFamilyIllustration from '../../assets/images/hero-family-illustration.png'

export default function CTASection() {
  function handleFindFacilities() {
    document.getElementById('home')?.scrollIntoView({
      behavior: 'smooth',
    })

    window.setTimeout(() => {
      document.querySelector('#home input')?.focus()
    }, 400)
  }

  return (
    <section className="cta-section" id="contact">
      {/* Family illustration background layer */}
      <img
        className="cta-background"
        src={heroFamilyIllustration}
        alt=""
        aria-hidden="true"
      />

      <div className="cta-container">
        {/* Left: text content */}
        <div className="cta-content">
          <h2>
            A More Accessible
            <span>and Inclusive World</span>
          </h2>

          <p>
            Whether you're close to home or exploring a new place,
            AccessFind helps you find the right public facility with
            clear and reliable information.
          </p>
        </div>

        {/* Right: button and trust text */}
        <div className="cta-action">
          <button
            type="button"
            className="cta-button"
            onClick={handleFindFacilities}
          >
            Find Facilities Now
            <ArrowRight size={16} />
          </button>

          <div className="cta-trust">
            <span>No account required</span>
            <span className="cta-trust-divider" />
            <span>Free to use</span>
          </div>
        </div>
      </div>
    </section>
  )
}
