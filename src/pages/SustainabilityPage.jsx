import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  Share2,
  Search,
  ChevronDown,
  ChevronRight,
  MapPin,
  Sliders,
  Calendar,
  Shield,
  Users,
  Plus,
  Minus,
  Layers,
  Activity,
  FileText,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Globe
} from 'lucide-react';
import Navbar from '../components/Navbar';
import BrandLogo from '../components/BrandLogo';
import SustainabilityCollaboration from '../components/sustainability/SustainabilityCollaboration';
import '../styles.css';
import regionalData from '../mockdata/RegionalData';

// Default mappings for regions not listed explicitly to avoid crashes
const getRegionData = (regionName) => {
  if (regionalData[regionName]) {
    return regionalData[regionName];
  }
  // Fallback to Indonesia
  return regionalData.Indonesia;
};

export default function SustainabilityPage() {
  const { region } = useParams();
  const navigate = useNavigate();

  // Convert slug/param like "indonesia" or "java" to capitalized version "Indonesia" or "Java"
  const formattedRegion = region
    ? region.charAt(0).toUpperCase() + region.slice(1).toLowerCase()
    : 'Indonesia';

  const [selectedGeography, setSelectedGeography] = React.useState(formattedRegion);
  const [searchRegionQuery, setSearchRegionQuery] = React.useState('');
  const [selectedIndustry, setSelectedIndustry] = React.useState('All Industries');
  const [selectedPillar, setSelectedPillar] = React.useState('All Pillars');
  const [selectedTopic, setSelectedTopic] = React.useState('All Topics');
  const [timeRange, setTimeRange] = React.useState('All Time');
  const [activeTab, setActiveTab] = React.useState('All');

  // Interactive Map Settings
  const [zoomScale, setZoomScale] = React.useState(1);
  const [mapLayer, setMapLayer] = React.useState('eco'); // 'eco' or 'boundaries'

  // Interactivity Actions
  const [isSaved, setIsSaved] = React.useState(false);
  const [showShareToast, setShowShareToast] = React.useState(false);

  // Sync state if URL route parameter changes
  React.useEffect(() => {
    if (region) {
      const capRegion = region.charAt(0).toUpperCase() + region.slice(1).toLowerCase();
      setSelectedGeography(capRegion);
    }
  }, [region]);

  const handleGeographySelect = (geo) => {
    setSelectedGeography(geo);
    // Push route if standard route exists
    const slug = geo.toLowerCase().replace(' & ', '-');
    if (['indonesia', 'sumatera', 'java', 'kalimantan', 'sulawesi', 'papua'].includes(slug)) {
      navigate(`/sustainability/${slug}`);
    }
  };

  const handleResetFilters = () => {
    setSelectedGeography('Indonesia');
    setSearchRegionQuery('');
    setSelectedIndustry('All Industries');
    setSelectedPillar('All Pillars');
    setSelectedTopic('All Topics');
    setTimeRange('All Time');
    setActiveTab('All');
    setZoomScale(1);
    navigate('/sustainability/indonesia');
  };

  const currentData = getRegionData(selectedGeography);

  const geographyTree = [
    { name: 'Global Overview', path: 'global' },
    { name: 'Asia Pacific', path: 'apac' },
    {
      name: 'Southeast Asia',
      path: 'sea',
      children: [
        {
          name: 'Indonesia',
          path: 'indonesia',
          children: [
            { name: 'Sumatera', path: 'sumatera' },
            { name: 'Java', path: 'java' },
            { name: 'Kalimantan', path: 'kalimantan' },
            { name: 'Sulawesi', path: 'sulawesi' },
            { name: 'Bali & Nusa Tenggara', path: 'bali' },
            { name: 'Maluku', path: 'maluku' },
            { name: 'Papua', path: 'papua' }
          ]
        },
        { name: 'Malaysia', path: 'malaysia', flag: '🇲🇾' },
        { name: 'Singapore', path: 'singapore', flag: '🇸🇬' },
        { name: 'Thailand', path: 'thailand', flag: '🇹🇭' },
        { name: 'Vietnam', path: 'vietnam', flag: '🇻🇳' },
        { name: 'Philippines', path: 'philippines', flag: '🇵🇭' }
      ]
    }
  ];

  const industries = [
    'All Industries',
    'Mining',
    'Energy',
    'Financial Services',
    'Manufacturing',
    'Agriculture',
    'Transportation',
    'Water',
    'Construction',
    'Government'
  ];

  const esgPillars = [
    'All Pillars',
    'Environmental',
    'Social',
    'Governance'
  ];

  const tabs = [
    'All',
    'News',
    'Research',
    'Policies',
    'Reports',
    'Standards',
    'Finance',
    'Projects'
  ];

  const renderGeoNode = (node, depth = 0) => {
    const isSelected = selectedGeography === node.name;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = true; // Auto expanded for simplicity and visual richness

    // Match search query if any
    const matchesSearch = node.name.toLowerCase().includes(searchRegionQuery.toLowerCase()) ||
      (node.children && node.children.some(child => child.name.toLowerCase().includes(searchRegionQuery.toLowerCase())));

    if (searchRegionQuery && !matchesSearch) return null;

    return (
      <div key={node.name} style={{ marginLeft: `${depth * 10}px` }}>
        <div
          onClick={() => !node.flag && handleGeographySelect(node.name)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 8px',
            borderRadius: '6px',
            cursor: node.flag ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: isSelected ? '700' : '500',
            color: isSelected ? 'var(--teal)' : '#374151',
            background: isSelected ? '#f0fdf4' : 'transparent',
            transition: 'background 0.2s',
            opacity: node.flag ? 0.75 : 1
          }}
          onMouseEnter={(e) => {
            if (!isSelected && !node.flag) e.currentTarget.style.background = '#f9fafb';
          }}
          onMouseLeave={(e) => {
            if (!isSelected && !node.flag) e.currentTarget.style.background = 'transparent';
          }}
        >
          {hasChildren ? (
            <ChevronDown size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />
          ) : (
            <div style={{ width: '14px', height: '14px', flexShrink: 0 }} />
          )}
          {node.flag && <span style={{ marginRight: '2px' }}>{node.flag}</span>}
          <span style={{ flexGrow: 1 }}>{node.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div style={{
            borderLeft: '1px dashed #d1d5db',
            marginLeft: '14px',
            marginTop: '2px',
            marginBottom: '4px',
            paddingLeft: '4px'
          }}>
            {node.children.map(child => renderGeoNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#faf8f3', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeNavItem="Sustainability Intelligence"
        onSearch={(query) => console.log('Searching for:', query)}
        onNavItemClick={(item) => console.log('Navigation to:', item)}
      />

      {/* Share Toast */}
      {showShareToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'var(--teal)',
          color: 'var(--navy)',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.2s'
        }}>
          <CheckCircle2 size={16} />
          Link copied to clipboard!
        </div>
      )}

      {/* Dashboard Main Area */}
      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: '280px 1fr 1fr',
        gap: '24px',
        boxSizing: 'border-box'
      }} className="dashboard-grid">

        {/* 1. Left Column: Sidebar Filters */}
        <aside style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          height: 'fit-content',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle leaves drawing background */}
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            right: '-20px',
            opacity: 0.08,
            width: '120px',
            height: '120px',
            pointerEvents: 'none',
            backgroundImage: "url('/assets/images/background.png')",
            backgroundSize: 'contain'
          }} />

          {/* Section: Explore */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>
              Explore
            </span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search region"
                value={searchRegionQuery}
                onChange={(e) => setSearchRegionQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 30px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Section: Geography */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Geography
              </span>
              <ChevronDown size={14} style={{ color: '#9ca3af' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {geographyTree.map(node => renderGeoNode(node))}
            </div>
          </div>

          {/* Section: Industry/Sector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Industry / Sector
              </span>
              <ChevronDown size={14} style={{ color: '#9ca3af' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {industries.map((ind) => (
                <label key={ind} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: '#374151' }}>
                  <input
                    type="radio"
                    name="industry"
                    checked={selectedIndustry === ind}
                    onChange={() => setSelectedIndustry(ind)}
                    style={{
                      accentColor: 'var(--teal)',
                      width: '14px',
                      height: '14px'
                    }}
                  />
                  <span>{ind}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section: ESG Pillar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>
                ESG Pillar
              </span>
              <ChevronDown size={14} style={{ color: '#9ca3af' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {esgPillars.map((pillar) => (
                <label key={pillar} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: '#374151' }}>
                  <input
                    type="radio"
                    name="pillar"
                    checked={selectedPillar === pillar}
                    onChange={() => setSelectedPillar(pillar)}
                    style={{
                      accentColor: 'var(--teal)',
                      width: '14px',
                      height: '14px'
                    }}
                  />
                  <span>{pillar}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section: Topics */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>
              Topics
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                ['All Topics', null],
                ['Carbon Market Integrity', 'Governance'],
                ['Carbon Capture & Storage', 'Environmental'],
                ['Carbon Economic Value', 'Governance'],
                ['Water Security', 'Environmental'],
                ['Biodiversity & Nature', 'Environmental'],
                ['Community & Just Transition', 'Social']
              ].map(([topic,pillar]) => <button key={topic} onClick={()=>{setSelectedTopic(topic);if(pillar)setSelectedPillar(pillar)}} style={{textAlign:'left',padding:'7px 9px',borderRadius:'7px',border:selectedTopic===topic?'1px solid var(--teal)':'1px solid transparent',background:selectedTopic===topic?'#f0fdf4':'transparent',color:selectedTopic===topic?'var(--teal)':'#4b5563',fontSize:'11.5px',fontWeight:selectedTopic===topic?'700':'500',cursor:'pointer'}}>{topic}</button>)}
            </div>
          </div>

          {/* Section: Time Range */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
              Time Range
            </span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12.5px',
                outline: 'none',
                background: 'white'
              }}
            >
              <option value="All Time">All Time</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 1 Year">Last 1 Year</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleResetFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: '1px solid #d1d5db',
              background: 'white',
              borderRadius: '8px',
              padding: '10px',
              cursor: 'pointer',
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#374151',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
          >
            <RotateCcw size={14} />
            Reset All Filters
          </button>
        </aside>

        {/* 2. Middle Column: Discover and Map Area */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Map Card */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            position: 'relative',
            minHeight: '450px'
          }}>
            {/* Top header details inside card */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '4px' }}>
                Discover
              </span>
              <h2 style={{
                fontSize: '28px',
                fontFamily: "var(--font-heading)",
                fontWeight: '500',
                color: 'var(--navy)',
                margin: '0 0 4px 0'
              }}>
                {selectedGeography}
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                Explore sustainability intelligence by location
              </p>
              {/* Highlight green bar */}
              <div style={{ width: '40px', height: '3px', backgroundColor: 'var(--teal)', marginTop: '10px' }} />
            </div>

            {/* Map Action Floating Controls */}
            <div style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              zIndex: 10
            }}>
              <button
                onClick={() => setZoomScale(prev => Math.min(prev + 0.25, 2.5))}
                style={{
                  width: '36px', height: '36px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px',
                  display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#374151', fontWeight: 'bold'
                }}
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => setZoomScale(prev => Math.max(prev - 0.25, 0.5))}
                style={{
                  width: '36px', height: '36px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px',
                  display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#374151', fontWeight: 'bold'
                }}
              >
                <Minus size={16} />
              </button>
              <button
                onClick={() => { setZoomScale(1); handleGeographySelect('Indonesia'); }}
                title="Reset View"
                style={{
                  width: '36px', height: '36px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px',
                  display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#374151'
                }}
              >
                <Globe size={16} />
              </button>
              <button
                onClick={() => setMapLayer(prev => prev === 'eco' ? 'boundaries' : 'eco')}
                title="Toggle Layers"
                style={{
                  width: '36px', height: '36px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px',
                  display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#374151'
                }}
              >
                <Layers size={16} />
              </button>
            </div>

            {/* Map Canvas (SVG) */}
            <div style={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: '#fcfbf9',
              borderRadius: '12px',
              border: '1px solid #f3f4f6',
              backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}>

              {/* SVG Map of Indonesia */}
              <svg
                viewBox="0 0 540 300"
                style={{
                  width: '90%',
                  height: 'auto',
                  transform: `scale(${zoomScale})`,
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <g fill="none" strokeWidth="1.5">
                  {/* Grid Lines inside SVG */}
                  <line x1="0" y1="150" x2="540" y2="150" stroke="#f3e8d4" strokeWidth="0.5" strokeDasharray="3 3" />

                  {/* Ocean names / Geographic indicators */}
                  <text x="350" y="80" fill="#9ca3af" fontSize="9" fontWeight="600" letterSpacing="1px">South China Sea</text>
                  <text x="70" y="270" fill="#9ca3af" fontSize="9" fontWeight="600" letterSpacing="1px">Indian Ocean</text>
                  <text x="440" y="230" fill="#9ca3af" fontSize="9" fontWeight="600" letterSpacing="1px">Arafura Sea</text>

                  <text x="180" y="105" fill="#6b7280" fontSize="8" fontWeight="600" letterSpacing="1.5px">MALAYSIA</text>
                  <text x="430" y="105" fill="#6b7280" fontSize="8" fontWeight="600" letterSpacing="1.5px">PHILIPPINES</text>

                  {/* 1. Sumatera */}
                  <path
                    d="M 60,110 L 80,95 L 140,140 L 195,190 L 190,205 L 155,195 L 110,150 L 70,125 Z"
                    fill={selectedGeography === 'Sumatera' ? 'var(--teal)' : '#c2d6cf'}
                    stroke="#ffffff"
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                    onClick={() => handleGeographySelect('Sumatera')}
                    onMouseEnter={(e) => { if (selectedGeography !== 'Sumatera') e.currentTarget.style.fill = '#8ea89e'; }}
                    onMouseLeave={(e) => { if (selectedGeography !== 'Sumatera') e.currentTarget.style.fill = '#c2d6cf'; }}
                  />
                  <text x="105" y="145" fill="#111827" fontSize="8" fontWeight="bold" pointerEvents="none">SUMATERA</text>

                  {/* 2. Java */}
                  <path
                    d="M 195,212 L 230,212 L 280,216 L 315,217 L 315,224 L 280,222 L 210,218 L 195,214 Z"
                    fill={selectedGeography === 'Java' ? 'var(--teal)' : '#cbdad3'}
                    stroke="#ffffff"
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                    onClick={() => handleGeographySelect('Java')}
                    onMouseEnter={(e) => { if (selectedGeography !== 'Java') e.currentTarget.style.fill = '#8ea89e'; }}
                    onMouseLeave={(e) => { if (selectedGeography !== 'Java') e.currentTarget.style.fill = '#cbdad3'; }}
                  />
                  <text x="250" y="235" fill="#111827" fontSize="8" fontWeight="bold" pointerEvents="none">JAVA</text>

                  {/* 3. Kalimantan */}
                  <path
                    d="M 205,100 L 255,90 L 290,115 L 295,150 L 275,180 L 245,175 L 215,160 L 200,125 Z"
                    fill={selectedGeography === 'Kalimantan' ? 'var(--teal)' : '#b2c8c0'}
                    stroke="#ffffff"
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                    onClick={() => handleGeographySelect('Kalimantan')}
                    onMouseEnter={(e) => { if (selectedGeography !== 'Kalimantan') e.currentTarget.style.fill = '#8ea89e'; }}
                    onMouseLeave={(e) => { if (selectedGeography !== 'Kalimantan') e.currentTarget.style.fill = '#b2c8c0'; }}
                  />
                  <text x="225" y="135" fill="#111827" fontSize="8" fontWeight="bold" pointerEvents="none">KALIMANTAN</text>

                  {/* 4. Sulawesi */}
                  <path
                    d="M 310,120 L 325,120 L 335,135 L 355,135 L 340,145 L 345,165 L 332,152 L 325,175 L 320,155 L 305,152 L 315,135 Z"
                    fill={selectedGeography === 'Sulawesi' ? 'var(--teal)' : '#bad0c6'}
                    stroke="#ffffff"
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                    onClick={() => handleGeographySelect('Sulawesi')}
                    onMouseEnter={(e) => { if (selectedGeography !== 'Sulawesi') e.currentTarget.style.fill = '#8ea89e'; }}
                    onMouseLeave={(e) => { if (selectedGeography !== 'Sulawesi') e.currentTarget.style.fill = '#bad0c6'; }}
                  />
                  <text x="328" y="145" fill="#111827" fontSize="8" fontWeight="bold" pointerEvents="none">SULAWESI</text>

                  {/* 5. Papua */}
                  <path
                    d="M 410,130 L 430,130 L 445,140 L 475,138 L 485,148 L 475,155 L 480,165 L 455,175 L 425,165 L 420,150 Z"
                    fill={selectedGeography === 'Papua' ? 'var(--teal)' : '#cbdad3'}
                    stroke="#ffffff"
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                    onClick={() => handleGeographySelect('Papua')}
                    onMouseEnter={(e) => { if (selectedGeography !== 'Papua') e.currentTarget.style.fill = '#8ea89e'; }}
                    onMouseLeave={(e) => { if (selectedGeography !== 'Papua') e.currentTarget.style.fill = '#cbdad3'; }}
                  />
                  <text x="440" y="160" fill="#111827" fontSize="8" fontWeight="bold" pointerEvents="none">PAPUA</text>

                  {/* 6. Bali & Nusa Tenggara */}
                  <path
                    d="M 320,224 Q 350,226 380,225"
                    stroke="#8ea89e"
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleGeographySelect('Bali & Nusa Tenggara')}
                  />
                  <circle cx="320" cy="224" r="3" fill="var(--teal)" />
                  <circle cx="340" cy="225" r="3.5" fill="var(--teal)" />
                  <circle cx="360" cy="226" r="3" fill="var(--teal)" />
                  <circle cx="378" cy="225" r="3" fill="var(--teal)" />
                  <text x="325" y="240" fill="#111827" fontSize="7" fontWeight="bold" pointerEvents="none">BALI & NT</text>

                  {/* 7. Maluku */}
                  <circle cx="368" cy="135" r="2.5" fill="#7ba594" style={{ cursor: 'pointer' }} onClick={() => handleGeographySelect('Maluku')} />
                  <circle cx="380" cy="142" r="3" fill="#7ba594" style={{ cursor: 'pointer' }} onClick={() => handleGeographySelect('Maluku')} />
                  <circle cx="375" cy="155" r="2" fill="#7ba594" style={{ cursor: 'pointer' }} onClick={() => handleGeographySelect('Maluku')} />
                  <circle cx="392" cy="152" r="2.5" fill="#7ba594" style={{ cursor: 'pointer' }} onClick={() => handleGeographySelect('Maluku')} />
                  <circle cx="395" cy="165" r="3" fill="#7ba594" style={{ cursor: 'pointer' }} onClick={() => handleGeographySelect('Maluku')} />
                  <circle cx="385" cy="172" r="2" fill="#7ba594" style={{ cursor: 'pointer' }} onClick={() => handleGeographySelect('Maluku')} />
                  <text x="382" y="130" fill="#111827" fontSize="7" fontWeight="bold" pointerEvents="none">MALUKU</text>

                  {/* Central Country Tag */}
                  <g transform="translate(240, 150)">
                    <rect x="-40" y="-10" width="80" height="20" rx="4" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
                    <text x="0" y="3" fill="#111827" fontSize="9" fontWeight="bold" textAnchor="middle">INDONESIA</text>
                  </g>
                </g>
              </svg>

              {/* Map bottom popup badge */}
              <div
                onClick={() => handleGeographySelect('Indonesia')}
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'white',
                  border: '1px solid #eaeae5',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                  zIndex: 2,
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-50%) translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(-50%)'}
              >
                <span style={{ fontSize: '13px' }}>🇮🇩</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--navy)' }}>Indonesia</span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#d1d5db' }} />
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--brand-link)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View intelligence summary <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>

          {/* Stepper: HOW TO USE */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '14px' }}>⚙️</span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                How to use
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '8px'
            }} className="how-to-use-flow">
              {[
                { icon: <MapPin size={18} style={{ color: '#e07a5f' }} />, title: 'Choose a region', desc: 'from the menu or map' },
                { icon: <FileText size={18} style={{ color: '#3d5a80' }} />, title: 'See intelligence', desc: 'summary on the right' },
                { icon: <Sliders size={18} style={{ color: 'var(--brand-link)' }} />, title: 'Explore by', desc: 'category or filter' },
                { icon: <Activity size={18} style={{ color: '#98c1d9' }} />, title: 'View all items', desc: 'and insights' },
                { icon: <ExternalLink size={18} style={{ color: '#293241' }} />, title: 'Read original', desc: 'source from trusted providers' }
              ].map((step, index) => (
                <React.Fragment key={index}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    flex: '1'
                  }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: '#f9faf7',
                      display: 'grid',
                      placeItems: 'center',
                      marginBottom: '8px',
                      border: '1px solid #eaeae5'
                    }}>
                      {step.icon}
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#1f2937', display: 'block' }}>{step.title}</span>
                    <span style={{ fontSize: '9px', color: '#6b7280', display: 'block', marginTop: '2px', lineHeight: '1.2' }}>{step.desc}</span>
                  </div>
                  {index < 4 && (
                    <div style={{
                      alignSelf: 'center',
                      color: '#cbd5e1',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      paddingBottom: '20px'
                    }}>
                      ➔
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Right Column: Intelligence panel */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Header Panel */}
          <div>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>
              <span>Asia Pacific</span>
              <span>›</span>
              <span>Southeast Asia</span>
              <span>›</span>
              <span style={{ color: 'var(--brand-link)', fontWeight: '700' }}>{selectedGeography}</span>
            </div>

            {/* Title / Save / Share Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '26px' }}>
                  {selectedGeography === 'Indonesia' ? '🇮🇩' : '📍'}
                </span>
                <h1 style={{
                  fontSize: '32px',
                  fontFamily: "var(--font-heading)",
                  fontWeight: '500',
                  color: 'var(--navy)',
                  margin: 0
                }}>
                  {selectedGeography}
                </h1>
                {/* Favorites Star Indicator */}
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: isSaved ? '#f59e0b' : '#d1d5db',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Bookmark size={20} fill={isSaved ? '#f59e0b' : 'none'} style={{ transition: 'color 0.2s' }} />
                </button>
              </div>

              {/* Share Icon */}
              <button
                onClick={handleShareClick}
                style={{
                  background: 'none',
                  border: '1px solid #d1d5db',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  color: '#4b5563',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Intelligence Snapshot Grid */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>
              Intelligence Snapshot ⓘ
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px'
            }}>
              {[
                { val: currentData.assets, lbl1: 'Intelligence Assets', lbl2: 'Total', color: 'var(--navy)', bg: '#f9fafb' },
                { val: <Calendar size={18} style={{ color: 'var(--brand-link)' }} />, lbl1: 'Updated Today', lbl2: 'May 17, 2026', color: 'var(--brand-link)', bg: '#f9fafb' },
                { val: currentData.sources, lbl1: 'Sources Active', lbl2: 'Trusted Sources', color: 'var(--navy)', bg: '#f9fafb', icon: <Shield size={16} style={{ color: '#4b5563', display: 'inline', marginRight: '4px' }} /> },
                { val: <Users size={18} style={{ color: 'var(--navy)' }} />, lbl1: 'Official • Research', lbl2: 'News • Others', color: 'var(--navy)', bg: '#f9fafb' }
              ].map((card, i) => (
                <div key={i} style={{
                  background: card.bg,
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px 6px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '80px'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: card.color, marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                    {card.icon}{card.val}
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: '600', color: '#4b5563', display: 'block', lineHeight: '1.2' }}>{card.lbl1}</span>
                  <span style={{ fontSize: '8px', color: '#9ca3af', display: 'block', marginTop: '2px' }}>{card.lbl2}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Filter Tabs */}
          <div style={{
            borderBottom: '1px solid #e5e7eb',
            overflowX: 'auto',
            display: 'flex',
            gap: '12px'
          }}>
            {tabs.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12.5px',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? 'var(--teal)' : '#6b7280',
                    borderBottom: isActive ? '2px solid var(--teal)' : '2px solid transparent',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s'
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Category Cards (Grid / List based on tab) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {[
              { key: 'News', label: 'News', val: currentData.news, color: '#2563eb', icon: '📰' },
              { key: 'Research', label: 'Research', val: currentData.research, color: '#16a34a', icon: '📊' },
              { key: 'Policies', label: 'Policies & Regulations', val: currentData.policies, color: '#7c3aed', icon: '📋' },
              { key: 'Reports', label: 'Reports', val: currentData.reports, color: '#ea580c', icon: '📑' },
              { key: 'Standards', label: 'Standards & Frameworks', val: currentData.standards, color: '#0891b2', icon: '⚙️' },
              { key: 'Finance', label: 'Sustainable Finance', val: currentData.finance, color: '#db2777', icon: '💰' }
            ]
              .filter(card => activeTab === 'All' || activeTab.toLowerCase().includes(card.key.toLowerCase()))
              .map((card) => (
                <div key={card.key} style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '14px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
                  borderLeft: `4px solid ${card.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{card.icon}</span>
                      <h4 style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--navy)', margin: 0 }}>
                        {card.label} ({card.val.total})
                      </h4>
                    </div>
                    <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '600' }}>{card.val.days}</span>
                  </div>

                  {/* Metrics */}
                  <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--navy)' }}>{card.val.total}</span>
                      <span style={{ fontSize: '9px', color: '#6b7280', display: 'block' }}>Total</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--brand-link)' }}>{card.val.new}</span>
                      <span style={{ fontSize: '9px', color: '#6b7280', display: 'block' }}>New</span>
                    </div>
                  </div>

                  {/* Bullets List */}
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {card.val.items.map((item, idx) => (
                      <li key={idx} style={{
                        fontSize: '11.5px',
                        color: '#374151',
                        lineHeight: '1.4',
                        paddingLeft: '12px',
                        position: 'relative'
                      }}>
                        <span style={{ position: 'absolute', left: 0, color: '#9ca3af' }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Footer of Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid #f9fafb' }}>
                    <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: '500' }}>
                      Trusted Sources: {card.val.trusted}
                    </span>
                    <a href="#" style={{ fontSize: '10px', fontWeight: '700', color: 'var(--brand-link)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      View All <ArrowRight size={10} />
                    </a>
                  </div>
                </div>
              ))}

            {/* Special Section: Projects / Initiatives & Trending Topics (Only if 'All' or 'Projects' tab is active) */}
            {(activeTab === 'All' || activeTab === 'Projects') && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '16px'
              }}>
                {/* 1. Projects card */}
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '14px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
                  borderLeft: '4px solid #059669',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>🍃</span>
                      <h4 style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--navy)', margin: 0 }}>
                        Projects / Initiatives ({currentData.projects.total})
                      </h4>
                    </div>
                    <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '600' }}>{currentData.projects.days}</span>
                  </div>

                  {/* Metrics */}
                  <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--navy)' }}>{currentData.projects.total}</span>
                      <span style={{ fontSize: '9px', color: '#6b7280', display: 'block' }}>Total</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--brand-link)' }}>{currentData.projects.new}</span>
                      <span style={{ fontSize: '9px', color: '#6b7280', display: 'block' }}>New</span>
                    </div>
                  </div>

                  {/* Bullets List */}
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {currentData.projects.items.map((item, idx) => (
                      <li key={idx} style={{
                        fontSize: '11.5px',
                        color: '#374151',
                        lineHeight: '1.4',
                        paddingLeft: '12px',
                        position: 'relative'
                      }}>
                        <span style={{ position: 'absolute', left: 0, color: '#9ca3af' }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Card Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid #f9fafb' }}>
                    <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: '500' }}>
                      Trusted Sources: {currentData.projects.trusted}
                    </span>
                    <a href="#" style={{ fontSize: '10px', fontWeight: '700', color: 'var(--brand-link)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      View All <ArrowRight size={10} />
                    </a>
                  </div>
                </div>

                {/* 2. Trending Topics & Sparkline Card */}
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '14px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Trending Topics in {selectedGeography}
                  </span>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {currentData.trending.map((tag) => (
                      <button
                        key={tag}
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '600',
                          color: '#374151',
                          backgroundColor: '#f3f4f6',
                          border: '1px solid #e5e7eb',
                          borderRadius: '9999px',
                          padding: '4px 10px',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--teal)';
                          e.currentTarget.style.backgroundColor = '#f0fdf4';
                          e.currentTarget.style.color = 'var(--teal)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                          e.currentTarget.style.color = '#374151';
                        }}
                      >
                        # {tag}
                      </button>
                    ))}
                  </div>

                  {/* Sparkline Graph */}
                  <div style={{
                    marginTop: '8px',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #f9fafb 0%, #f0fdf4 100%)',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <span style={{ fontSize: '9px', fontWeight: '700', color: 'var(--brand-link)' }}>Activity Indicator</span>
                    <div style={{ height: '40px', display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                      <svg viewBox="0 0 200 40" style={{ width: '100%', height: '100%' }}>
                        {/* Sparkline path */}
                        <path
                          d={`M ${currentData.sparkline.map((val, idx) => `${idx * (200 / (currentData.sparkline.length - 1))},${40 - val}`).join(' L ')}`}
                          fill="none"
                          stroke="var(--teal)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Shaded area */}
                        <path
                          d={`M 0,40 L ${currentData.sparkline.map((val, idx) => `${idx * (200 / (currentData.sparkline.length - 1))},${40 - val}`).join(' L ')} L 200,40 Z`}
                          fill="url(#sparklineGrad)"
                          opacity="0.1"
                        />
                        <defs>
                          <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--teal)" />
                            <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer (Clean & Polish matching styling guidelines) */}
      <SustainabilityCollaboration />

      <footer style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        padding: '48px 32px 24px 32px',
        marginTop: 'auto',
        width: '100%'
      }}>
        {/* Change maxWidth from '1440px' to '100%' */}
        <div style={{
          width: '100%',
          maxWidth: '100%',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '40px'
        }} className="footer-grid">
          {/* Logo and Slogan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <a className="brand-logo-link" href="/" aria-label="invesg home">
              <BrandLogo placement="footer" />
            </a>
            <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
              ESG as a Lens.<br />Strategic insights for<br />sustainable value.
            </p>
            <small style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>
              © 2026 invesg. All rights reserved.
            </small>
          </div>

          {/* Column 2: Platform */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <b style={{ fontSize: '13px', color: '#111827', fontWeight: '700' }}>Platform</b>
            <a href="#" style={{ fontSize: '12px', color: '#4b5563', textDecoration: 'none' }}>Sustainability Intelligence</a>
            <a href="#" style={{ fontSize: '12px', color: '#4b5563', textDecoration: 'none' }}>Opportunity Intelligence</a>
            <a href="#" style={{ fontSize: '12px', color: '#4b5563', textDecoration: 'none' }}>Insights</a>
            <a href="#" style={{ fontSize: '12px', color: '#4b5563', textDecoration: 'none' }}>Solutions</a>
          </div>

          {/* Column 3: Resources */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <b style={{ fontSize: '13px', color: '#111827', fontWeight: '700' }}>Resources</b>
            <a href="#" style={{ fontSize: '12px', color: '#4b5563', textDecoration: 'none' }}>Reports</a>
            <a href="#" style={{ fontSize: '12px', color: '#4b5563', textDecoration: 'none' }}>Insights</a>
            <a href="#" style={{ fontSize: '12px', color: '#4b5563', textDecoration: 'none' }}>Glossary</a>
            <a href="#" style={{ fontSize: '12px', color: '#4b5563', textDecoration: 'none' }}>Methodology</a>
          </div>

          {/* Column 4: Company */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <b style={{ fontSize: '13px', color: '#111827', fontWeight: '700' }}>Company</b>
            <a href="/about" style={{ fontSize: '12px', color: '#4b5563', textDecoration: 'none' }}>About invesg</a>
            <a href="/about" style={{ fontSize: '12px', color: '#4b5563', textDecoration: 'none' }}>Our Approach</a>
            <a href="/contact" style={{ fontSize: '12px', color: '#4b5563', textDecoration: 'none' }}>Careers</a>
            <a href="/contact" style={{ fontSize: '12px', color: '#4b5563', textDecoration: 'none' }}>Contact Us</a>
          </div>

          {/* Column 5: Stay Informed Newsletter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <b style={{ fontSize: '13px', color: '#111827', fontWeight: '700' }}>Stay Informed</b>
            <p style={{ fontSize: '12px', color: '#4b5563', margin: 0 }}>
              Get the latest ESG intelligence straight to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', marginTop: '4px' }}>
              <input
                type="email"
                placeholder="Your email address"
                style={{
                  flex: 1,
                  height: '40px',
                  padding: '0 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px 0 0 6px',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
              <button style={{
                backgroundColor: 'var(--teal)',
                color: 'var(--navy)',
                border: 'none',
                borderRadius: '0 6px 6px 0',
                padding: '0 16px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Subscribe
              </button>
            </form>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <a href="#" style={{ fontSize: '11px', color: '#9ca3af', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ fontSize: '11px', color: '#9ca3af', textDecoration: 'none' }}>Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Embedded Global Styles for Responsive Layouts */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 240px 1fr !important;
          }
          /* Stack the 3rd column below on medium screens */
          .dashboard-grid > section:last-child {
            grid-column: 1 / -1;
          }
          .footer-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-grid > aside, 
          .dashboard-grid > section {
            grid-column: 1 / -1 !important;
          }
          .how-to-use-flow {
            flex-direction: column !important;
            align-items: center !important;
            gap: 16px !important;
          }
          .how-to-use-flow > div {
            width: 100% !important;
          }
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .footer-grid > div:first-child {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
