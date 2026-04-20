import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, X, Trash2, Lightbulb, AlertTriangle, Trophy, RotateCcw, Brain } from 'lucide-react';
import { useFounder, type JournalEntry } from '../context/FounderContext';

const ENTRY_TYPES = [
    { value: 'decision', label: 'Decision', icon: Lightbulb },
    { value: 'mistake', label: 'Mistake', icon: AlertTriangle },
    { value: 'win', label: 'Win', icon: Trophy },
    { value: 'learning', label: 'Learning', icon: Brain },
    { value: 'pivot', label: 'Pivot', icon: RotateCcw },
] as const;

export default function FounderJournal() {
    const { journal, addJournalEntry, deleteJournalEntry } = useFounder();
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState<string>('all');
    const [form, setForm] = useState({ type: 'decision' as JournalEntry['type'], title: '', content: '', tags: '' });

    const handleSubmit = () => {
        if (!form.title.trim() || !form.content.trim()) return;
        addJournalEntry({ type: form.type, title: form.title, content: form.content, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
        setForm({ type: 'decision', title: '', content: '', tags: '' });
        setShowForm(false);
    };

    const filteredJournal = filter === 'all' ? journal : journal.filter(e => e.type === filter);

    return (
        <div className="min-h-screen page-bg">
            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-sm">
                            <BookOpen className="w-6 h-6 text-white dark:text-black" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-heading">Founder Journal</h1>
                            <p className="text-sm text-muted">Log decisions, mistakes, and wins. Your AI co-founder learns from every entry.</p>
                        </div>
                    </div>
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-80 transition-opacity">
                        <Plus className="w-4 h-4" /> New Entry
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Decisions', count: journal.filter(e => e.type === 'decision').length },
                        { label: 'Wins', count: journal.filter(e => e.type === 'win').length },
                        { label: 'Mistakes Logged', count: journal.filter(e => e.type === 'mistake').length },
                    ].map(stat => (
                        <div key={stat.label} className="stat-bg rounded-2xl p-5 border border-default">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-heading">{stat.count}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'all' ? 'card-bg border border-default text-heading shadow-sm' : 'text-muted hover:text-heading'}`}>
                        All ({journal.length})
                    </button>
                    {ENTRY_TYPES.map(type => {
                        const count = journal.filter(e => e.type === type.value).length;
                        return (
                            <button key={type.value} onClick={() => setFilter(type.value)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === type.value ? 'bg-black dark:bg-white text-white dark:text-black border border-transparent' : 'stat-bg text-muted border border-default hover:border-strong'}`}>
                                <type.icon className="w-3.5 h-3.5" /> {type.label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
                            <div className="p-8 rounded-3xl card-bg border border-default space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-black text-heading">New Journal Entry</h3>
                                    <button onClick={() => setShowForm(false)} className="text-muted hover:text-heading"><X className="w-5 h-5" /></button>
                                </div>
                            <div className="flex gap-2 flex-wrap">
                                    {ENTRY_TYPES.map(type => (
                                        <button key={type.value} onClick={() => setForm(f => ({ ...f, type: type.value as JournalEntry['type'] }))} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${form.type === type.value ? 'bg-black dark:bg-white text-white dark:text-black border border-transparent' : 'stat-bg text-muted border border-default hover:border-strong'}`}>
                                            <type.icon className="w-4 h-4" /> {type.label}
                                        </button>
                                    ))}
                                </div>
                                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="What happened?" className="w-full px-5 py-3 rounded-xl stat-bg border border-default text-heading placeholder:text-faint text-sm font-bold" />
                                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Describe the context, what you learned..." rows={4} className="w-full px-5 py-3 rounded-xl stat-bg border border-default text-heading placeholder:text-faint resize-none text-sm" />
                                <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Tags (comma separated): pricing, hiring..." className="w-full px-5 py-3 rounded-xl stat-bg border border-default text-heading placeholder:text-faint text-sm" />
                                <button onClick={handleSubmit} disabled={!form.title.trim() || !form.content.trim()} className="px-8 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm disabled:opacity-30 hover:opacity-80 transition-opacity">Save Entry</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Entries */}
                <div className="space-y-4">
                    {filteredJournal.length === 0 && (
                        <div className="text-center py-20 text-muted">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="font-bold">No entries yet</p>
                            <p className="text-sm mt-1">Start logging your founder journey.</p>
                        </div>
                    )}
                    <AnimatePresence>
                        {filteredJournal.map(entry => {
                            const typeMeta = ENTRY_TYPES.find(t => t.value === entry.type) || ENTRY_TYPES[0];
                            return (
                                <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 rounded-2xl card-bg border border-default hover:border-strong transition-all group">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-xl stat-bg border border-default flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <typeMeta.icon className="w-5 h-5 text-muted" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{typeMeta.label}</span>
                                                    <span className="text-[10px] text-faint">{new Date(entry.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <h3 className="text-base font-bold text-heading mb-2">{entry.title}</h3>
                                                <p className="text-sm text-muted leading-relaxed">{entry.content}</p>
                                                {entry.tags.length > 0 && (
                                                    <div className="flex gap-1.5 mt-3 flex-wrap">
                                                        {entry.tags.map(tag => (
                                                            <span key={tag} className="px-2 py-0.5 rounded-md stat-bg text-[10px] font-bold text-muted uppercase tracking-wider">{tag}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={() => deleteJournalEntry(entry.id)} className="p-2 rounded-lg text-faint hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
