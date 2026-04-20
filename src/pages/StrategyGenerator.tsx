import React, { useState } from 'react';
import { Rocket, Target, TrendingUp, Loader2, CheckCircle2, Zap, Layers, BarChart3, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const StrategyGenerator: React.FC = () => {
    const [formData, setFormData] = useState({
        industry: '',
        stage: '',
        geo: '',
        framework: 'Lean Startup'
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);

        // Simulate complex AI processing
        setTimeout(() => {
            setResult(generateMockResult(formData));
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            <div className="mb-10 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 backdrop-blur-md mb-6 w-fit shadow-sm">
                    <Zap className="w-3 h-3 text-brand-primary" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-brand-primary">Neural Planning</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                    Startup <span className="architect-gradient">Strategy Matrix</span>
                </h1>
                <p className="text-slate-600 dark:text-architect-muted text-lg font-medium">
                    Deploy AI-generated playbooks based on proven founder frameworks like Blitzscaling and Product-Led Growth.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Form */}
                <div className="lg:col-span-4 space-y-6">
                    <Card title="Startup Profile" className="shadow-2xl dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] border-brand-primary/20">
                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Industry Vertical</label>
                                <input
                                    type="text"
                                    value={formData.industry}
                                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                    className="w-full px-5 py-4 border border-slate-200 dark:border-architect-border rounded-xl bg-slate-50 dark:bg-architect-dark/50 text-slate-900 dark:text-white font-black focus:ring-2 focus:ring-brand-primary/50 transition-all outline-none"
                                    placeholder="e.g. Fintech, DevTools"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Funding Stage</label>
                                <select
                                    value={formData.stage}
                                    onChange={e => setFormData({ ...formData, stage: e.target.value })}
                                    className="w-full px-5 py-4 border border-slate-200 dark:border-architect-border rounded-xl bg-slate-50 dark:bg-architect-dark/50 text-slate-900 dark:text-white font-black focus:ring-2 focus:ring-brand-primary/50 transition-all outline-none cursor-pointer"
                                >
                                    <option value="">Select stage...</option>
                                    <option value="Bootstrapped">Bootstrapped</option>
                                    <option value="Pre-Seed">Pre-Seed</option>
                                    <option value="Seed">Seed (PMF Pursuit)</option>
                                    <option value="Series A">Series A (Scaling)</option>
                                    <option value="Growth">Growth stage</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Geo</label>
                                <input
                                    type="text"
                                    value={formData.geo}
                                    onChange={e => setFormData({ ...formData, geo: e.target.value })}
                                    className="w-full px-5 py-4 border border-slate-200 dark:border-architect-border rounded-xl bg-slate-50 dark:bg-architect-dark/50 text-slate-900 dark:text-white font-black focus:ring-2 focus:ring-brand-primary/50 transition-all outline-none"
                                    placeholder="e.g. US, LatAm"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Founder Framework</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Lean Startup', 'Blitzscaling', 'Product-Led', 'Default Alive'].map(m => (
                                        <button
                                            type="button"
                                            key={m}
                                            onClick={() => setFormData({ ...formData, framework: m })}
                                            className={`px-3 py-4 text-xs font-black tracking-tight rounded-xl border transition-all ${
                                                formData.framework === m
                                                ? 'bg-brand-primary text-white border-transparent shadow-[0_0_15px_rgba(79,172,254,0.3)]'
                                                : 'bg-white dark:bg-architect-card text-slate-600 dark:text-architect-muted border-slate-200 dark:border-architect-border hover:border-brand-primary/50'
                                            }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="gradient"
                                disabled={isGenerating}
                                className="w-full py-6 text-base font-black uppercase tracking-widest mt-6"
                                icon={isGenerating ? Loader2 : Rocket}
                            >
                                {isGenerating ? 'Synthesizing...' : 'Generate Roadmap'}
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Results Area */}
                <div className="lg:col-span-8">
                    {!result && !isGenerating && (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-architect-border/50 bg-slate-50/50 dark:bg-architect-dark/20">
                            <div className="w-24 h-24 bg-brand-primary/10 rounded-3xl flex items-center justify-center mb-6 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-brand-primary/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-3xl" />
                                <Layers className="w-10 h-10 text-brand-primary relative z-10" />
                            </div>
                            <h3 className="font-black text-2xl text-slate-900 dark:text-white tracking-tighter mb-2">Awaiting Parameters</h3>
                            <p className="text-slate-500 dark:text-architect-muted max-w-sm font-medium">
                                Configure your startup's profile to generate a bespoke, highly strategic operating standard based on elite frameworks.
                            </p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {/* Executive Summary */}
                            <Card className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white border-0 shadow-2xl relative overflow-hidden">
                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4 opacity-80">
                                        <Target className="w-5 h-5" />
                                        <span className="text-xs font-black uppercase tracking-widest">{formData.framework} Protocol Active</span>
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tighter mb-4">{result.title}</h3>
                                    <p className="text-white/90 leading-relaxed font-medium text-lg">{result.summary}</p>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Positioning & Defense */}
                                <Card className="hover:-translate-y-1 transition-all">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-brand-vibrant/10 rounded-xl">
                                            <ShieldCheck className="w-5 h-5 text-brand-vibrant" />
                                        </div>
                                        <h3 className="font-black text-slate-900 dark:text-white tracking-tighter">Moat & Defense</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {result.defense.map((d: string, i: number) => (
                                            <li key={i} className="flex gap-3 text-sm font-medium text-slate-600 dark:text-architect-muted">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-vibrant shrink-0 mt-1.5" />
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>

                                {/* Key Metrics Focus */}
                                <Card className="hover:-translate-y-1 transition-all">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                                            <BarChart3 className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <h3 className="font-black text-slate-900 dark:text-white tracking-tighter">North Star Metrics</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {result.metrics.map((m: string, i: number) => (
                                            <li key={i} className="flex gap-3 text-sm font-medium text-slate-600 dark:text-architect-muted">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                                {m}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </div>

                            {/* Roadmap */}
                            <Card className="p-8">
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-architect-border">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-brand-primary/10 rounded-xl">
                                            <TrendingUp className="w-5 h-5 text-brand-primary" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Execution Roadmap</h3>
                                    </div>
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-architect-dark rounded-full text-[10px] font-black tracking-widest text-slate-500 uppercase">90 Days</span>
                                </div>
                                <div className="space-y-0 relative">
                                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-architect-border/50" />
                                    {result.roadmap.map((phase: any, idx: number) => (
                                        <div key={idx} className="flex gap-6 group relative pb-10 last:pb-0">
                                            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white dark:bg-architect-card border-2 border-slate-200 dark:border-architect-border flex items-center justify-center z-10 group-hover:border-brand-primary transition-colors">
                                                <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-architect-border group-hover:bg-brand-primary transition-colors" />
                                            </div>
                                            <div className="pl-12">
                                                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1 block">{phase.duration}</span>
                                                <h4 className="font-black text-lg text-slate-900 dark:text-white tracking-tight mb-3">{phase.phase}</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {phase.activities.map((act: string, i: number) => (
                                                        <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-architect-dark/50 border border-slate-100 dark:border-architect-border text-xs font-bold text-slate-600 dark:text-architect-muted">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                            {act}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Mock Logic Generator mapped to Founder Frameworks
function generateMockResult(data: any) {
    const industry = data.industry || 'Tech';
    
    let frameworkDetails = {
        title: "",
        summary: "",
        defense: [],
        metrics: [],
        roadmap: []
    };

    if (data.framework === 'Lean Startup') {
        frameworkDetails = {
            title: `${industry} Validated Learning Plan`,
            summary: `Focus aggressively on building the Minimum Viable Product (MVP) and validating assumptions in the ${data.geo || 'Global'} market. Conserve capital while finding product-market fit.`,
            defense: ['Speed of iteration cycle', 'Proprietary customer insights', 'Community-driven feature votes'],
            metrics: ['Feature usage retention', 'Customer Acquisition Cost (CAC)', 'Net Promoter Score (NPS)'],
            roadmap: [
                { phase: 'Customer Discovery', duration: 'Month 1', activities: ['50 User Interviews', 'Landing Page MVP', 'Problem Validation'] },
                { phase: 'Build Measure Learn', duration: 'Month 2', activities: ['Core Feature Launch', 'Analytics Setup', 'Cohort Analysis'] },
                { phase: 'Pivot or Persevere', duration: 'Month 3', activities: ['Pricing Test', 'Referral Loop Beta', 'Channel Validation'] }
            ]
        };
    } else if (data.framework === 'Blitzscaling') {
        frameworkDetails = {
            title: `${industry} Hyper-Growth Protocol`,
            summary: `Prioritize speed over efficiency in an environment of uncertainty. The goal is to be the first to scale in ${data.geo || 'Global'} and establish a dominant market share.`,
            defense: ['Network Effects', 'Scale Economics', 'Aggressive Talent Acquisition'],
            metrics: ['Month-over-Month (MoM) Growth', 'Viral Coefficient', 'Gross Merchandise Value (GMV)'],
            roadmap: [
                { phase: 'Ignition', duration: 'Month 1', activities: ['Unscalable Growth Hacks', 'Aggressive Paid Spend', 'Key Executive Hires'] },
                { phase: 'Scale Up', duration: 'Month 2', activities: ['Automate Ops', 'Expand Geographies', 'Influencer Partnerships'] },
                { phase: 'Market Domination', duration: 'Month 3', activities: ['Acquire Competitors', 'Platform Lock-in', 'Series B Prep'] }
            ]
        };
    } else if (data.framework === 'Product-Led') {
        frameworkDetails = {
            title: `${industry} PLG Engine`,
            summary: `Utilize your product as the primary vehicle to acquire, activate, and retain customers. Frictionless onboarding in ${data.geo || 'Global'} is key.`,
            defense: ['Immaculate User Experience', 'Self-serve Expansion', 'Data Network Effects'],
            metrics: ['Time to First Value (TTFV)', 'Product Qualified Leads (PQLs)', 'Net Revenue Retention (NRR)'],
            roadmap: [
                { phase: 'Frictionless Entry', duration: 'Month 1', activities: ['Freemium Tier Setup', 'In-App Onboarding', 'Remove Paywalls'] },
                { phase: 'Value Realization', duration: 'Month 2', activities: ['Usage Triggers', 'Product Tours', 'Self-Serve Docs'] },
                { phase: 'Viral Expansion', duration: 'Month 3', activities: ['Team Invites', 'Premium Gating', 'Automated Upsells'] }
            ]
        };
    } else {
        // Default Alive
        frameworkDetails = {
            title: `${industry} Default Alive Blueprint`,
            summary: `Achieve profitability with current runway. Cut non-essential burn and focus exclusively on high-margin revenue streams in ${data.geo || 'Global'}.`,
            defense: ['Cash Flow Positivity', 'High Gross Margins', 'Lean Operations'],
            metrics: ['Net Burn Rate', 'Months of Runway', 'Gross Margin %'],
            roadmap: [
                { phase: 'Survival Mode', duration: 'Month 1', activities: ['Audit Expenses', 'Renegotiate Contracts', 'Pause Ads'] },
                { phase: 'Core Focus', duration: 'Month 2', activities: ['Upsell Top 20% Users', 'Increase Pricing', 'Manual Outbound'] },
                { phase: 'Sustainable Growth', duration: 'Month 3', activities: ['Profitable Acquisition', 'Hiring Freeze Eval', 'Cash Flow +'] }
            ]
        };
    }
    
    return frameworkDetails;
}
