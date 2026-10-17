
import { useState } from 'react'
import {
  MapPin,
  Search,
  Menu,
  X,
} from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8"
      >
        {/* Brand */}
        <a
          href="#home"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="AccessFind home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
            <MapPin size={23} strokeWidth={2.5} />
          </span>

          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Access<span className="text-blue-600">Find</span>
          </span>
        </a>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`relative py-2 text-[13px] font-semibold transition-colors ${
                link.label === 'Home'
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              {link.label}

              {link.label === 'Home' && (
                <span className="absolute right-0 bottom-[-20px] left-0 h-0.5 rounded-full bg-blue-600" />
              )}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="#facilities"
          className="hidden items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-[13px] font-bold text-white shadow-md shadow-blue-700/15 transition hover:bg-blue-800 sm:inline-flex"
        >
          <Search size={15} strokeWidth={2.5} />
          Find Facilities
        </a>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-100 bg-white px-5 py-4 shadow-lg lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {link.label}
              </a>
            ))}

            <a
              href="#facilities"
              onClick={closeMenu}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
            >
              <Search size={16} />
              Find Facilities
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
