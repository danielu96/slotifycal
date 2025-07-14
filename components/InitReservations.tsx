import { useEffect } from "react";
import { useCalendarStore } from "@/utils/store";
import { fetchAllReservations } from "@/utils/actions";

export function InitReservations() {
    const setReservations = useCalendarStore((s) => s.setReservations);


    useEffect(() => {
        async function load() {
            try {
                const data = await fetchAllReservations();
                console.log("ALL RESERVATIONS:", data);
                setReservations(data);
            } catch (err) {
                console.error("Failed to load reservations", err);
            }
        }
        load();
    }, [setReservations]);

    return null;
}
