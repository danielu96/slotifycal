"use client";

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useFormStatus } from "react-dom";
import { deleteReservationAction } from "@/utils/actions";
import { IconButton } from "@/components/form/Buttons";

export default function DeleteReservation({
    reservationId,
}: {
    reservationId: string;
}) {
    const { pending } = useFormStatus();
    const router = useRouter();

    return (
        <form
            action={async () => {
                const res = await deleteReservationAction({ reservationId });
                if (res?.message) {
                    toast.success(res.message);
                    router.refresh();
                } else {
                    toast.error("Coś poszło nie tak.");
                }
            }}
        >
            <IconButton actionType="delete" />

        </form>
    );
}
