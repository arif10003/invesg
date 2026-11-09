import React from 'react';
import { Search, Menu, X } from 'lucide-react';
import BrandLogo from './BrandLogo';
import AccountMenu from './auth/AccountMenu';
import '../styles.css';

// Inline SVGs for social media icons
export const LinkedinIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export const InstagramIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Navbar({
  activeNavItem = '',
  onSearch = () => { },
  onNavItemClick = () => { },
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const navItems = [
    'Sustainability Intelligence',
    'Opportunity Intelligence',
    'Insights',
    'Solutions',
    'Academy',
    'About',
    'Join Us',
    'Contact'
  ];
  const navHrefs = {
    'Sustainability Intelligence': '/sustainability',
    'Opportunity Intelligence': '/opportunity',
    'Insights': '/insights',
    'Solutions': '/solutions',
    'Academy': '/academy',
    'Join Us': '/join-us',
    'About': '/about',
    'Contact': '/contact'
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="navbar-container" style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        maxWidth: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Left Side: original logo and slogan */}
        <div className="navbar-brand-group" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <a href="/" style={{ display: 'block', textDecoration: 'none' }}>
            <BrandLogo placement="navbar" />
          </a>

          {/* Vertical Divider */}
          <div style={{
            width: '1px',
            height: '32px',
            backgroundColor: '#e5e7eb',
            display: 'block'
          }} />

          {/* Slogan */}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              color: 'var(--navy)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ESG as a Lens
            </span>
            <span style={{
              fontSize: '10px',
              color: '#6b7280',
              fontWeight: '500',
              whiteSpace: 'nowrap'
            }}>
              Strategic insights for sustainable value.
            </span>
          </div>
        </div>

        {/* Middle: Search bar */}
        <form onSubmit={handleSearchSubmit} style={{
          flex: '1 1 300px',
          maxWidth: '480px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '14px',
            color: '#9ca3af',
            pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="Search intelligence (e.g., climate risk, water security, carbon pricing...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              borderRadius: '9999px',
              border: '1px solid #d1d5db',
              fontSize: '12.5px',
              outline: 'none',
              background: '#f9fafb',
              color: '#111827',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--teal)';
              e.target.style.boxShadow = '0 0 0 3px rgba(14, 154, 129, 0.15)';
              e.target.style.background = '#fff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
              e.target.style.background = '#f9fafb';
            }}
          />
        </form>

        {/* Right Side: navigation and account CTA */}
        <div className="nav-right-section" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          {/* Navigation Links */}
          <nav className="nav-links" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {navItems.map((item) => {
              const isActive = item === activeNavItem;
              return (
                <a
                  key={item}
                  href={navHrefs[item]}
                  aria-current={item === activeNavItem ? 'page' : undefined}
                  onClick={() => onNavItemClick(item)}
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: isActive ? 'var(--brand-link)' : '#374151',
                    textDecoration: 'none',
                    padding: '6px 0',
                    position: 'relative',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = 'var(--brand-link)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.color = '#374151';
                  }}
                >
                  {item}
                  {isActive && (
                    <span style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: 'var(--teal)',
                      borderRadius: '9999px'
                    }} />
                  )}
                </a>
              );
            })}
          </nav>

          <AccountMenu />

        </div>

        {/* Mobile Hamburger menu toggle */}
        <button
          className="mobile-hamburger"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          aria-controls="site-mobile-navigation"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: '#374151'
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav overlay */}
      {isOpen && (
        <div id="site-mobile-navigation" className="mobile-menu-overlay" style={{
          display: 'none',
          flexDirection: 'column',
          gap: '12px',
          padding: '16px 0',
          borderTop: '1px solid #e5e7eb',
          marginTop: '12px'
        }}>
          {navItems.map((item) => (
            <a
              key={item}
              href={navHrefs[item]}
              aria-current={item === activeNavItem ? 'page' : undefined}
              onClick={() => {
                onNavItemClick(item);
                setIsOpen(false);
              }}
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: item === activeNavItem ? 'var(--brand-link)' : '#374151',
                textDecoration: 'none',
                padding: '6px 0'
              }}
            >
              {item}
            </a>
          ))}
          <AccountMenu mobile onNavigate={() => setIsOpen(false)} />
        </div>
      )}

      {/* Style overrides for media queries */}
      <style>{`
        /* Allow the extended original menu to wrap without changing its styling. */
        .navbar-container .nav-right-section { max-width: 100%; flex-wrap: wrap; }
        .navbar-container .nav-links { min-width: 0; flex-wrap: wrap; }
        .navbar-container form { min-width: 0; }
        .navbar-container .navbar-brand-group { max-width: 100%; min-width: 0; }
        .navbar-container .navbar-brand-group > a { flex-shrink: 0; }
        .navbar-container .navbar-brand-group > div:last-child { min-width: 0; }
        @media (max-width: 640px) {
          .navbar-container .navbar-brand-group > div:last-child span:last-child { white-space: normal !important; }
        }
        @media (max-width: 1024px) {
          .nav-right-section {
            display: none !important;
          }
          .mobile-hamburger {
            display: block !important;
          }
          .mobile-menu-overlay {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
