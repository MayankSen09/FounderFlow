import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-[#0a0b0e]">
            <Sidebar />
            <Header onMenuClick={() => {}} />
            <main className="pt-14 lg:pl-64 min-h-screen transition-all duration-300">
                {children}
            </main>
        </div>
    );
};
