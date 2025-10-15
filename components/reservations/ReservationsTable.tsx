'use client';
import Link from 'next/link';
import DeleteReservation from '@/components/DelRes';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ReservationsTable({
    reservations,
    totalPages,
    totalCount,
    currentPage,
    query,
}: {
    reservations: any[];
    totalPages: number;
    totalCount: number;
    currentPage: number;
    query: string;
}) {
    if (!reservations.length) {
        return <p>No reservations found.</p>;
    }

    const pathname = usePathname();
    const searchParams = useSearchParams();
    return (
        <>
            <div className="flex flex-col h-[600px] border p-4">
                <p className="mb-2">Znaleziono {totalCount} wpisów.</p>
                <ul className="flex-grow overflow-auto space-y-2">
                    {reservations.map((r) => (
                        <li key={r.id} className="p-4 border rounded-lg flex justify-between">
                            <div>
                                <p>Godzina: {r.time}</p>
                                <p className="text-sm text-gray-500">
                                    Data: {new Date(r.date).toLocaleDateString('pl-PL')}
                                </p>
                                <p className="text-sm">
                                    User: {r.profile.firstName} {r.profile.lastName}
                                </p>
                            </div>
                            <DeleteReservation reservationId={r.id} />
                            {/* 1. Testowy błąd 404 Not Found */}
                            {/* <DeleteReservation reservationId="force-error" key="force-error" /> */}

                        </li>
                    ))}
                </ul>

                {/* Paginacja */}
                <div className="mt-auto flex justify-center space-x-2 pt-4 border-t">
                    {Array.from({ length: totalPages }, (_, i) => {
                        const pageNum = i + 1;
                        // nowe parametry
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('page', pageNum.toString());
                        if (query) params.set('query', query);

                        return (
                            <Link
                                key={pageNum}
                                href={`${pathname}?${params.toString()}`}
                                className={`px-3 py-1 border ${pageNum === currentPage
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-blue-500'
                                    } rounded`}
                            >
                                {pageNum}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}



