import { useState } from 'react';
import { Shield, Palette, User, Edit2, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useFounder } from '../context/FounderContext';
import { motion } from 'framer-motion';

export function Settings() {
    const { success } = useToast();
    const { user, updateProfile: updateAuthProfile } = useAuth();
    const { profile, updateProfile } = useFounder();
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        avatarUrl: user?.avatarUrl || ''
    });
    const [founderData, setFounderData] = useState({
        startupName: profile?.startupName || '',
        industry: profile?.industry || '',
        stage: profile?.stage || 'idea',
        burnRate: profile?.burnRate || 0,
        runway: profile?.runway || 0,
        mrr: profile?.mrr || 0,
        teamSize: profile?.teamSize || 1,
        pitch: profile?.pitch || '',
    });

    const handleSaveProfile = () => {
        updateAuthProfile(profileData);
        success('Profile updated!');
        setShowEditProfile(false);
    };

    const handleSaveFounderProfile = () => {
        updateProfile({
            name: profileData.name || user?.name || 'Founder',
            ...founderData,
        } as any);
        success('Founder profile saved! Your AI co-founder now knows you better.');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:page-bg text-heading">
            <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-1">Settings</h1>
                    <p className="text-sm text-muted">Configure your profile and startup details. The more your AI co-founder knows, the better it can help.</p>
                </div>

                {/* Profile */}
                <div className="p-6 rounded-2xl card-bg border border-default space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2"><User className="w-5 h-5 text-brand-primary" /> Personal Profile</h2>
                        <button onClick={() => setShowEditProfile(!showEditProfile)} className="text-sm text-brand-primary font-bold flex items-center gap-1"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                    </div>
                    {user && (
                        <div className="flex items-center gap-4 p-4 rounded-xl stat-bg">
                            <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=4facfe&color=fff`} alt="" className="w-14 h-14 rounded-full border-2 border-brand-primary/20" />
                            <div>
                                <p className="font-bold">{user.name}</p>
                                <p className="text-sm text-muted">{user.email}</p>
                            </div>
                        </div>
                    )}
                    {showEditProfile && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-4 border-t border-default">
                            <input value={profileData.name} onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))} placeholder="Full Name" className="w-full px-4 py-3 rounded-xl stat-bg border border-default text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40" />
                            <input value={profileData.email} onChange={e => setProfileData(p => ({ ...p, email: e.target.value }))} placeholder="Email" className="w-full px-4 py-3 rounded-xl stat-bg border border-default text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40" />
                            <Button onClick={handleSaveProfile} className="bg-brand-primary text-white text-sm font-bold px-6 py-2 rounded-xl"><Save className="w-4 h-4 mr-2" /> Save Profile</Button>
                        </motion.div>
                    )}
                </div>

                {/* Founder Profile — this feeds the AI */}
                <div className="p-6 rounded-2xl card-bg border border-default space-y-5">
                    <div>
                        <h2 className="text-lg font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-400" /> Startup Profile</h2>
                        <p className="text-xs text-faint mt-1">This data powers your AI co-founder's advice. Keep it accurate.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-faint mb-1 block">Startup Name</label>
                            <input value={founderData.startupName} onChange={e => setFounderData(p => ({ ...p, startupName: e.target.value }))} className="w-full px-4 py-3 rounded-xl stat-bg border border-default text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-faint mb-1 block">Industry</label>
                            <input value={founderData.industry} onChange={e => setFounderData(p => ({ ...p, industry: e.target.value }))} className="w-full px-4 py-3 rounded-xl stat-bg border border-default text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-faint mb-1 block">Stage</label>
                            <select value={founderData.stage} onChange={e => setFounderData(p => ({ ...p, stage: e.target.value as typeof p.stage }))} className="w-full px-4 py-3 rounded-xl stat-bg border border-default text-white text-sm focus:outline-none">
                                <option value="idea">Idea</option>
                                <option value="pre-seed">Pre-Seed</option>
                                <option value="seed">Seed</option>
                                <option value="series-a">Series A</option>
                                <option value="series-b">Series B</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-faint mb-1 block">Team Size</label>
                            <input type="number" value={founderData.teamSize} onChange={e => setFounderData(p => ({ ...p, teamSize: parseInt(e.target.value) || 1 }))} className="w-full px-4 py-3 rounded-xl stat-bg border border-default text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-faint mb-1 block">Monthly Burn ($)</label>
                            <input type="number" value={founderData.burnRate} onChange={e => setFounderData(p => ({ ...p, burnRate: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-3 rounded-xl stat-bg border border-default text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-faint mb-1 block">Runway (months)</label>
                            <input type="number" value={founderData.runway} onChange={e => setFounderData(p => ({ ...p, runway: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-3 rounded-xl stat-bg border border-default text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-faint mb-1 block">MRR ($)</label>
                            <input type="number" value={founderData.mrr} onChange={e => setFounderData(p => ({ ...p, mrr: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-3 rounded-xl stat-bg border border-default text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40" />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-faint mb-1 block">One-Line Pitch</label>
                        <input value={founderData.pitch} onChange={e => setFounderData(p => ({ ...p, pitch: e.target.value }))} placeholder="We help X do Y by Z..." className="w-full px-4 py-3 rounded-xl stat-bg border border-default text-white text-sm placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-brand-primary/40" />
                    </div>

                    <button onClick={handleSaveFounderProfile} className="px-8 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Startup Profile
                    </button>
                </div>

                {/* About */}
                <div className="p-6 rounded-2xl card-bg border border-default space-y-3">
                    <h2 className="text-lg font-bold flex items-center gap-2"><Palette className="w-5 h-5 text-purple-400" /> About FounderFlow</h2>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between p-3 rounded-lg stat-bg"><span className="text-faint">Version</span><span className="font-bold">2.0.0</span></div>
                        <div className="flex justify-between p-3 rounded-lg stat-bg"><span className="text-faint">Storage</span><span className="font-bold">localStorage</span></div>
                        <div className="flex justify-between p-3 rounded-lg stat-bg"><span className="text-faint">AI Model</span><span className="font-bold">Gemini 2.5 Flash</span></div>
                        <div className="flex justify-between p-3 rounded-lg stat-bg"><span className="text-faint">Platform</span><span className="font-bold">FounderFlow AI</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
