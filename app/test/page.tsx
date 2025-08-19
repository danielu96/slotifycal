
import React from "react";
import { fetchAllReservations } from "@/utils/actions";
import DeleteReservation from "@/components/DelRes";
import Search from "@/components/ui/search";

export default async function TestPage() {
    const reservations = await fetchAllReservations();

    return (
        <>
            <div className="container mx-auto p-4">
                <Search placeholder="Search reservations..." />
                <h1 className="text-2xl font-bold mb-4">All Reservations</h1>
                <p className="mb-4">You have {reservations.length} all reservations.</p>
                {reservations.length ? (
                    <ul className="space-y-4">
                        {reservations.map((r) => (
                            <li
                                key={r.id}
                                className="p-4 border rounded-lg flex flex-col justify-between"
                            >

                                <p>User: {r.profile.firstName}</p>
                                <p>Time: {r.time}</p>
                                <p className="text-sm text-gray-500">
                                    Date: {new Date(r.date).toLocaleDateString()}
                                </p>

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







