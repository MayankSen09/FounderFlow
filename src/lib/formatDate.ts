import { format, isValid, parseISO } from 'date-fns';

/**
 * Safe formatting wrapper around date-fns parsing engine.
 * Protects runtime against invalid ISO strings and gracefully falls back.
 */
export function safelyFormatDate(dateValue: string | Date | number, formatStr: string = 'PP'): string {
    if (!dateValue) return 'N/A';

    try {
        const parsedDate = typeof dateValue === 'string' ? parseISO(dateValue) : new Date(dateValue);
        
        if (!isValid(parsedDate)) {
            return 'Invalid Date';
        }

        return format(parsedDate, formatStr);
    } catch (e) {
        return 'Invalid Date';
    }
}
