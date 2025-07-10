import { useEffect } from "react";
import { useProperty } from "@/utils/store";
import { fetchReservations } from "@/utils/actions";

export function InitReservations() {
    const setReservations = useProperty((s) => s.setReservations);

    useEffect(() => {
        fetchReservations().then(setReservations);
    }, [setReservations]);

    return null;
}
