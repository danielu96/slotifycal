"use client";

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useFormStatus } from "react-dom";
import { deleteReservationAct } from "@/utils/actions";
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
                const res = await deleteReservationAct({ reservationId });
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
