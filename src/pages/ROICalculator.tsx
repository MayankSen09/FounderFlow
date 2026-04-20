import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Percent, BarChart3, Clock, Zap, Wallet, Activity } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#4facfe', '#6366f1', '#14b8a6', '#f59e0b', '#ef4444'];

export function ROICalculator() {
    // Startup Financials
    const [finances, setFinances] = useState({
        currentCash: 500000,
        monthlyRevenue: 25000,
        monthlyBurn: 65000,
    });

    // Marketing Campaigns
    const [campaigns, setCampaigns] = useState([
        { name: 'Google Ads', spend: 5000, conversions: 150, revenue: 15000 },
        { name: 'Facebook Ads', spend: 3000, conversions: 100, revenue: 8000 },
        { name: 'LinkedIn Ads', spend: 2000, conversions: 50, revenue: 12000 },
    ]);

    const [newCampaign, setNewCampaign] = useState({
        name: '',
        spend: 0,
        conversions: 0,
        revenue: 0
    });

    // Runway Calculations
    const netBurn = finances.monthlyBurn - finances.monthlyRevenue;
    const runwayMonths = netBurn > 0 ? (finances.currentCash / netBurn).toFixed(1) : 'Infinite';
    const isRunwayLow = netBurn > 0 && Number(runwayMonths) < 6;

    // Marketing Calculations
    const calculateROI = (revenue: number, spend: number) => {
        if (spend === 0) return 0;
        return ((revenue - spend) / spend * 100).toFixed(2);
    };

    const calculateCAC = (spend: number, conversions: number) => {
        if (conversions === 0) return 0;
        return (spend / conversions).toFixed(2);
    };

    const totals = campaigns.reduce((acc, campaign) => ({
        spend: acc.spend + campaign.spend,
        conversions: acc.conversions + campaign.conversions,
        revenue: acc.revenue + campaign.revenue
    }), { spend: 0, conversions: 0, revenue: 0 });

    const handleAddCampaign = () => {
        if (newCampaign.name && newCampaign.spend > 0) {
            setCampaigns([...campaigns, newCampaign]);
            setNewCampaign({ name: '', spend: 0, conversions: 0, revenue: 0 });
        }
    };

    const pieData = campaigns.map(c => ({ name: c.name, value: c.revenue }));

    // Generate burn projection data
    const projectionData = Array.from({ length: 12 }, (_, i) => {
        const cashLeft = Math.max(0, finances.currentCash - (netBurn * i));
        return {
            month: `Month ${i+1}`,
            cash: cashLeft
        };
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-architect-card/50 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-6 w-fit shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 dark:text-slate-300">Runway Insights</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                    Runway & Growth <span className="architect-gradient">Command</span>
                </h1>
                <p className="text-slate-600 dark:text-architect-muted text-lg max-w-2xl font-medium">
                    Monitor your cash flow, optimize marketing burn, and extend your runway with precision.
                </p>
            </motion.div>

            {/* Top Stat Cards (Bento Grid Style) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="hover:-translate-y-2 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-primary/10 rounded-full blur-2xl group-hover:bg-brand-primary/20 transition-colors" />
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-brand-primary/10 rounded-xl relative">
                            <Clock className="w-5 h-5 text-brand-primary" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Runway</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className={`text-4xl font-black tracking-tighter ${isRunwayLow ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                            {runwayMonths}
                        </p>
                        <p className="text-slate-500 dark:text-architect-muted font-bold text-sm">Months</p>
                    </div>
                    {isRunwayLow && (
                        <p className="text-xs text-rose-500 font-bold mt-2 tracking-tight">Warning: High Burn Rate</p>
                    )}
                </Card>

                <Card className="hover:-translate-y-2 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-secondary/10 rounded-full blur-2xl transition-colors" />
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-brand-secondary/10 rounded-xl">
                            <Wallet className="w-5 h-5 text-brand-secondary" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Current Cash</p>
                    </div>
                    <p className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                        ${finances.currentCash.toLocaleString()}
                    </p>
                </Card>

                <Card className="hover:-translate-y-2 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl transition-colors" />
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Revenue (MRR)</p>
                    </div>
                    <p className="text-3xl font-black tracking-tighter text-emerald-500">
                        ${finances.monthlyRevenue.toLocaleString()}
                    </p>
                </Card>

                <Card className="hover:-translate-y-2 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl transition-colors" />
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-rose-500/10 rounded-xl">
                            <Activity className="w-5 h-5 text-rose-500" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Net Burn Rate</p>
                    </div>
                    <p className="text-3xl font-black tracking-tighter text-rose-500">
                        ${netBurn.toLocaleString()}/mo
                    </p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Financial Controls */}
                <Card className="lg:col-span-1 shadow-lg dark:shadow-none">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-brand-primary" /> Scenario Test
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bank Balance ($)</label>
                            <input
                                type="number"
                                value={finances.currentCash}
                                onChange={(e) => setFinances({ ...finances, currentCash: Number(e.target.value) })}
                                className="w-full px-5 py-4 border border-slate-200 dark:border-architect-border rounded-xl bg-slate-50 dark:bg-architect-dark/50 text-slate-900 dark:text-white font-black focus:ring-2 focus:ring-brand-primary/50 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Revenue ($)</label>
                            <input
                                type="number"
                                value={finances.monthlyRevenue}
                                onChange={(e) => setFinances({ ...finances, monthlyRevenue: Number(e.target.value) })}
                                className="w-full px-5 py-4 border border-slate-200 dark:border-architect-border rounded-xl bg-slate-50 dark:bg-architect-dark/50 text-slate-900 dark:text-white font-black focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Monthly Expenses ($)</label>
                            <input
                                type="number"
                                value={finances.monthlyBurn}
                                onChange={(e) => setFinances({ ...finances, monthlyBurn: Number(e.target.value) })}
                                className="w-full px-5 py-4 border border-slate-200 dark:border-architect-border rounded-xl bg-slate-50 dark:bg-architect-dark/50 text-slate-900 dark:text-white font-black focus:ring-2 focus:ring-rose-500/50 transition-all outline-none"
                            />
                        </div>
                    </div>
                </Card>

                {/* Cash Projection Chart */}
                <Card className="lg:col-span-2 shadow-lg dark:shadow-none">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Cash Exhaustion Projection</h3>
                    <p className="text-xs font-bold text-slate-500 mb-8 uppercase tracking-wider">12-Month Bank Balance Forecast</p>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4facfe" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#4facfe" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={(val) => `$${val / 1000}k`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#161920', border: '1px solid #2a2e3a', borderRadius: '12px', fontWeight: 'bold', color: '#fff' }}
                                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Bank Balance']}
                                />
                                <Area type="monotone" dataKey="cash" stroke="#4facfe" strokeWidth={3} fillOpacity={1} fill="url(#colorCash)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Distribution */}
                <Card className="shadow-lg dark:shadow-none min-h-[400px]">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Acquisition Sources</h3>
                    <p className="text-sm text-slate-500 font-bold mb-6">Marketing Campaign Revenue share</p>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#161920', border: '1px solid #2a2e3a', borderRadius: '12px', fontWeight: 'bold', color: '#fff' }}
                                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Revenue']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-slate-500 font-bold uppercase tracking-wider text-xs">
                            No Campaign Data
                        </div>
                    )}
                </Card>

                {/* Add New Campaign */}
                <Card className="shadow-lg dark:shadow-none">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Deploy Capital</h3>
                    <p className="text-sm text-slate-500 font-bold mb-6">Log new campaign spend to calculate ROI metrics</p>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={newCampaign.name}
                            onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                            placeholder="Campaign Name (e.g., Q3 LinkedIn Push)"
                            className="w-full px-5 py-4 border border-slate-200 dark:border-architect-border rounded-xl bg-slate-50 dark:bg-architect-dark/50 text-slate-900 dark:text-white font-black focus:ring-2 focus:ring-brand-primary/50 transition-all outline-none placeholder:text-slate-400"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                value={newCampaign.spend || ''}
                                onChange={(e) => setNewCampaign({ ...newCampaign, spend: Number(e.target.value) })}
                                placeholder="Spend ($)"
                                className="px-5 py-4 border border-slate-200 dark:border-architect-border rounded-xl bg-slate-50 dark:bg-architect-dark/50 text-slate-900 dark:text-white font-black focus:ring-2 focus:ring-brand-primary/50 transition-all outline-none"
                            />
                            <input
                                type="number"
                                value={newCampaign.conversions || ''}
                                onChange={(e) => setNewCampaign({ ...newCampaign, conversions: Number(e.target.value) })}
                                placeholder="Conversions"
                                className="px-5 py-4 border border-slate-200 dark:border-architect-border rounded-xl bg-slate-50 dark:bg-architect-dark/50 text-slate-900 dark:text-white font-black focus:ring-2 focus:ring-brand-primary/50 transition-all outline-none"
                            />
                            <input
                                type="number"
                                value={newCampaign.revenue || ''}
                                onChange={(e) => setNewCampaign({ ...newCampaign, revenue: Number(e.target.value) })}
                                placeholder="Revenue ($)"
                                className="col-span-2 px-5 py-4 border border-slate-200 dark:border-architect-border rounded-xl bg-slate-50 dark:bg-architect-dark/50 text-slate-900 dark:text-white font-black focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
                            />
                        </div>
                        <Button onClick={handleAddCampaign} variant="gradient" className="w-full py-6 mt-4 text-base font-black tracking-wide uppercase">
                            Log Campaign ROI
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Campaign Table in Bento Style */}
            <Card className="overflow-hidden shadow-lg dark:shadow-none p-0" noPadding>
                <div className="p-8 border-b border-slate-200 dark:border-architect-border flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Growth Ledger</h3>
                        <p className="text-sm font-bold text-slate-500">Historical performance data</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest text-right">Aggregate CAC</p>
                            <p className="font-black text-xl text-brand-primary">${calculateCAC(totals.spend, totals.conversions)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest text-right">Aggregate ROI</p>
                            <p className="font-black text-xl text-emerald-500">{calculateROI(totals.revenue, totals.spend)}%</p>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-architect-dark/30 border-b border-slate-200 dark:border-architect-border">
                            <tr>
                                <th className="text-left p-6 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-architect-muted">Campaign</th>
                                <th className="text-right p-6 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-architect-muted">Spend</th>
                                <th className="text-right p-6 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-architect-muted">Conv.</th>
                                <th className="text-right p-6 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-architect-muted">Rev.</th>
                                <th className="text-right p-6 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-architect-muted">CAC</th>
                                <th className="text-right p-6 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-architect-muted">ROI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-architect-border">
                            {campaigns.map((campaign, idx) => {
                                const roi = Number(calculateROI(campaign.revenue, campaign.spend));
                                return (
                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-architect-dark/50 transition-colors">
                                        <td className="p-6 font-black text-slate-900 dark:text-white">{campaign.name}</td>
                                        <td className="p-6 text-right font-bold text-slate-600 dark:text-slate-400">${campaign.spend.toLocaleString()}</td>
                                        <td className="p-6 text-right font-bold text-slate-600 dark:text-slate-400">{campaign.conversions}</td>
                                        <td className="p-6 text-right font-bold text-emerald-600/80 dark:text-emerald-400 shadow-sm">${campaign.revenue.toLocaleString()}</td>
                                        <td className="p-6 text-right font-bold text-slate-600 dark:text-slate-400">${calculateCAC(campaign.spend, campaign.conversions)}</td>
                                        <td className="p-6 text-right">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black tracking-widest ${
                                                roi >= 100 
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                : roi > 0 
                                                ? 'bg-brand-primary/10 text-brand-primary'
                                                : 'bg-rose-500/10 text-rose-500'
                                            }`}>
                                                {roi}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
