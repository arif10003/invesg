import React, { useState } from 'react';
import {
    Compass,
    Globe2,
    TrendingUp,
    Zap,
    Sprout,
    Factory,
    Building2,
    Truck,
    Droplets,
    Cpu,
    Building,
    CheckCircle2,
    X,
    ChevronRight,
    ChevronDown,
    ChevronLeft,
    Bookmark,
    Share2,
    Plus,
    Minus,
    Maximize2,
    ArrowUpRight,
    ArrowRight,
    Info,
    Shield,
    FileText,
    Newspaper,
    BookOpen,
    PieChart
} from 'lucide-react';
import Navbar from '../components/Navbar';
import OpportunityCollaboration from '../components/opportunity/OpportunityCollaboration';

export default function OpportunityIntelligence() {
    const [selectedSector, setSelectedSector] = useState('Mining');
    const [selectedRegion, setSelectedRegion] = useState('Indonesia');
    const [selectedTheme, setSelectedTheme] = useState('All Themes');

    const sectors = [
        { name: 'Mining', count: '1,248 Opportunities', icon: Compass, active: true },
        { name: 'Energy', count: '1,386 Opportunities', icon: Zap },
        { name: 'Agriculture & Food', count: '932 Opportunities', icon: Sprout },
        { name: 'Manufacturing / Industry', count: '1,102 Opportunities', icon: Factory },
        { name: 'Finance & Capital Markets', count: '723 Opportunities', icon: Building2 },
        { name: 'Transport & Logistics', count: '682 Opportunities', icon: Truck },
        { name: 'Water & Waste', count: '486 Opportunities', icon: Droplets }
    ];

    const themes = [
        'All Themes',
        'Critical Minerals',
        'Carbon Markets',
        'Carbon Capture & CCUS',
        'Carbon Economic Value',
        'Responsible Mining',
        'Water Stewardship',
        'Energy Transition',
        'Biodiversity',
        'Circular Economy'
    ];

    const opportunityCards = [
        {
            title: 'Critical Minerals & Battery Value Chain',
            desc: 'Growing global demand for nickel, cobalt, lithium, copper, rare earths.',
            status: 'High Momentum',
            signals: '128 Signals',
            badgeColor: 'bg-emerald-100 text-emerald-800'
        },
        {
            title: 'Responsible Mining & ESG Excellence',
            desc: 'Improving environmental management, social license, transparency.',
            status: 'Rising',
            signals: '96 Signals',
            badgeColor: 'bg-amber-100 text-amber-800'
        },
        {
            title: 'Mine Closure & Rehabilitation',
            desc: 'Reclamation, biodiversity restoration, post-mining land use.',
            status: 'Emerging',
            signals: '72 Signals',
            badgeColor: 'bg-amber-100 text-amber-800'
        },
        {
            title: 'Low Carbon Mining Operations',
            desc: 'Renewable energy, energy efficiency, low-emission operations.',
            status: 'Rising',
            signals: '88 Signals',
            badgeColor: 'bg-emerald-100 text-emerald-800'
        },
        {
            title: 'Circular Economy in Mining',
            desc: 'Waste valorization, tailings management, water reuse, circular inputs.',
            status: 'Emerging',
            signals: '64 Signals',
            badgeColor: 'bg-amber-100 text-amber-800'
        },
        {
            title: 'Carbon Markets & Project Integrity',
            desc: 'Eligibility, methodology, MRV, demand, pricing, and claims-governance signals.',
            status: 'Rising',
            signals: '84 Signals',
            badgeColor: 'bg-emerald-100 text-emerald-800'
        },
        {
            title: 'Carbon Capture & CCUS',
            desc: 'Capture, transport, utilisation, storage integrity, infrastructure, and policy readiness.',
            status: 'Developing',
            signals: '67 Signals',
            badgeColor: 'bg-amber-100 text-amber-800'
        },
        {
            title: 'Carbon Economic Value',
            desc: 'Carbon cost, avoided emissions, incentives, credit potential, and risk-adjusted value.',
            status: 'Emerging',
            signals: '59 Signals',
            badgeColor: 'bg-amber-100 text-amber-800'
        }
    ];

    const topOpportunities = [
        {
            name: 'Nickel Downstream & Battery Materials',
            momentum: 'High',
            outlook: 'Short–Medium Term',
            badgeBg: 'bg-emerald-100 text-emerald-800'
        },
        {
            name: 'Carbon Management in Mining',
            momentum: 'Rising',
            outlook: 'Medium–Long Term',
            badgeBg: 'bg-amber-100 text-amber-800'
        },
        {
            name: 'Renewable Power for Mining Operations',
            momentum: 'Rising',
            outlook: 'Short–Medium Term',
            badgeBg: 'bg-amber-100 text-amber-800'
        },
        {
            name: 'Tailings Reprocessing & Resource Recovery',
            momentum: 'Emerging',
            outlook: 'Medium–Long Term',
            badgeBg: 'bg-amber-100 text-amber-800'
        },
        {
            name: 'Biodiversity Net Gain in Mining Areas',
            momentum: 'Emerging',
            outlook: 'Long Term',
            badgeBg: 'bg-amber-100 text-amber-800'
        }
    ];

    return (
        <div className="min-h-screen bg-[#faf8f5] text-slate-800 font-sans flex flex-col">
            {/* Existing Navbar */}
            <Navbar activeNavItem="Opportunity Intelligence" />

            {/* Main Grid Wrapper matching exact 3-column architecture */}
            <main className="flex-1 w-full max-w-[1720px] mx-auto px-6 py-6 grid grid-cols-12 gap-6 items-start">

                {/* =========================================================================
            LEFT COLUMN (3 Cols) — FILTERS & CATEGORIES
           ========================================================================= */}
                <aside className="col-span-4 lg:col-span-1 flex flex-col gap-5">

                    {/* Explore Opportunities Box */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-teal-900 mb-1">
                            Explore Opportunities
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">Choose your starting point</p>

                        <div className="space-y-2.5">
                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-700 transition group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-teal-50 text-teal-800 rounded-lg group-hover:bg-teal-100">
                                        <Compass size={18} />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-xs font-bold text-slate-800">By Sector</span>
                                        <span className="text-[10.5px] text-slate-500">Explore across industries</span>
                                    </div>
                                </div>
                                <ArrowRight size={14} className="text-slate-400 group-hover:text-teal-800" />
                            </button>

                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-700 transition group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-teal-50 text-teal-800 rounded-lg group-hover:bg-teal-100">
                                        <Globe2 size={18} />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-xs font-bold text-slate-800">By Geography</span>
                                        <span className="text-[10.5px] text-slate-500">Explore across regions & countries</span>
                                    </div>
                                </div>
                                <ArrowRight size={14} className="text-slate-400 group-hover:text-teal-800" />
                            </button>
                        </div>
                    </div>

                    {/* Active Selections */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                            Active Selections
                        </h4>
                        <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-teal-50/60 border border-teal-200 rounded-lg text-xs font-medium text-teal-900">
                                <span className="flex items-center gap-1.5"><Compass size={13} /> Sector: <strong>{selectedSector}</strong></span>
                                <X size={13} className="cursor-pointer hover:text-red-500" />
                            </div>
                            <div className="flex items-center justify-between px-3 py-1.5 bg-teal-50/60 border border-teal-200 rounded-lg text-xs font-medium text-teal-900">
                                <span className="flex items-center gap-1.5">🇮🇩 Region: <strong>{selectedRegion}</strong></span>
                                <X size={13} className="cursor-pointer hover:text-red-500" />
                            </div>
                            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                                <span>Timeframe: <strong>Current</strong></span>
                                <X size={13} className="cursor-pointer hover:text-red-500" />
                            </div>
                        </div>
                        <button className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1">
                            <X size={12} /> Clear all selections
                        </button>
                    </div>

                    {/* Sector Tree Navigation */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Sector Categories
                            </span>
                            <ChevronDown size={14} className="text-slate-400" />
                        </div>

                        <nav className="space-y-1 text-xs">
                            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-left">
                                <Globe2 size={15} /> All Sectors
                            </button>
                            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-left">
                                <Zap size={15} /> Energy
                            </button>
                            <button className="w-full flex items-center justify-between px-3 py-2 bg-teal-50 text-teal-900 font-semibold rounded-lg text-left">
                                <span className="flex items-center gap-2.5">
                                    <Compass size={15} className="text-teal-800" /> Mining
                                </span>
                                <CheckCircle2 size={14} className="text-teal-800" />
                            </button>
                            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-left">
                                <Sprout size={15} /> Agriculture & Food
                            </button>
                            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-left">
                                <Factory size={15} /> Manufacturing / Industry
                            </button>
                            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-left">
                                <Building2 size={15} /> Finance & Capital Markets
                            </button>
                            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-left">
                                <Truck size={15} /> Transport & Logistics
                            </button>
                            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-left">
                                <Building size={15} /> Construction & Real Estate
                            </button>
                            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-left">
                                <Droplets size={15} /> Water & Waste
                            </button>
                            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-left">
                                <Cpu size={15} /> Technology & Digital
                            </button>
                        </nav>

                        <button className="mt-4 text-[11px] font-bold text-teal-800 hover:underline flex items-center gap-1">
                            View all sectors
                        </button>

                        {/* Saved Explorations */}
                        <div className="mt-5 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition">
                            <div className="flex items-center gap-2.5">
                                <Bookmark size={15} className="text-teal-800" />
                                <div>
                                    <span className="block text-xs font-bold text-slate-800">Saved Explorations</span>
                                    <span className="text-[10px] text-slate-500">View saved opportunity searches</span>
                                </div>
                            </div>
                            <ArrowRight size={14} className="text-slate-400" />
                        </div>
                    </div>
                </aside>

                {/* =========================================================================
            CENTER COLUMN (6 Cols) — HERO, SECTORS, LANDSCAPE, TABLE
           ========================================================================= */}
                <section className="col-span-4 lg:col-span-1 flex flex-col gap-5">

                    {/* Banner Hero */}
                    <div className="bg-gradient-to-r from-amber-50/60 via-white to-amber-50/30 border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-xs">
                        <h1 className="text-2xl md:text-3xl font-serif text-slate-900 mb-2">
                            Opportunity Intelligence
                        </h1>
                        <p className="text-xs text-slate-600 max-w-lg leading-relaxed mb-6">
                            Discover transition opportunities across industries and regions. Focus on the journey to sustainable value creation.
                        </p>

                        {/* Step Process Diagram */}
                        <div className="grid grid-cols-5 gap-2 items-center text-center">
                            {[
                                { label: 'Explore', sub: 'Sectors / Regions', icon: Compass },
                                { label: 'Identify', sub: 'Signals & Trends', icon: TrendingUp },
                                { label: 'Assess', sub: 'Transition Momentum', icon: Zap },
                                { label: 'Discover', sub: 'Opportunities', icon: Sprout },
                                { label: 'Take', sub: 'Action', icon: ArrowUpRight }
                            ].map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center relative">
                                    <div className="w-10 h-10 rounded-full bg-white border border-teal-200 flex items-center justify-center text-teal-800 mb-2 shadow-xs">
                                        <step.icon size={18} />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-800">{step.label}</span>
                                    <span className="text-[9px] text-slate-500 leading-tight">{step.sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Explore By Sector (Horizontal Carousel Grid) */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Explore by Sector
                            </h3>
                        </div>

                        <div className="relative">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                                {sectors.slice(0, 6).map((sec) => (
                                    <button
                                        key={sec.name}
                                        onClick={() => setSelectedSector(sec.name)}
                                        className={`p-3 rounded-xl border flex flex-col items-center text-center transition ${sec.name === selectedSector
                                            ? 'bg-teal-50/70 border-teal-700 text-teal-900 ring-1 ring-teal-700'
                                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                            }`}
                                    >
                                        <sec.icon size={20} className={sec.name === selectedSector ? 'text-teal-800' : 'text-slate-500'} />
                                        <span className="text-[11px] font-bold mt-2 leading-tight">{sec.name}</span>
                                        <span className="text-[9.5px] text-slate-400 mt-1">{sec.count.split(' ')[0]}</span>
                                    </button>
                                ))}
                            </div>
                            <button className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50">
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Opportunity Landscape Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                                Opportunity Landscape — {selectedSector.toUpperCase()} IN {selectedRegion.toUpperCase()}
                            </h2>
                        </div>

                        {/* Filter Tags */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
                            {themes.map((th) => (
                                <button
                                    key={th}
                                    onClick={() => setSelectedTheme(th)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${th === selectedTheme
                                        ? 'bg-teal-800 text-white'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {th}
                                </button>
                            ))}
                        </div>

                        {/* Opportunity Cards (Multi-column responsive grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {opportunityCards.map((card, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-teal-700 transition">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-800">
                                                <Compass size={14} />
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                                                {card.status}
                                            </span>
                                        </div>
                                        <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                                            {card.title}
                                        </h4>
                                        <p className="text-[10.5px] text-slate-500 line-clamp-2 leading-relaxed">
                                            {card.desc}
                                        </p>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                                        <span>{card.signals}</span>
                                        <TrendingUp size={12} className="text-emerald-600" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Emerging Opportunities Data Table */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-4">
                            Top Emerging Opportunities ({selectedRegion.toUpperCase()})
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-semibold">
                                        <th className="pb-2.5">Opportunity</th>
                                        <th className="pb-2.5">Transition Momentum</th>
                                        <th className="pb-2.5">Key Drivers</th>
                                        <th className="pb-2.5">Time Outlook</th>
                                        <th className="pb-2.5 text-right">Related</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {topOpportunities.map((opp, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/80 transition">
                                            <td className="py-3 font-semibold text-slate-800 pr-2">
                                                {opp.name}
                                            </td>
                                            <td className="py-3 pr-2">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${opp.badgeBg}`}>
                                                    {opp.momentum}
                                                </span>
                                            </td>
                                            <td className="py-3 text-slate-500 pr-2">
                                                <div className="flex items-center gap-1">
                                                    <Zap size={12} />
                                                    <Droplets size={12} />
                                                    <Sprout size={12} />
                                                    <span className="text-[10px] text-slate-400">+12</span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-slate-600 text-[11px] pr-2">
                                                {opp.outlook}
                                            </td>
                                            <td className="py-3 text-right">
                                                <button className="text-slate-400 hover:text-teal-800">
                                                    <Bookmark size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button className="mt-4 text-xs font-bold text-teal-800 hover:underline flex items-center gap-1">
                            View all opportunities in {selectedSector} <ArrowRight size={12} />
                        </button>
                    </div>

                    {/* Footer Ribbon on Main Panel */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-slate-700">Trending Opportunity Themes:</span>
                            <span className="bg-white px-2.5 py-1 rounded-full border text-[11px] text-slate-600">Energy Transition</span>
                            <span className="bg-white px-2.5 py-1 rounded-full border text-[11px] text-slate-600">Nature & Biodiversity</span>
                            <span className="bg-white px-2.5 py-1 rounded-full border text-[11px] text-slate-600">Water Security</span>
                        </div>
                        <button className="text-xs font-bold text-teal-800 flex items-center gap-1 hover:underline">
                            Learn More <ArrowRight size={12} />
                        </button>
                    </div>

                </section>

                {/* =========================================================================
            RIGHT COLUMN (3 Cols) — SPOTLIGHT & MAP INTENSITY
           ========================================================================= */}
                <aside className="col-span-4 lg:col-span-1 flex flex-col gap-5">

                    {/* Spotlight Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Opportunity Spotlight
                            </span>
                            <div className="flex items-center gap-2 text-slate-400">
                                <Bookmark size={14} className="cursor-pointer hover:text-slate-700" />
                                <Share2 size={14} className="cursor-pointer hover:text-slate-700" />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 mb-3">
                            <div className="p-2.5 bg-teal-50 text-teal-800 rounded-xl">
                                <Compass size={22} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                                    Critical Minerals & Battery Value Chain
                                </h3>
                                <span className="text-[11px] text-slate-500">Mining · Indonesia · High Momentum</span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                            Strong global demand, policy support, and investment in downstream processing create significant value.
                        </p>

                        {/* Momentum Gauges */}
                        <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                            <div>
                                <span className="block text-[10px] text-slate-400 font-medium">Research Momentum</span>
                                <span className="text-xs font-bold text-teal-900">High</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-slate-400 font-medium">Policy Momentum</span>
                                <span className="text-xs font-bold text-teal-900">Strong</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-slate-400 font-medium">News Momentum</span>
                                <span className="text-xs font-bold text-teal-900">High</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-slate-400 font-medium">Investment Momentum</span>
                                <span className="text-xs font-bold text-teal-900">Rising</span>
                            </div>
                        </div>

                        {/* Transition Graph */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] text-slate-400">Overall Transition Momentum</span>
                                <span className="text-xs font-bold text-teal-900">High & Accelerating</span>
                            </div>
                            <div className="h-10 flex items-end justify-between gap-1 text-[9px] text-slate-400">
                                <span>2022</span>
                                <span>2023</span>
                                <span>2024</span>
                                <span>2025</span>
                                <span>2026</span>
                            </div>
                        </div>

                        <button className="w-full py-2.5 bg-teal-800 text-white rounded-xl text-xs font-semibold hover:bg-teal-900 transition flex items-center justify-center gap-2">
                            Explore Full Opportunity <ArrowRight size={14} />
                        </button>
                    </div>

                    {/* Opportunity Map Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                                    Opportunity Intensity Map
                                </span>
                                <Info size={12} className="text-slate-400" />
                            </div>
                            <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 outline-none">
                                <option>Asia Pacific</option>
                            </select>
                        </div>

                        {/* Map Container */}
                        <div className="h-44 bg-slate-100 rounded-xl relative overflow-hidden border border-slate-200 flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-400">Map Graphic Overlay</span>

                            {/* Controls */}
                            <div className="absolute right-2.5 top-2.5 flex flex-col gap-1">
                                <button className="w-6 h-6 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-600 shadow-xs">
                                    <Plus size={12} />
                                </button>
                                <button className="w-6 h-6 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-600 shadow-xs">
                                    <Minus size={12} />
                                </button>
                                <button className="w-6 h-6 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-600 shadow-xs">
                                    <Maximize2 size={12} />
                                </button>
                            </div>

                            {/* Badge */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-teal-900 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                🇮🇩 Indonesia: Very High
                            </div>
                        </div>
                    </div>

                    {/* Related Intelligence Breakdown */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Related Intelligence
                            </span>
                            <a href="#" className="text-xs font-bold text-teal-800 hover:underline">
                                View All →
                            </a>
                        </div>

                        <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <Newspaper size={14} className="mx-auto text-blue-600 mb-1" />
                                <span className="block font-bold text-slate-800">124</span>
                                <span className="text-[8.5px] text-slate-400">News</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <PieChart size={14} className="mx-auto text-emerald-600 mb-1" />
                                <span className="block font-bold text-slate-800">58</span>
                                <span className="text-[8.5px] text-slate-400">Research</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <Shield size={14} className="mx-auto text-purple-600 mb-1" />
                                <span className="block font-bold text-slate-800">36</span>
                                <span className="text-[8.5px] text-slate-400">Policies</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <FileText size={14} className="mx-auto text-amber-600 mb-1" />
                                <span className="block font-bold text-slate-800">41</span>
                                <span className="text-[8.5px] text-slate-400">Reports</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <BookOpen size={14} className="mx-auto text-pink-600 mb-1" />
                                <span className="block font-bold text-slate-800">18</span>
                                <span className="text-[8.5px] text-slate-400">Projects</span>
                            </div>
                        </div>
                    </div>

                </aside>

            </main>

            <OpportunityCollaboration />

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-4 px-6 mt-auto text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">invesg</span>
                    <span>— ESG as a Lens. Strategic insights for sustainable value.</span>
                </div>
                <div className="flex items-center gap-6 text-[11px]">
                    <span>© 2026 invesg. All rights reserved.</span>
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:underline">Terms of Use</a>
                    <a href="#" className="hover:underline">Contact Us</a>
                </div>
            </footer>
        </div>
    );
}
