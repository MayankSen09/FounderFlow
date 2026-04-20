import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Loader2, RefreshCw, Sparkles, Globe, Zap, Target, Bookmark, ExternalLink, Heart, Repeat2, MessageCircle } from 'lucide-react';
import { useFounder } from '../context/FounderContext';
import { generateWithAI } from '../lib/ai';
import { searchTweets, isTwitterConfigured, FOUNDER_QUERIES, type Tweet } from '../lib/twitter';

interface Trend {
    title: string;
    summary: string;
    category: string;
    relevance: string;
    source: string;
}

type Tab = 'insights' | 'live';

const CATEGORY_STYLE: Record<string, { icon: any }> = {
    funding: { icon: Zap },
    industry: { icon: Target },
    policy: { icon: Globe },
};

export default function TrendsNews() {
    const { profile } = useFounder();
    const [tab, setTab] = useState<Tab>('insights');
    const [trends, setTrends] = useState<Trend[]>([]);
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState(false);
    const [tweetLoading, setTweetLoading] = useState(false);
    const [selectedQuery, setSelectedQuery] = useState(0);
    const [filter, setFilter] = useState('all');
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const twitterEnabled = isTwitterConfigured();

    const fetchTrends = async () => {
        setLoading(true);
        try {
            const industry = profile?.industry || 'technology startups';
            const stage = profile?.stage || 'seed';
            const prompt = `You are a startup intelligence analyst. Generate 12 current, realistic trending topics and news items relevant to a ${stage}-stage startup founder in the "${industry}" space.

For each item, return:
- title: concise headline (max 10 words)
- summary: 2-sentence description
- category: one of "funding", "industry", "policy"
- relevance: one sentence explaining why this matters to the founder
- source: a realistic publication name (TechCrunch, YCombinator Blog, Economic Times, Inc42, etc.)

Cover: Recent funding rounds, VC activity, government grants, startup schemes, industry trends, notable exits.

Return ONLY valid JSON array:
[{"title":"...","summary":"...","category":"...","relevance":"...","source":"..."}]`;

            const response = await generateWithAI(prompt);
            const cleanJson = response.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
            setTrends(JSON.parse(cleanJson));
            setLastRefresh(new Date());
        } catch {
            setTrends([
                { title: 'AI Startups See Record $50B VC Investment', summary: 'Venture capital firms have poured record funding into AI-focused startups this year, with early-stage rounds seeing the biggest growth.', category: 'funding', relevance: 'If you are building in AI, the fundraising window is wide open.', source: 'TechCrunch' },
                { title: 'Government Launches $2B Startup Innovation Fund', summary: 'A new initiative aims to support deep-tech and climate startups with non-dilutive grants of up to $500K per company.', category: 'policy', relevance: 'Free capital without equity dilution — check your eligibility.', source: 'Economic Times' },
                { title: 'PLG Outperforms Sales-Led in B2B SaaS', summary: 'New benchmark data shows product-led growth companies grow 2.5x faster at seed stage compared to traditional sales-led models.', category: 'industry', relevance: 'Consider adopting a PLG strategy if selling to SMBs or mid-market.', source: 'OpenView Partners' },
            ]);
            setLastRefresh(new Date());
        }
        setLoading(false);
    };

    const fetchTweets = async () => {
        if (!twitterEnabled) return;
        setTweetLoading(true);
        const query = FOUNDER_QUERIES[selectedQuery].query;
        const results = await searchTweets(query, 15);
        setTweets(results);
        setTweetLoading(false);
    };

    useEffect(() => { fetchTrends(); }, []);
    useEffect(() => { if (tab === 'live' && twitterEnabled) fetchTweets(); }, [tab, selectedQuery]);

    const filteredTrends = filter === 'all' ? trends : trends.filter(t => t.category === filter);

    return (
        <div className="min-h-screen page-bg">
            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-heading mb-1">Trends & News</h1>
                        <p className="text-sm text-muted">AI-curated updates for {profile?.industry || 'your industry'}</p>
                    </div>
                    <button onClick={tab === 'insights' ? fetchTrends : fetchTweets} disabled={loading || tweetLoading} className="flex items-center gap-2 px-4 py-2.5 rounded-xl card-bg border border-default text-sm font-semibold text-muted hover:text-heading transition-all disabled:opacity-50">
                        <RefreshCw className={`w-4 h-4 ${(loading || tweetLoading) ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="flex bg-slate-100/80 dark:bg-white/[0.04] rounded-2xl p-1">
                        <button onClick={() => setTab('insights')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'insights' ? 'bg-white dark:bg-white/10 text-heading shadow-sm' : 'text-muted hover:text-heading'}`}>
                            <Sparkles className="w-4 h-4" /> AI Insights
                        </button>
                        <button onClick={() => setTab('live')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'live' ? 'bg-white dark:bg-white/10 text-heading shadow-sm' : 'text-muted hover:text-heading'}`}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            Live Feed {!twitterEnabled && <span className="text-[9px] bg-stat-bg text-muted border border-default px-1.5 py-0.5 rounded font-bold ml-1">KEY NEEDED</span>}
                        </button>
                    </div>
                    {lastRefresh && <span className="ml-auto text-xs text-faint">Updated {lastRefresh.toLocaleTimeString()}</span>}
                </div>

                <AnimatePresence mode="wait">
                    {/* AI Insights Tab */}
                    {tab === 'insights' && (
                        <motion.div key="insights" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                            {/* Category Filter */}
                            <div className="flex gap-1.5 mb-6">
                                {[{ key: 'all', label: 'All' }, { key: 'funding', label: 'Funding' }, { key: 'industry', label: 'Industry' }, { key: 'policy', label: 'Policy' }].map(f => (
                                    <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f.key ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-muted hover:text-heading stat-bg border border-default'}`}>
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            {loading && trends.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24">
                                    <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-4" />
                                    <p className="text-sm text-muted">Analyzing latest trends...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {filteredTrends.map((trend, i) => {
                                        const style = CATEGORY_STYLE[trend.category] || CATEGORY_STYLE.industry;
                                        const CatIcon = style.icon;
                                        return (
                                            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                                className="p-5 rounded-2xl card-bg border border-default hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/20 hover:-translate-y-[1px] transition-all duration-200"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider stat-bg text-muted border border-default">
                                                        <CatIcon className="w-3 h-3" /> {trend.category}
                                                    </span>
                                                    <span className="text-[11px] text-faint">{trend.source}</span>
                                                </div>
                                                <h3 className="text-[15px] font-bold text-heading mb-2 leading-snug">{trend.title}</h3>
                                                <p className="text-xs text-muted leading-relaxed mb-4">{trend.summary}</p>
                                                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-default">
                                                    <Sparkles className="w-3.5 h-3.5 text-muted flex-shrink-0 mt-0.5" />
                                                    <p className="text-[11px] text-muted font-medium leading-relaxed">{trend.relevance}</p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Live Twitter Feed Tab */}
                    {tab === 'live' && (
                        <motion.div key="live" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                            {!twitterEnabled ? (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-muted" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-heading mb-2">Connect X / Twitter</h3>
                                    <p className="text-sm text-muted mb-6 max-w-md mx-auto">Add your Twitter API Bearer Token to get real-time startup ecosystem updates, VC activity, and founder insights.</p>
                                    <div className="max-w-lg mx-auto text-left">
                                        <div className="p-5 rounded-2xl card-bg border border-default">
                                            <p className="text-xs font-semibold text-heading mb-3">Setup Instructions</p>
                                            <ol className="space-y-2 text-sm text-muted">
                                                <li className="flex gap-2"><span className="text-brand-primary font-bold">1.</span> Go to <a href="https://developer.twitter.com" target="_blank" className="text-brand-primary font-semibold hover:underline">developer.twitter.com</a></li>
                                                <li className="flex gap-2"><span className="text-brand-primary font-bold">2.</span> Create a project and app with "Read" access</li>
                                                <li className="flex gap-2"><span className="text-brand-primary font-bold">3.</span> Generate a Bearer Token</li>
                                                <li className="flex gap-2"><span className="text-brand-primary font-bold">4.</span> Add to your <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-xs font-mono text-heading">.env</code>:</li>
                                            </ol>
                                            <pre className="mt-3 p-3 rounded-lg bg-slate-100 dark:bg-white/5 text-xs font-mono text-heading overflow-x-auto">VITE_TWITTER_BEARER_TOKEN=your_token_here</pre>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Query Tabs */}
                                    <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                                        {FOUNDER_QUERIES.map((q, i) => (
                                            <button key={i} onClick={() => setSelectedQuery(i)} className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedQuery === i ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-muted hover:text-heading stat-bg border border-default'}`}>
                                                {q.label}
                                            </button>
                                        ))}
                                    </div>

                                    {tweetLoading ? (
                                        <div className="flex flex-col items-center justify-center py-20">
                                            <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-4" />
                                            <p className="text-sm text-muted">Fetching latest tweets...</p>
                                        </div>
                                    ) : tweets.length === 0 ? (
                                        <div className="text-center py-20 text-muted">
                                            <p className="font-semibold">No tweets found</p>
                                            <p className="text-sm mt-1">Try a different category or refresh.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {tweets.map((tweet, i) => (
                                                <motion.a key={tweet.id} href={tweet.url} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                                    className="block p-5 rounded-2xl card-bg border border-default hover:shadow-lg hover:-translate-y-[1px] transition-all duration-200"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {tweet.authorImage && <img src={tweet.authorImage} alt="" className="w-10 h-10 rounded-full border-2 border-default" />}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-bold text-sm text-heading">{tweet.author}</span>
                                                                <span className="text-xs text-faint">{tweet.handle}</span>
                                                                <span className="text-xs text-faint ml-auto">{new Date(tweet.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-sm text-body leading-relaxed mb-3">{tweet.text}</p>
                                                            <div className="flex items-center gap-5 text-xs text-faint">
                                                                <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" />{tweet.metrics.likes}</span>
                                                                <span className="flex items-center gap-1.5"><Repeat2 className="w-3.5 h-3.5" />{tweet.metrics.retweets}</span>
                                                                <span className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" />{tweet.metrics.replies}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.a>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
