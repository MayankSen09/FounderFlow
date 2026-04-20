import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header = ({ onMenuClick: _onMenuClick }: HeaderProps) => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <header className="fixed top-0 right-0 z-20 h-14 header-bg backdrop-blur-xl border-b border-default lg:left-64 transition-all duration-300">
            <div className="h-full px-6 flex items-center justify-between">
                <div className="hidden md:flex max-w-md w-full relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted group-focus-within:text-brand-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="block w-full pl-10 pr-3 py-2 border-0 inset-bg rounded-xl text-heading placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg card-bg border border-default">
                        <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=4facfe&color=fff&size=32`} alt="" className="w-6 h-6 rounded-full" />
                        <span className="text-sm font-medium text-body">{user.name}</span>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};
