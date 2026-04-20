import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFounder } from '../context/FounderContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export function Onboarding() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { updateProfile } = useFounder();
    const [loading, setLoading] = useState(false);
    
    // Quick core profile
    const [name, setName] = useState('');
    const [startupName, setStartupName] = useState('');
    const [industry, setIndustry] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            updateProfile({
                name: name || 'Founder',
                startupName: startupName || 'My Startup',
                industry: industry || 'Technology',
                stage: 'seed', // Default
            });
            login('Admin'); // System requires a role
            navigate('/dashboard');
        }, 800);
    };

    return (
        <div className="min-h-screen page-bg flex flex-col">
            <div className="p-6 flex justify-end">
                <ThemeToggle />
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm"
                >
                    <div className="flex justify-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-md">
                            <Layers className="w-8 h-8 text-white dark:text-black" />
                        </div>
                    </div>
                    
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-heading mb-2">FounderFlow</h1>
                        <p className="text-muted text-sm">Configure your AI Co-Founder.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-heading mb-1.5 ml-1">Your Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Steve Jobs"
                                className="w-full px-4 py-3 rounded-xl bg-input border border-default text-heading placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-heading text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-heading mb-1.5 ml-1">Startup Name</label>
                            <input
                                type="text"
                                required
                                value={startupName}
                                onChange={e => setStartupName(e.target.value)}
                                placeholder="Apple"
                                className="w-full px-4 py-3 rounded-xl bg-input border border-default text-heading placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-heading text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-heading mb-1.5 ml-1">Industry</label>
                            <input
                                type="text"
                                required
                                value={industry}
                                onChange={e => setIndustry(e.target.value)}
                                placeholder="Consumer Electronics"
                                className="w-full px-4 py-3 rounded-xl bg-input border border-default text-heading placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-heading text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !name.trim() || !startupName.trim() || !industry.trim()}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 mt-6 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm disabled:opacity-50 transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>Enter Workspace <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
