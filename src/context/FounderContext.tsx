import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface FounderProfile {
    id?: string;
    name: string;
    startupName: string;
    industry: string;
    stage: 'idea' | 'pre-seed' | 'seed' | 'series-a' | 'series-b';
    runway?: number;       // months
    burnRate?: number;     // monthly USD
    mrr?: number;
    teamSize?: number;
    pitch?: string;        // one-liner
}

export interface JournalEntry {
    id: string;
    type: 'decision' | 'mistake' | 'win' | 'learning' | 'pivot';
    title: string;
    content: string;
    tags: string[];
    aiInsight?: string;
    createdAt: string;
}

export interface TimelineEvent {
    id: string;
    stage: 'cold' | 'warm' | 'pitched' | 'due-diligence' | 'term-sheet' | 'committed' | 'passed';
    date: string;
    note: string;
}

export interface Investor {
    id: string;
    name: string;
    firm: string;
    status: 'cold' | 'warm' | 'pitched' | 'due-diligence' | 'term-sheet' | 'committed' | 'passed';
    timeline: TimelineEvent[];
    notes: string;
}

export interface FundingRound {
    id: string;
    roundType: 'pre-seed' | 'seed' | 'series-a' | 'series-b';
    targetAmount: number;
    raisedAmount: number;
    status: 'planning' | 'active' | 'closed';
    deadline?: string;
    investors: Investor[];
    notes: string;
    createdAt: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface FounderContextType {
    // Profile
    profile: FounderProfile | null;
    updateProfile: (profile: FounderProfile) => void;

    // Journal
    journal: JournalEntry[];
    addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
    deleteJournalEntry: (id: string) => void;

    // Funding
    fundingRounds: FundingRound[];
    addFundingRound: (round: Omit<FundingRound, 'id' | 'createdAt'>) => void;
    updateFundingRound: (id: string, round: Partial<FundingRound>) => void;

    // Chat history
    chatHistory: ChatMessage[];
    addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    clearChatHistory: () => void;

    // AI context builder
    getFounderContext: () => string;
}

const FounderContext = createContext<FounderContextType | null>(null);

// ============================================================================
// STORAGE HELPERS
// ============================================================================

const STORAGE_KEYS = {
    profile: 'ff_founder_profile',
    journal: 'ff_journal',
    funding: 'ff_funding',
    chat: 'ff_chat_history',
};

function loadFromStorage<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function saveToStorage(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
}

// ============================================================================
// PROVIDER
// ============================================================================

export function FounderProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<FounderProfile | null>(() => loadFromStorage(STORAGE_KEYS.profile, null));
    const [journal, setJournal] = useState<JournalEntry[]>(() => loadFromStorage(STORAGE_KEYS.journal, []));
    const [fundingRounds, setFundingRounds] = useState<FundingRound[]>(() => loadFromStorage(STORAGE_KEYS.funding, []));
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => loadFromStorage(STORAGE_KEYS.chat, []));

    // Persist on change
    useEffect(() => { saveToStorage(STORAGE_KEYS.profile, profile); }, [profile]);
    useEffect(() => { saveToStorage(STORAGE_KEYS.journal, journal); }, [journal]);
    useEffect(() => { saveToStorage(STORAGE_KEYS.funding, fundingRounds); }, [fundingRounds]);
    useEffect(() => { saveToStorage(STORAGE_KEYS.chat, chatHistory); }, [chatHistory]);

    const updateProfile = (p: FounderProfile) => setProfile(p);

    const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
        const newEntry: JournalEntry = {
            ...entry,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        setJournal(prev => [newEntry, ...prev]);
    };

    const deleteJournalEntry = (id: string) => {
        setJournal(prev => prev.filter(e => e.id !== id));
    };

    const addFundingRound = (round: Omit<FundingRound, 'id' | 'createdAt'>) => {
        const newRound: FundingRound = {
            ...round,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        setFundingRounds(prev => [newRound, ...prev]);
    };

    const updateFundingRound = (id: string, updates: Partial<FundingRound>) => {
        setFundingRounds(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const newMsg: ChatMessage = {
            ...msg,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
        };
        setChatHistory(prev => [...prev, newMsg]);
    };

    const clearChatHistory = () => setChatHistory([]);

    // Build full founder context string for AI prompts
    const getFounderContext = (): string => {
        const parts: string[] = [];

        if (profile) {
            parts.push(`FOUNDER PROFILE:
- Name: ${profile.name}
- Startup: ${profile.startupName}
- Industry: ${profile.industry}
- Stage: ${profile.stage}
- Monthly Burn Rate: $${profile.burnRate?.toLocaleString() || 'Unknown'}
- Runway: ${profile.runway || 'Unknown'} months
- MRR: $${profile.mrr?.toLocaleString() || '0'}
- Team Size: ${profile.teamSize || 1}
- Pitch: ${profile.pitch || 'Not set'}`);
        }

        // Recent journal entries (last 10)
        const recentJournal = journal.slice(0, 10);
        if (recentJournal.length > 0) {
            parts.push(`\nRECENT FOUNDER JOURNAL (${recentJournal.length} entries):
${recentJournal.map(e => `- [${e.type.toUpperCase()}] ${e.title}: ${e.content.slice(0, 200)}`).join('\n')}`);
        }

        // Active funding
        const activeFunding = fundingRounds.filter(r => r.status !== 'closed');
        if (activeFunding.length > 0) {
            parts.push(`\nACTIVE FUNDING:
${activeFunding.map(r => `- ${r.roundType.toUpperCase()}: Target $${r.targetAmount.toLocaleString()}, Raised $${r.raisedAmount.toLocaleString()}, Status: ${r.status}, Investors: ${r.investors.length}`).join('\n')}`);
        }

        // Mistake patterns
        const mistakes = journal.filter(e => e.type === 'mistake');
        if (mistakes.length > 0) {
            parts.push(`\nPAST MISTAKES TO AVOID (${mistakes.length} logged):
${mistakes.slice(0, 5).map(m => `- ${m.title}`).join('\n')}`);
        }

        return parts.join('\n\n') || 'No founder data yet. Ask the founder to set up their profile.';
    };

    return (
        <FounderContext.Provider value={{
            profile, updateProfile,
            journal, addJournalEntry, deleteJournalEntry,
            fundingRounds, addFundingRound, updateFundingRound,
            chatHistory, addChatMessage, clearChatHistory,
            getFounderContext,
        }}>
            {children}
        </FounderContext.Provider>
    );
}

export function useFounder() {
    const ctx = useContext(FounderContext);
    if (!ctx) throw new Error('useFounder must be used within FounderProvider');
    return ctx;
}

// Standalone context builder for use in AI prompts (pass data directly)
export function getFounderContext(data: {
    profile: FounderProfile | null;
    journal: JournalEntry[];
    fundingRounds: FundingRound[];
}): string {
    const { profile, journal, fundingRounds } = data;
    const parts: string[] = [];

    if (profile) {
        parts.push(`FOUNDER PROFILE:
- Name: ${profile.name}
- Startup: ${profile.startupName}
- Industry: ${profile.industry}
- Stage: ${profile.stage}
- Monthly Burn Rate: $${profile.burnRate?.toLocaleString() || 'Unknown'}
- Runway: ${profile.runway || 'Unknown'} months
- MRR: $${profile.mrr?.toLocaleString() || '0'}
- Team Size: ${profile.teamSize || 1}
- Pitch: ${profile.pitch || 'Not set'}`);
    }

    const recentJournal = journal.slice(0, 10);
    if (recentJournal.length > 0) {
        parts.push(`\nRECENT FOUNDER JOURNAL (${recentJournal.length} entries):
${recentJournal.map(e => `- [${e.type.toUpperCase()}] ${e.title}: ${e.content.slice(0, 200)}`).join('\n')}`);
    }

    const activeFunding = fundingRounds.filter(r => r.status !== 'closed');
    if (activeFunding.length > 0) {
        parts.push(`\nACTIVE FUNDING:
${activeFunding.map(r => `- ${r.roundType.toUpperCase()}: Target $${r.targetAmount.toLocaleString()}, Raised $${r.raisedAmount.toLocaleString()}, Status: ${r.status}, Investors: ${r.investors.length}`).join('\n')}`);
    }

    const mistakes = journal.filter(e => e.type === 'mistake');
    if (mistakes.length > 0) {
        parts.push(`\nPAST MISTAKES TO AVOID (${mistakes.length} logged):
${mistakes.slice(0, 5).map(m => `- ${m.title}`).join('\n')}`);
    }

    return parts.join('\n\n') || 'No founder data yet. Ask the founder to set up their profile.';
}
