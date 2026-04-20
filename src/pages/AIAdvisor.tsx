import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User, Loader2, RotateCcw } from 'lucide-react';
import { useFounder, getFounderContext } from '../context/FounderContext';
import { generateWithAI } from '../lib/ai';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const QUICK_PROMPTS = [
    "What should I focus on this week?",
    "Review my burn rate and runway",
    "Help me prepare for an investor pitch",
    "What mistakes am I repeating?",
    "Give me a growth strategy for this stage",
];

export default function AIAdvisor() {
    const { profile, journal, fundingRounds, chatHistory, addChatMessage } = useFounder();
    const [messages, setMessages] = useState<Message[]>(chatHistory.length > 0 ? chatHistory : [{
        role: 'assistant' as const,
        content: `Hey${profile?.name ? ` ${profile.name}` : ''}! I'm your AI co-founder. I know your startup context — ask me anything about strategy, fundraising, hiring, or operations. The more you use the Founder Journal, the smarter I get.`,
        timestamp: new Date(),
    }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;
        const userMsg: Message = { role: 'user', content: text.trim(), timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const founderCtx = getFounderContext({ profile: profile!, journal, fundingRounds });
            const prompt = `${founderCtx}\n\n---\nThe founder asks: "${text.trim()}"\n\nRespond as their experienced AI co-founder. Be direct, actionable, and reference their specific data when relevant. Use short paragraphs.`;
            const response = await generateWithAI(prompt);
            const assistantMsg: Message = { role: 'assistant', content: response, timestamp: new Date() };
            setMessages(prev => [...prev, assistantMsg]);
            addChatMessage(userMsg);
            addChatMessage(assistantMsg);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting. Please check your API key in .env and try again.", timestamp: new Date() }]);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen page-bg">
            <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
                {/* Header */}
                <div className="flex items-center gap-4 mb-6 flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-cyan-500/20 flex items-center justify-center border border-brand-primary/20">
                        <Bot className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-heading">AI Co-Founder</h1>
                        <p className="text-sm text-muted">Context-aware advice based on your startup data</p>
                    </div>
                </div>

                {/* Chat */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                    <AnimatePresence>
                        {messages.map((msg, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-5 py-4 rounded-2xl text-sm leading-relaxed ${
                                    msg.role === 'user'
                                        ? 'bg-brand-primary text-white rounded-br-md'
                                        : 'card-bg border border-default text-body rounded-bl-md'
                                }`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {msg.role === 'assistant' ? <Sparkles className="w-3.5 h-3.5 text-brand-primary" /> : <User className="w-3.5 h-3.5" />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{msg.role === 'assistant' ? 'Co-Founder' : 'You'}</span>
                                    </div>
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loading && (
                        <div className="flex justify-start">
                            <div className="px-5 py-4 rounded-2xl card-bg border border-default rounded-bl-md">
                                <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Quick prompts */}
                {messages.length <= 2 && (
                    <div className="flex gap-2 mb-3 flex-wrap flex-shrink-0">
                        {QUICK_PROMPTS.map(p => (
                            <button key={p} onClick={() => sendMessage(p)} className="px-3 py-1.5 rounded-full text-xs font-medium card-bg border border-default text-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all">
                                {p}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="flex gap-3 flex-shrink-0">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                        placeholder="Ask your AI co-founder anything..."
                        className="flex-1 px-5 py-3.5 rounded-2xl card-bg border border-default text-heading placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-brand-primary/30 text-sm"
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || loading}
                        className="px-5 py-3.5 rounded-2xl bg-brand-primary text-white font-bold text-sm disabled:opacity-30 hover:shadow-lg hover:shadow-brand-primary/20 transition-all"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
