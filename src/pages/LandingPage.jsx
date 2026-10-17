import Navbar from '../components/Landing Page/Navbar'
import Hero from '../components/Landing Page/Hero'
import AccessibilityFeatures from '../components/Landing Page/AccessibilityFeatures'
import HowItWorks from '../components/Landing Page/HowItWorks'
import FacilityPreview from '../components/Landing Page/FacilityPreview'
import AudienceSection from '../components/Landing Page/AudienceSection'
import CTASection from '../components/Landing Page/CTASection'
import Footer from '../components/Landing Page/Footer'

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <Navbar />

      <main>
        <Hero />
        <AccessibilityFeatures />
        <AudienceSection/>
        <FacilityPreview/>
        <HowItWorks/>
        <CTASection/>
      </main>

      <Footer/>
    </div>
  )
}

export default LandingPage