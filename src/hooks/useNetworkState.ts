import { useState, useEffect } from 'react';

/**
 * Tracks the browser's dynamic network state
 * Emits active boolean values to preemptively block or enable requests.
 */
export function useNetworkState() {
    const [isOnline, setIsOnline] = useState<boolean>(() => {
        if (typeof navigator !== 'undefined') {
            return navigator.onLine;
        }
        return true;
    });

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}
