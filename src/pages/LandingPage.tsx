import { motion } from 'framer-motion';
import { ArrowRight, Shield, CheckCircle2, Zap, Layers, Cpu, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary dark:bg-brand-vibrant flex items-center justify-center text-white shadow-lg shadow-brand-primary/30">
                            <Shield className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight">Founder<span className="text-brand-primary dark:text-brand-secondary">Flow</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#features" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-secondary transition-colors">Features</a>
                        <a href="#pricing" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-secondary transition-colors">Enterprise</a>
                        <ThemeToggle />
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate('/onboarding')}
                        >
                            Log In
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate('/onboarding')}
                            className="shadow-lg shadow-brand-primary/20"
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">

                    {/* Announcement Pill */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-sm mb-8 hover:border-brand-primary/20 dark:hover:border-brand-primary/20 transition-colors cursor-pointer group"
                    >
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </span>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-brand-primary dark:group-hover:text-brand-secondary transition-colors">FounderFlow 3.0: The Operations Ecosystem for Startups</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6"
                    >
                        Scale your startup <br className="hidden md:block" />\n                        with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-vibrant to-brand-secondary dark:from-brand-primary dark:via-brand-vibrant dark:to-brand-secondary animate-text">FounderFlow</span>.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Empowering modern founders. The unified platform that combines AI-driven workflows, runway calculators, and proven funnels to scale your business from Seed to Series A.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button
                            variant="gradient"
                            size="lg"
                            className="h-14 px-8 text-base rounded-full shadow-xl shadow-brand-primary/20"
                            onClick={() => navigate('/onboarding')}
                        >
                            Start Building Free <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="h-14 px-8 text-base rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800"
                            onClick={() => navigate('/book-demo')}
                        >
                            Book a Demo
                        </Button>
                    </motion.div>
                </div>

                {/* Abstract Visuals */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1200px] -z-10 pointer-events-none opacity-60 dark:opacity-30">
                    <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-brand-vibrant/20 dark:bg-brand-vibrant/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten animate-blob" />
                    <div className="absolute top-[30%] right-[20%] w-[500px] h-[500px] bg-violet-500/20 dark:bg-violet-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000" />
                    <div className="absolute bottom-[20%] left-[40%] w-[500px] h-[500px] bg-teal-500/20 dark:bg-teal-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-4000" />
                </div>
            </section>

            {/* Bento Grid Features */}
            <section id="features" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-4">Built for fast-growing startups</h2>
                        <p className="text-slate-500 dark:text-slate-400">Everything you need to find Product-Market Fit and scale efficiently.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Large Card */}
                        <div className="md:col-span-2 p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-2xl bg-brand-primary/5 dark:bg-brand-primary/10 text-brand-primary dark:text-brand-secondary group-hover:scale-110 transition-transform">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Instant AI Generation</h3>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">Stop searching for formulas. Feed our engine a simple prompt like "Technical Co-founder Hiring" or "Series A Due Diligence" and get expert-grade playbooks in seconds.</p>

                            {/* Visual Mock */}
                            <div className="w-full h-48 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-pulse">
                                    <div className="w-2 h-2 rounded-full bg-brand-vibrant"></div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-24 bg-slate-100 dark:bg-slate-700 rounded"></div>
                                        <div className="h-2 w-16 bg-slate-100 dark:bg-slate-700 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tall Card */}
                        <div className="p-8 rounded-3xl bg-slate-900 dark:bg-slate-950 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="p-3 rounded-2xl bg-white/10 w-fit mb-6 backdrop-blur-md">
                                    <Shield className="w-6 h-6 text-brand-secondary dark:text-brand-secondary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Enterprise Grade</h3>
                                <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed mb-6">
                                    SSO, Audit Logs, and Role-Based Access Control built-in.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-slate-300 dark:text-slate-400">
                                        <CheckCircle2 className="w-4 h-4 text-teal-400" /> SOC2 Compliant
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-300 dark:text-slate-400">
                                        <CheckCircle2 className="w-4 h-4 text-teal-400" /> 99.9% Uptime
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-300 dark:text-slate-400">
                                        <CheckCircle2 className="w-4 h-4 text-teal-400" /> 24/7 Support
                                    </div>
                                </div>
                            </div>
                            {/* Gradient Blob */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-primary/30 dark:bg-brand-primary/20 rounded-full blur-[80px] group-hover:bg-brand-primary/40 dark:group-hover:bg-brand-primary/30 transition-colors"></div>
                        </div>

                        {/* Smaller Cards */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:border-brand-primary/20 dark:hover:border-brand-primary/20 transition-colors">
                            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 w-fit mb-4">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Version Control</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Track every change with Git-like precision.</p>
                        </div>

                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:border-brand-primary/20 dark:hover:border-brand-primary/20 transition-colors">
                            <div className="p-3 rounded-2xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 w-fit mb-4">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Global CDN</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Lightning fast access from anywhere.</p>
                        </div>

                        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-800 border border-brand-primary/10 dark:border-brand-primary/10/30 shadow-sm flex flex-col justify-center items-center text-center">
                            <Cpu className="w-8 h-8 text-brand-primary dark:text-brand-secondary mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">API First</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Connect to your stack.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
