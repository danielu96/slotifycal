export const dayNames: Record<string, number> = {
    'niedziela': 0,
    'poniedziałek': 1,
    'wtorek': 2,
    'środa': 3,
    'czwartek': 4,
    'piątek': 5,
    'sobota': 6,
};

export const monthNames: Record<string, number> = {
    'styczeń': 0,
    'luty': 1,
    'marzec': 2,
    'kwiecień': 3,
    'maj': 4,
    'czerwiec': 5,
    'lipiec': 6,
    'sierpień': 7,
    'wrzesień': 8,
    'październik': 9,
    'listopad': 10,
    'grudzień': 11,
};

export function isValidDateString(value: string): boolean {
    const date = new Date(value);
    return !isNaN(date.getTime());
}

export function parseDateFromQuery(query: string): Date | null {
    const now = new Date();
    const lowerQuery = query.toLowerCase().trim();

    // Obsługa pojedynczego dnia tygodnia
    if (dayNames[lowerQuery] !== undefined) {
        const today = now.getDay();
        const targetDay = dayNames[lowerQuery];

        const diff = (targetDay - today + 7) % 7 || 7;
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + diff);
        return targetDate;
    }

    // Obsługa zapisu typu "5 sierpnia"
    const regex = /^(\d{1,2})\s+([^\d\s]+)$/;
    const match = lowerQuery.match(regex);
    if (match) {
        const [_, dayStr, monthStr] = match;
        const day = parseInt(dayStr, 10);
        const month = monthNames[monthStr];
        if (month !== undefined) {
            const year = now.getMonth() > month ? now.getFullYear() + 1 : now.getFullYear();
            const date = new Date(year, month, day);
            return isNaN(date.getTime()) ? null : date;
        }
    }

    // Standardowa obsługa
    const parsed = new Date(query);
    return isNaN(parsed.getTime()) ? null : parsed;
}

