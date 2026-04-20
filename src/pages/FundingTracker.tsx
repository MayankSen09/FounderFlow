import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Users, Target, Clock, CheckCircle2, AlertCircle, Building2, ChevronRight, Activity, CalendarDays, History } from 'lucide-react';
import { useFounder, type FundingRound, type Investor, type TimelineEvent } from '../context/FounderContext';

const INVESTOR_STATUSES = [
    { value: 'cold', label: 'Cold Lead', color: 'text-slate-500' },
    { value: 'warm', label: 'Warm Intro', color: 'text-emerald-500' },
    { value: 'pitched', label: 'Pitched', color: 'text-blue-500' },
    { value: 'due-diligence', label: 'Due Diligence', color: 'text-violet-500' },
    { value: 'term-sheet', label: 'Term Sheet', color: 'text-amber-500' },
    { value: 'committed', label: 'Committed', color: 'text-emerald-500' },
    { value: 'passed', label: 'Passed', color: 'text-red-500' },
] as const;

export default function FundingTracker() {
    const { fundingRounds, addFundingRound, updateFundingRound } = useFounder();
    const [showNewRound, setShowNewRound] = useState(false);
    const [selectedRound, setSelectedRound] = useState<string | null>(null);
    const [activeInvestor, setActiveInvestor] = useState<{ roundId: string, invId: string } | null>(null);
    const [newRound, setNewRound] = useState({ roundType: 'seed' as FundingRound['roundType'], targetAmount: 500000, status: 'planning' as FundingRound['status'], notes: '' });
    
    // Forms
    const [newInvestor, setNewInvestor] = useState({ name: '', firm: '', status: 'cold' as Investor['status'] });
    const [timelineNote, setTimelineNote] = useState('');
    const [timelineStage, setTimelineStage] = useState<Investor['status']>('pitched');

    const handleCreateRound = () => {
        addFundingRound({ ...newRound, raisedAmount: 0, investors: [], deadline: undefined });
        setShowNewRound(false);
    };

    const handleAddInvestor = (roundId: string) => {
        const round = fundingRounds.find(r => r.id === roundId);
        if (!round || !newInvestor.name.trim() || !newInvestor.firm.trim()) return;
        
        const initialEvent: TimelineEvent = {
            id: crypto.randomUUID(),
            stage: newInvestor.status,
            date: new Date().toISOString(),
            note: 'Added to pipeline'
        };

        const addedInv: Investor = {
            id: crypto.randomUUID(),
            name: newInvestor.name,
            firm: newInvestor.firm,
            status: newInvestor.status,
            notes: '',
            timeline: [initialEvent],
        };

        updateFundingRound(roundId, { investors: [...round.investors, addedInv] });
        setNewInvestor({ name: '', firm: '', status: 'cold' });
    };

    const handleAddTimelineEvent = () => {
        if (!activeInvestor || !timelineNote.trim()) return;
        const round = fundingRounds.find(r => r.id === activeInvestor.roundId);
        if (!round) return;

        const newEvent: TimelineEvent = {
            id: crypto.randomUUID(),
            stage: timelineStage,
            date: new Date().toISOString(),
            note: timelineNote.trim()
        };

        const updatedInvestors = round.investors.map(inv => {
            if (inv.id === activeInvestor.invId) {
                return {
                    ...inv,
                    status: timelineStage,
                    timeline: [newEvent, ...inv.timeline]
                };
            }
            return inv;
        });

        updateFundingRound(activeInvestor.roundId, { investors: updatedInvestors });
        setTimelineNote('');
    };

    const totalRaised = fundingRounds.reduce((sum, r) => sum + r.raisedAmount, 0);

    return (
        <div className="min-h-screen page-bg pb-20">
            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-sm">
                            <Activity className="w-6 h-6 text-white dark:text-black" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-heading mb-1">Fundraising Pipeline</h1>
                            <p className="text-sm text-muted">Live tracking for investor conversations and due diligence.</p>
                        </div>
                    </div>
                    <button onClick={() => setShowNewRound(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-80 transition-opacity">
                        <Plus className="w-4 h-4" /> New Round
                    </button>
                </div>

                {/* KPI */}
                <div className="flex items-center gap-6 mb-8 p-4 rounded-2xl card-bg border border-default card-shadow">
                    <div className="flex-1 px-4 border-r border-default">
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Total Capital Raised</p>
                        <p className="text-2xl font-bold text-heading">${totalRaised.toLocaleString()}</p>
                    </div>
                    <div className="flex-1 px-4 border-r border-default">
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Active Deals</p>
                        <p className="text-2xl font-bold text-heading">{fundingRounds.filter(r => r.status === 'active').length}</p>
                    </div>
                    <div className="flex-1 px-4">
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Investors in Pipeline</p>
                        <p className="text-2xl font-bold text-heading">{fundingRounds.reduce((sum, r) => sum + r.investors.length, 0)}</p>
                    </div>
                </div>

                {/* Modals/Forms */}
                {showNewRound && (
                    <div className="p-6 rounded-2xl card-bg border border-default card-shadow mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-heading">Initialize New Round</h3>
                            <button onClick={() => setShowNewRound(false)} className="text-muted hover:text-heading"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs font-semibold text-heading mb-1.5 block ml-1">Round Stage</label>
                                <select value={newRound.roundType} onChange={e => setNewRound(p => ({ ...p, roundType: e.target.value as FundingRound['roundType'] }))} className="w-full px-4 py-3 rounded-xl bg-input border border-default text-heading text-sm focus:outline-none">
                                    <option value="pre-seed">Pre-Seed</option>
                                    <option value="seed">Seed</option>
                                    <option value="series-a">Series A</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-heading mb-1.5 block ml-1">Target Capital ($)</label>
                                <input type="number" value={newRound.targetAmount} onChange={e => setNewRound(p => ({ ...p, targetAmount: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-3 rounded-xl bg-input border border-default text-heading text-sm focus:outline-none" />
                            </div>
                        </div>
                        <button onClick={handleCreateRound} className="px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm">Create Tracking Group</button>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-12 gap-6">
                    
                    {/* Rounds List */}
                    <div className="col-span-4 space-y-4">
                        <h3 className="text-xs font-semibold text-muted uppercase tracking-widest pl-2">Rounds</h3>
                        {fundingRounds.map(round => (
                            <button 
                                key={round.id} 
                                onClick={() => { setSelectedRound(round.id); setActiveInvestor(null); }}
                                className={`w-full text-left p-5 rounded-2xl border transition-all ${selectedRound === round.id ? 'bg-white dark:bg-[#18181b] border-heading shadow-md' : 'card-bg border-default hover:border-strong'}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-heading uppercase text-sm flex items-center gap-2">
                                        {round.status === 'closed' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-amber-500" />}
                                        {round.roundType}
                                    </span>
                                </div>
                                <div className="text-xs text-muted mb-3 flex items-center gap-3">
                                    <span>${round.raisedAmount.toLocaleString()} / ${round.targetAmount.toLocaleString()}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {round.investors.length}</span>
                                </div>
                                <div className="h-1.5 rounded-full stat-bg overflow-hidden">
                                    <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${Math.min((round.raisedAmount / round.targetAmount) * 100, 100)}%` }} />
                                </div>
                            </button>
                        ))}
                        {fundingRounds.length === 0 && <p className="text-sm text-faint p-4 text-center">No rounds created.</p>}
                    </div>

                    {/* Investors Pipeline */}
                    <div className="col-span-8">
                        {!selectedRound ? (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-10 rounded-2xl border border-dashed border-default">
                                <Activity className="w-10 h-10 text-muted mb-4 opacity-50" />
                                <p className="text-sm text-muted font-semibold">Select a round to view its pipeline</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Round Details Header */}
                                <div className="flex items-center justify-between p-1">
                                    <h3 className="text-lg font-bold text-heading">Investor Pipeline</h3>
                                    <span className="px-3 py-1 bg-black/5 dark:bg-white/10 rounded-md text-xs font-semibold text-heading uppercase">
                                        Tracking {fundingRounds.find(r => r.id === selectedRound)?.investors.length} Targets
                                    </span>
                                </div>

                                {/* Active Investor Live View */}
                                {activeInvestor ? (() => {
                                    const round = fundingRounds.find(r => r.id === activeInvestor.roundId)!;
                                    const inv = round.investors.find(i => i.id === activeInvestor.invId)!;
                                    const statusMeta = INVESTOR_STATUSES.find(s => s.value === inv.status)!;
                                    
                                    return (
                                        <div className="rounded-2xl card-bg border border-strong card-shadow overflow-hidden">
                                            {/* Investor Header */}
                                            <div className="p-6 border-b border-default bg-slate-50 dark:bg-[#111113]">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <button onClick={() => setActiveInvestor(null)} className="p-2 -ml-2 rounded-lg text-muted hover:bg-black/5 transition-colors"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                                                        <div>
                                                            <h2 className="text-xl font-bold text-heading flex items-center gap-2">{inv.name}</h2>
                                                            <p className="text-sm text-muted font-medium flex items-center gap-1.5 mt-0.5"><Building2 className="w-3.5 h-3.5" /> {inv.firm}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border border-current ${statusMeta.color} bg-current/10`}>
                                                        {statusMeta.label}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-5 divide-x divide-default">
                                                {/* Timeline History */}
                                                <div className="col-span-3 p-6 max-h-[500px] overflow-y-auto">
                                                    <h3 className="text-xs font-semibold text-muted uppercase tracking-widest mb-6 flex items-center gap-2"><History className="w-4 h-4" /> Activity Log</h3>
                                                    <div className="relative space-y-6">
                                                        <div className="absolute top-2 bottom-2 left-3 w-px bg-default" />
                                                        {inv.timeline.map((event, idx) => (
                                                            <div key={event.id} className="relative flex gap-4 pl-10">
                                                                <div className={`absolute left-[-22px] w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#18181b] ${idx === 0 ? 'bg-black dark:bg-white' : 'bg-muted'}`} style={{ left: '9.5px', top: '5px'}} />
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="font-bold flex-1 text-sm text-heading">{INVESTOR_STATUSES.find(s=>s.value===event.stage)?.label}</span>
                                                                        <span className="text-[11px] text-faint flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {new Date(event.date).toLocaleDateString()}</span>
                                                                    </div>
                                                                    <p className="text-sm text-muted bg-stat-bg p-3 rounded-lg border border-default inline-block">{event.note}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Add Update Form */}
                                                <div className="col-span-2 p-6 bg-slate-50 dark:bg-white/[0.02]">
                                                    <h3 className="text-xs font-semibold text-heading uppercase tracking-widest mb-4">Log Update</h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="text-[11px] font-semibold text-muted uppercase block mb-1">New Stage</label>
                                                            <select value={timelineStage} onChange={e=>setTimelineStage(e.target.value as any)} className="w-full text-sm px-3 py-2 rounded-lg bg-input border border-default text-heading focus:outline-none">
                                                                {INVESTOR_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="text-[11px] font-semibold text-muted uppercase block mb-1">Meeting Notes</label>
                                                            <textarea value={timelineNote} onChange={e=>setTimelineNote(e.target.value)} placeholder="e.g., Requested data room access..." rows={4} className="w-full text-sm px-3 py-2 rounded-lg bg-input border border-default text-heading placeholder:text-faint focus:outline-none resize-none" />
                                                        </div>
                                                        <button onClick={handleAddTimelineEvent} disabled={!timelineNote.trim()} className="w-full py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black font-semibold text-sm disabled:opacity-50">Save Update</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })() : (
                                    <>
                                        {/* Add Investor Quick Add */}
                                        <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-white/5 rounded-xl border border-default mb-4">
                                            <input value={newInvestor.name} onChange={e => setNewInvestor(p => ({ ...p, name: e.target.value }))} placeholder="Investor Name" className="flex-1 px-4 py-2 text-sm bg-transparent border-none focus:outline-none text-heading placeholder:text-faint" />
                                            <div className="w-px bg-default mx-1" />
                                            <input value={newInvestor.firm} onChange={e => setNewInvestor(p => ({ ...p, firm: e.target.value }))} placeholder="Firm (e.g. Sequoia)" className="flex-1 px-4 py-2 text-sm bg-transparent border-none focus:outline-none text-heading placeholder:text-faint" />
                                            <button onClick={() => handleAddInvestor(selectedRound)} className="px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-semibold text-sm">Add</button>
                                        </div>

                                        {/* Pipeline List View */}
                                        <div className="bg-card border border-default rounded-2xl card-shadow overflow-hidden">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-slate-50 dark:bg-[#111113] border-b border-default text-[11px] font-semibold text-muted uppercase tracking-wider">
                                                    <tr>
                                                        <th className="px-6 py-4">Investor</th>
                                                        <th className="px-6 py-4">Firm</th>
                                                        <th className="px-6 py-4">Current Stage</th>
                                                        <th className="px-6 py-4 text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-default bg-card">
                                                    {fundingRounds.find(r => r.id === selectedRound)?.investors.map(inv => {
                                                        const statusMeta = INVESTOR_STATUSES.find(s => s.value === inv.status)!;
                                                        return (
                                                            <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                                                <td className="px-6 py-4 font-semibold text-heading">{inv.name}</td>
                                                                <td className="px-6 py-4 text-muted"><span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{inv.firm}</span></td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`inline-flex items-center gap-1.5 font-semibold ${statusMeta.color}`}>
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-current" /> {statusMeta.label}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <button onClick={() => setActiveInvestor({ roundId: selectedRound, invId: inv.id })} className="text-heading font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1 w-full">Tracker <ChevronRight className="w-4 h-4" /></button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                    {fundingRounds.find(r => r.id === selectedRound)?.investors.length === 0 && (
                                                        <tr>
                                                            <td colSpan={4} className="px-6 py-12 text-center text-muted">No investors added to pipeline yet.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
