import React from 'react';
import { Search, Bookmark, Share2, Menu, X } from 'lucide-react';
import BrandLogo from './BrandLogo';

export function SustainabilityHeader({
  navItems = ['Sustainability Intelligence', 'Opportunity Intelligence', 'Insights', 'Solutions', 'About', 'Contact'],
  onSearch = () => {},
  showSearch = true
}) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const navHrefs = {
    'Sustainability Intelligence': '/sustainability/indonesia',
    'Opportunity Intelligence': '/#explore',
    'Insights': '/insights',
    'Solutions': '/#explore',
    'About': '/about',
    'Contact': '/contact'
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <>
      {/* Top Bar with Logo and Search */}
      <div className="wrap" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '16px 0',
        borderBottom: '1px solid #eee'
      }}>
        <a className="brand-logo-link" href="/" aria-label="invesg home">
          <BrandLogo placement="header" />
        </a>
        
        {showSearch && (
          <form 
            onSubmit={handleSearch}
            style={{
              flex: 1,
              margin: '0 40px',
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <Search size={18} style={{ 
              position: 'absolute', 
              left: '12px', 
              color: '#999',
              pointerEvents: 'none'
            }} />
            <input
              type="text"
              placeholder="Search intelligence (e.g., climate risk, water security, carbon pricing...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '13px',
                background: 'white'
              }}
            />
          </form>
        )}

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button style={{ 
            display: 'none',
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            '@media (max-width: 768px)': { display: 'block' }
          }}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="wrap" style={{ 
        display: 'flex', 
        gap: '30px',
        borderBottom: '2px solid #f0f0f0',
        overflowX: 'auto'
      }}>
        {navItems.map(item => (
          <a
            key={item}
            href={navHrefs[item] || '/'}
            style={{
              padding: '16px 0',
              fontSize: '13px',
              fontWeight: '500',
              color: '#333',
              textDecoration: 'none',
              borderBottom: '3px solid transparent',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--brand-link)';
              e.target.style.borderBottomColor = 'var(--teal)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#333';
              e.target.style.borderBottomColor = 'transparent';
            }}
          >
            {item}
          </a>
        ))}
      </div>
    </>
  );
}

export default SustainabilityHeader;
