import React, { useState } from 'react';
import { Menu, X, Instagram, Share2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
}

const NAV_LINKS = [
  { label: 'Flavors', href: '#flavors' },
  { label: 'Our Story', href: '#our-story' },
  { label: 'Best Sellers', href: '#best-sellers' },
  { label: 'Offers', href: '#offers' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar({ onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileOpen(false);
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href.replace('#', ''));
    }
  };

  return (
    <header className="relative z-40 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, '#hero')}
          aria-label="Swirl Creamery Home"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a1a2e] rounded-xl"
        >
          <BrandLogo variant="dark" size="md" />
        </a>

        {/* Desktop Nav Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#3d0f1f]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="relative py-1 whitespace-nowrap shrink-0 text-[#3d0f1f]/85 hover:text-[#3d0f1f] transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#5a1a2e] after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a1a2e] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Social Icons + Mobile Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, '#contact')}
            aria-label="Follow Swirl Creamery on Instagram"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#3d0f1f]/15 text-[#3d0f1f] hover:bg-[#3d0f1f] hover:text-[#fcecf0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a1a2e]"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, '#contact')}
            aria-label="Share Swirl Creamery"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#3d0f1f]/15 text-[#3d0f1f] hover:bg-[#3d0f1f] hover:text-[#fcecf0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a1a2e]"
          >
            <Share2 className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#3d0f1f]/10 text-[#3d0f1f] hover:bg-[#3d0f1f]/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a1a2e]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden mx-4 mb-3 rounded-[1.5rem] bg-[#fcecf0]/95 backdrop-blur-md border border-[#3d0f1f]/10 p-4 shadow-burgundy"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-[#3d0f1f] hover:bg-[#f3c9d4]/50 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
