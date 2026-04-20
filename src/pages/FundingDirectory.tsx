import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, ExternalLink, Loader2, RefreshCw, Search, Building2, Landmark, Rocket, DollarSign, ArrowUpRight, MapPin, Target, BarChart3, Clock, ChevronRight } from 'lucide-react';
import { useFounder } from '../context/FounderContext';
import { generateWithAI } from '../lib/ai';

interface FundingSource {
    name: string;
    type: 'vc' | 'government' | 'accelerator' | 'angel' | 'grant';
    description: string;
    focus: string;
    stage: string;
    amount: string;
    deadline?: string;
    url: string;
    location: string;
    status: 'open' | 'upcoming' | 'rolling';
}

const TYPE_META: Record<string, { label: string; icon: any }> = {
    vc: { label: 'VC Fund', icon: Building2 },
    government: { label: 'Government', icon: Landmark },
    accelerator: { label: 'Accelerator', icon: Rocket },
    angel: { label: 'Angel', icon: DollarSign },
    grant: { label: 'Grant', icon: Landmark },
};

const STATUS_STYLE: Record<string, string> = {
    open: 'text-heading',
    upcoming: 'text-muted',
    rolling: 'text-muted',
};

export default function FundingDirectory() {
    const { profile } = useFounder();
    const [sources, setSources] = useState<FundingSource[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const fetchDirectory = async () => {
        setLoading(true);
        try {
            const industry = profile?.industry || 'technology';
            const stage = profile?.stage || 'seed';
            const prompt = `You are a startup funding research analyst. Generate a directory of 15 real, currently active funding sources relevant to a ${stage}-stage ${industry} startup.

Include a realistic mix of:
- Venture Capital firms (Sequoia, a16z, Accel, Y Combinator, local VCs)
- Government grants and startup schemes (Startup India, SBIR, EU Horizon, etc.)
- Accelerator programs (Techstars, 500 Global, etc.)
- Angel networks and syndicates
- Industry-specific grants

For each, return:
- name: Official name
- type: one of "vc", "government", "accelerator", "angel", "grant"
- description: 1-2 sentence description
- focus: industry/sector focus
- stage: target startup stage
- amount: typical check size or grant amount
- deadline: next deadline if applicable, or null
- url: real application or info URL
- location: headquarter location
- status: "open", "upcoming", or "rolling"

Return ONLY valid JSON array. No markdown:
[{"name":"...","type":"...","description":"...","focus":"...","stage":"...","amount":"...","deadline":null,"url":"...","location":"...","status":"..."}]`;

            const response = await generateWithAI(prompt);
            const cleanJson = response.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
            setSources(JSON.parse(cleanJson));
        } catch {
            setSources([
                { name: 'Y Combinator', type: 'accelerator', description: "World's top startup accelerator. $500K standard deal with 3-month batch program in San Francisco.", focus: 'All sectors', stage: 'Pre-seed to Seed', amount: '$500K', deadline: 'Mar & Sep', url: 'https://www.ycombinator.com/apply', location: 'San Francisco, CA', status: 'rolling' },
                { name: 'Sequoia Capital — Surge', type: 'vc', description: 'Early-stage program by Sequoia for startups in India & Southeast Asia. Built for ambitious founders.', focus: 'Tech, SaaS, Consumer', stage: 'Seed', amount: '$1-2M', url: 'https://www.surgeahead.com', location: 'India / SEA', status: 'open', deadline: undefined },
                { name: 'Startup India Seed Fund', type: 'government', description: 'Govt of India scheme providing seed funding to early-stage startups through DPIIT-recognized incubators.', focus: 'All sectors', stage: 'Idea to Early', amount: 'Up to ₹50L', url: 'https://seedfund.startupindia.gov.in', location: 'India', status: 'open', deadline: undefined },
                { name: 'Techstars', type: 'accelerator', description: 'Global accelerator network with 40+ programs worldwide. Mentorship-driven with $120K investment.', focus: 'All sectors', stage: 'Pre-seed', amount: '$120K', url: 'https://www.techstars.com/accelerators', location: 'Global', status: 'rolling', deadline: undefined },
                { name: 'SBIR/STTR', type: 'grant', description: 'US federal non-dilutive grants for small businesses doing R&D across 11 federal agencies.', focus: 'Deep Tech, Health, Defense', stage: 'Any', amount: '$50K-$1.5M', url: 'https://www.sbir.gov', location: 'USA', status: 'open', deadline: undefined },
                { name: 'Accel India', type: 'vc', description: 'Leading seed & Series A investor in India. Portfolio includes Flipkart, Swiggy, BrowserStack.', focus: 'SaaS, Consumer, Fintech', stage: 'Seed to Series A', amount: '$1-10M', url: 'https://www.accel.com/india', location: 'Bangalore, India', status: 'rolling', deadline: undefined },
            ]);
        }
        setLoading(false);
    };

    useEffect(() => { fetchDirectory(); }, []);

    const filtered = sources
        .filter(s => typeFilter === 'all' || s.type === typeFilter)
        .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()) || s.focus.toLowerCase().includes(search.toLowerCase()));

    const typeCounts = { all: sources.length, ...Object.fromEntries(Object.keys(TYPE_META).map(k => [k, sources.filter(s => s.type === k).length])) };

    return (
        <div className="min-h-screen page-bg">
            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-heading mb-1">Funding Directory</h1>
                        <p className="text-sm text-muted">Discover VCs, government grants, and accelerators. Apply with one click.</p>
                    </div>
                    <button onClick={fetchDirectory} disabled={loading} className="flex items-center gap-2 px-4 py-2.5 rounded-xl card-bg border border-default text-sm font-semibold text-muted hover:text-heading transition-all disabled:opacity-50">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search funds, accelerators, grants..." className="w-full pl-11 pr-4 py-3 rounded-2xl card-bg border border-default text-heading placeholder:text-faint text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/30 transition-all" />
                    </div>
                    <div className="flex gap-1.5 bg-slate-100/80 dark:bg-white/[0.04] rounded-2xl p-1">
                        {[{ key: 'all', label: 'All' }, ...Object.entries(TYPE_META).map(([k, v]) => ({ key: k, label: v.label }))].map(t => (
                            <button key={t.key} onClick={() => setTypeFilter(t.key)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${typeFilter === t.key ? 'bg-white dark:bg-white/10 text-heading shadow-sm' : 'text-muted hover:text-heading'}`}>
                                {t.label} {typeCounts[t.key] ? `(${typeCounts[t.key]})` : ''}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading */}
                {loading && sources.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-4" />
                        <p className="text-sm text-muted font-medium">Building your personalized directory...</p>
                    </div>
                )}

                {/* Results */}
                <div className="space-y-3">
                    {filtered.map((source, i) => {
                        const meta = TYPE_META[source.type] || TYPE_META.vc;
                        const Icon = meta.icon;
                        return (
                            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                                className="p-5 rounded-2xl card-bg border border-default hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/20 hover:-translate-y-[1px] transition-all duration-200 group"
                            >
                                <div className="flex items-start justify-between gap-5">
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div className="w-11 h-11 rounded-xl stat-bg border border-default flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-5 h-5 text-muted" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                                                <h3 className="text-[15px] font-bold text-heading">{source.name}</h3>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider stat-bg text-muted border border-default">{meta.label}</span>
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider stat-bg border border-default ${STATUS_STYLE[source.status]}`}>{source.status}</span>
                                            </div>
                                            <p className="text-sm text-muted mb-3 leading-relaxed">{source.description}</p>
                                            <div className="flex items-center gap-5 text-xs text-faint">
                                                <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" />{source.amount}</span>
                                                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{source.location}</span>
                                                <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" />{source.focus}</span>
                                                <span className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" />{source.stage}</span>
                                                {source.deadline && <span className="flex items-center gap-1.5 text-amber-500 font-semibold"><Clock className="w-3.5 h-3.5" />{source.deadline}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <a href={source.url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-80 active:scale-[0.97] transition-all flex-shrink-0"
                                    >
                                        Apply <ArrowUpRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
