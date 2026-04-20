import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Calculator, ArrowRight, Activity, Percent, Plus, Trash2, DollarSign } from 'lucide-react';

interface Shareholder {
    id: string;
    name: string;
    shares: number;
    type: 'founder' | 'investor' | 'employee';
}

export default function CapTable() {
    // Current Cap Table State
    const [shareholders, setShareholders] = useState<Shareholder[]>([
        { id: '1', name: 'Founder 1', shares: 4000000, type: 'founder' },
        { id: '2', name: 'Founder 2', shares: 4000000, type: 'founder' },
        { id: '3', name: 'Pre-Seed Lead', shares: 1000000, type: 'investor' },
        { id: '4', name: 'Employee Pool', shares: 1000000, type: 'employee' },
    ]);

    // Modeling the new round
    const [newRound, setNewRound] = useState({
        raising: 2000000,
        preMoneyVals: 8000000,
        expandPoolTo: 10, // Post-money Option Pool target %
    });

    const [newShareholderName, setNewShareholderName] = useState('');
    const [newShareholderShares, setNewShareholderShares] = useState(100000);
    const [newShareholderType, setNewShareholderType] = useState<'founder' | 'investor' | 'employee'>('investor');

    // Derived Variables & Math logic
    const totalCurrentShares = useMemo(() => shareholders.reduce((acc, s) => acc + s.shares, 0), [shareholders]);
    const sharePrice = useMemo(() => newRound.preMoneyVals / totalCurrentShares, [newRound.preMoneyVals, totalCurrentShares]);
    const sharesToIssueToNewInvestors = useMemo(() => Math.round(newRound.raising / sharePrice), [newRound.raising, sharePrice]);
    
    // Total shares before pool expansion
    const postMoneySharesBeforePool = totalCurrentShares + sharesToIssueToNewInvestors;
    
    // Post pool expansion logic based on target post-money percentage
    const desiredPoolPostMoneyShares = Math.round((newRound.expandPoolTo / 100) * postMoneySharesBeforePool / (1 - (newRound.expandPoolTo / 100)));
    const targetTotalPostMoneyShares = postMoneySharesBeforePool + desiredPoolPostMoneyShares;

    // How many new pool shares do we actually add?
    const currentPoolShares = shareholders.filter(s => s.type === 'employee').reduce((acc, s) => acc + s.shares, 0);
    const newPoolSharesToAdd = Math.max(0, desiredPoolPostMoneyShares - currentPoolShares);

    const targetTotalShares = targetTotalPostMoneyShares;

    const handleAddShareholder = () => {
        if (!newShareholderName.trim()) return;
        setShareholders([...shareholders, {
            id: crypto.randomUUID(),
            name: newShareholderName,
            shares: newShareholderShares,
            type: newShareholderType,
        }]);
        setNewShareholderName('');
        setNewShareholderShares(100000);
    };

    const handleDeleteShareholder = (id: string) => {
        setShareholders(shareholders.filter(s => s.id !== id));
    };

    return (
        <div className="min-h-screen page-bg pb-20">
            <div className="max-w-6xl mx-auto px-6 py-10">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-sm">
                            <PieChart className="w-6 h-6 text-white dark:text-black" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-heading mb-1">Cap Table & Equity Simulator</h1>
                            <p className="text-sm text-muted">Model round dilution, post-money valuation, and option pool creation instantly.</p>
                        </div>
                    </div>
                </div>

                {/* Scenario Builder Header Cards */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="p-5 rounded-2xl card-bg border border-default card-shadow">
                        <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Total Shares</p>
                        <p className="text-3xl font-black text-heading">{totalCurrentShares.toLocaleString()}</p>
                        <p className="text-xs font-semibold text-faint mt-1">Outstanding today</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-black dark:bg-[#18181b] border border-black dark:border-white/10 card-shadow text-white">
                        <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Calculator className="w-3.5 h-3.5" /> Share Price</p>
                        <p className="text-3xl font-black text-white">${sharePrice.toFixed(4)}</p>
                        <p className="text-xs font-medium text-white/50 mt-1">Based on Pre-Money</p>
                    </div>
                    <div className="p-5 rounded-2xl card-bg border border-default card-shadow">
                        <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Pre-Money Val</p>
                        <p className="text-3xl font-black text-heading">${(newRound.preMoneyVals / 1000000).toFixed(2)}<span className="text-lg ml-1">M</span></p>
                        <div className="mt-3">
                            <input type="range" min="1000000" max="50000000" step="500000" value={newRound.preMoneyVals} onChange={e => setNewRound(p => ({ ...p, preMoneyVals: Number(e.target.value) }))} className="w-full accent-black dark:accent-white" />
                        </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-default card-shadow">
                        <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 flex items-center gap-1.5"><ArrowRight className="w-3.5 h-3.5" /> Capital Raising</p>
                        <p className="text-3xl font-black text-heading">${(newRound.raising / 1000000).toFixed(2)}<span className="text-lg ml-1">M</span></p>
                        <div className="mt-3">
                            <input type="range" min="100000" max="10000000" step="100000" value={newRound.raising} onChange={e => setNewRound(p => ({ ...p, raising: Number(e.target.value) }))} className="w-full accent-black dark:accent-white" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Left Col: Current Cap Table */}
                    <div className="col-span-7 space-y-6">
                        <div className="card-bg border border-default rounded-2xl card-shadow overflow-hidden">
                            <div className="px-6 py-5 border-b border-default bg-slate-50 dark:bg-[#111113]">
                                <h3 className="text-lg font-bold text-heading">Current Ownership Structure</h3>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-[#111113] border-b border-default text-[11px] font-semibold text-muted uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3">Entity Name</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3 text-right">Shares</th>
                                        <th className="px-6 py-3 text-right">Current %</th>
                                        <th className="px-6 py-3 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-default bg-card">
                                    {shareholders.map(s => {
                                        const pct = (s.shares / totalCurrentShares) * 100;
                                        return (
                                            <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                                                <td className="px-6 py-4 font-semibold text-heading">{s.name}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider stat-bg border border-default`}>{s.type}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono tabular-nums">{s.shares.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right font-mono tabular-nums">{pct.toFixed(2)}%</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => handleDeleteShareholder(s.id)} className="text-faint hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {/* Add Entity Form */}
                            <div className="p-4 bg-slate-50 dark:bg-[#111113] border-t border-default flex gap-3">
                                <input placeholder="New Entity (e.g. Angel Syndicate)" value={newShareholderName} onChange={e=>setNewShareholderName(e.target.value)} className="flex-1 px-4 py-2 text-sm bg-input border border-default rounded-lg focus:outline-none" />
                                <input type="number" placeholder="Shares" value={newShareholderShares} onChange={e=>setNewShareholderShares(Number(e.target.value))} className="w-32 px-4 py-2 text-sm bg-input border border-default rounded-lg focus:outline-none" />
                                <select value={newShareholderType} onChange={e=>setNewShareholderType(e.target.value as any)} className="w-32 px-4 py-2 text-sm bg-input border border-default rounded-lg focus:outline-none">
                                    <option value="founder">Founder</option>
                                    <option value="investor">Investor</option>
                                    <option value="employee">Pool</option>
                                </select>
                                <button onClick={handleAddShareholder} disabled={!newShareholderName.trim()} className="px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-80 disabled:opacity-50 font-bold flex items-center justify-center shrink-0"><Plus className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Projected Round Simulation */}
                    <div className="col-span-5 space-y-6">
                        <div className="card-bg border border-default rounded-2xl card-shadow overflow-hidden p-6 relative">
                            <h3 className="text-lg font-bold text-heading mb-6 flex items-center gap-2"><Percent className="w-5 h-5 text-muted" /> Projected Post-Money Cap Table</h3>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted font-medium">Post-Money Valuation</span>
                                    <span className="font-bold text-heading">${((newRound.preMoneyVals + newRound.raising)/1000000).toFixed(2)}M</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted font-medium">Total Shares Generated</span>
                                    <span className="font-mono">{targetTotalShares.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted font-medium">New Investor Shares</span>
                                    <span className="font-mono text-heading">{sharesToIssueToNewInvestors.toLocaleString()}</span>
                                </div>
                                
                                <div className="pt-4 border-t border-default">
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span className="text-muted font-medium">Target Option Pool (Post)</span>
                                        <span className="font-bold text-heading">{newRound.expandPoolTo}%</span>
                                    </div>
                                    <input type="range" min="5" max="20" step="1" value={newRound.expandPoolTo} onChange={e => setNewRound(p => ({ ...p, expandPoolTo: Number(e.target.value) }))} className="w-full accent-black dark:accent-white mb-2" />
                                    <p className="text-[11px] text-faint">Adds {newPoolSharesToAdd.toLocaleString()} new shares to pool</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Post-Money Ownership</h4>
                                {shareholders.filter(s => s.type !== 'employee').map(s => {
                                    const newPct = (s.shares / targetTotalShares) * 100;
                                    const oldPct = (s.shares / totalCurrentShares) * 100;
                                    return (
                                        <div key={s.id} className="flex flex-col gap-1.5">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-semibold text-heading truncate pr-4">{s.name}</span>
                                                <div className="flex gap-2 tabular-nums">
                                                    <span className="text-faint line-through">{oldPct.toFixed(1)}%</span>
                                                    <span className="font-bold text-heading">{newPct.toFixed(1)}%</span>
                                                </div>
                                            </div>
                                            <div className="w-full h-1.5 bg-stat-bg rounded-full overflow-hidden">
                                                <div className="h-full bg-black dark:bg-white rounded-full transition-all" style={{ width: `${newPct}%` }} />
                                            </div>
                                        </div>
                                    )
                                })}

                                {/* New Investors Line */}
                                <div className="flex flex-col gap-1.5 mt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-semibold text-heading truncate pr-4">New Series Investors</span>
                                        <span className="font-bold text-heading tabular-nums">{((sharesToIssueToNewInvestors / targetTotalShares) * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-stat-bg rounded-full overflow-hidden">
                                        <div className="h-full bg-black dark:bg-white rounded-full transition-all" style={{ width: `${(sharesToIssueToNewInvestors / targetTotalShares) * 100}%` }} />
                                    </div>
                                </div>

                                {/* Consolidated Pool Line */}
                                <div className="flex flex-col gap-1.5 mt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-semibold text-heading truncate pr-4">Option Pool</span>
                                        <span className="font-bold text-heading tabular-nums">{(currentPoolShares + newPoolSharesToAdd) > 0 ? (((currentPoolShares + newPoolSharesToAdd) / targetTotalShares) * 100).toFixed(1) : 0}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-stat-bg rounded-full overflow-hidden">
                                        <div className="h-full bg-black dark:bg-white/40 rounded-full transition-all" style={{ width: `${((currentPoolShares + newPoolSharesToAdd) / targetTotalShares) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
