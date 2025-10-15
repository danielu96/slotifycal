'use client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { deleteReservationAct } from '@/utils/actions'
import { IconButton } from '@/components/form/Buttons'

export default function DeleteReservation({ reservationId }: { reservationId: string }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm('Na pewno usunąć tę rezerwację?')) return

        try {
            const result = await deleteReservationAct({ reservationId })
            if (!result.ok) throw new Error(result.message || 'Nieznany błąd')

            toast.success(result.message)
            startTransition(() => router.refresh())
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    return (
        // <button
        //     onClick={handleDelete}
        //     disabled={isPending}
        //     title="Usuń rezerwację"
        //     aria-busy={isPending}
        //     className="flex items-center space-x-2"
        // >
        //     <IconButton actionType="delete" />
        // </button>
        <span
            role="button"
            onClick={handleDelete}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleDelete()}
            className="inline-flex cursor-pointer"
            aria-busy={isPending}
        >
            <IconButton actionType="delete" />
        </span>
    )
}