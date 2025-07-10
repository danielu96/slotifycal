import React from "react";
import { fetchReservations } from "@/utils/actions";
import DeleteReservation from "@/components/DeleteResrvation";

export default async function ReservationsPage() {
    const reservations = await fetchReservations();

    return (
        <>
            <div className="container mx-auto p-4">
                {reservations.length ? (
                    <ul className="space-y-4">
                        {reservations.map((r) => (
                            <li
                                key={r.id}
                                className="p-4 border rounded-lg flex justify-between"
                            >
                                <div>
                                    <p>Time: {r.time}</p>
                                    <p className="text-sm text-gray-500">
                                        Date: {new Date(r.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <DeleteReservation reservationId={r.id} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No reservations found.</p>
                )}
            </div>

        </>
    );
}





