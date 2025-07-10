import { create } from 'zustand';
import type { Reservation } from './types';

type PropertyState = {
    reservations: Reservation[];

    // akcja do pełnego ustawiania listy
    setReservations: (r: Reservation[]) => void;

    // akcja do dodawania jednej rezerwacji
    addReservation: (r: Reservation) => void;
};

export const useProperty = create<PropertyState>((set) => ({
    reservations: [],

    setReservations: (reservations) =>
        set(() => ({ reservations })),

    addReservation: (reservation) =>
        set((state) => ({ reservations: [...state.reservations, reservation] })),
}));



