import { Reservation } from '@prisma/client';

import { format } from 'date-fns';

export function groupReservationsByDate(
    reservations: Reservation[]
): Record<string, string[]> {
    return reservations.reduce<Record<string, string[]>>((acc, r) => {
        const d = new Date(r.date);
        d.setHours(0, 0, 0, 0);
        const key = format(d, "yyyy-MM-dd");   // LOKALNIE
        if (!acc[key]) acc[key] = [];
        acc[key].push(r.time);
        return acc;
    }, {});
}

export const extractBlockedDates = (
    reservations: Reservation[],
    today = new Date()
): Date[] => {
    // ujednolicamy dziś bez godzin
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    return reservations
        .map((r) => {
            const d = new Date(r.date);
            d.setHours(0, 0, 0, 0);
            return d;
        })
        // pomijamy dni sprzed dziś
        .filter((d) => d >= startOfToday);
};
export const generateDisabledDates = (
    disabledDatesList: Date[]
): { [key: string]: boolean } => {
    if (disabledDatesList.length === 0) return {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const disabledDates: { [key: string]: boolean } = {};

    disabledDatesList.forEach((date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);

        if (normalized < today) return;

        const dateString = normalized.toISOString().split("T")[0];
        disabledDates[dateString] = true;
    });

    return disabledDates;
};


