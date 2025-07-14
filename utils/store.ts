import { create } from 'zustand';
import { Reservation } from './types';

type CalendarState = {
    reservations: Reservation[];
    setReservations: (r: Reservation[]) => void;
};

export const useCalendarStore = create<CalendarState>((set) => ({
    reservations: [],
    setReservations: (r) => set({ reservations: r }),
}));



