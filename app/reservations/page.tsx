import ReservationsTable from '@/components/reservations/ReservationsTable';
import Search from '@/components/ui/search';
import { fetchReservations } from '@/utils/actions';

export default async function ReservationsPage({
    searchParams,
}: {
    searchParams?: Promise<{ query?: string; page?: string }>;
}) {
    const params = await searchParams;
    const query = params?.query ?? '';
    const currentPage = parseInt(params?.page ?? '1', 5);

    const { reservations, totalPages, totalCount } = await fetchReservations({
        query,
        page: currentPage,
        perPage: 5,
    });


    return (
        <div className="p-8">
            <Search placeholder="Search reservations..." />
            <h1 className="text-2xl font-bold mb-4 mt-4">Your Reservations</h1>
            <ReservationsTable
                reservations={reservations}
                totalPages={totalPages}
                totalCount={totalCount}
                currentPage={currentPage}
                query={query}
            />
        </div>
    );
}


