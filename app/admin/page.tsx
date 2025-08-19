'use client';

import React, { useState } from 'react';
import { fetchSearchResults } from '@/utils/actions';

type Profile = {
    id: string;
    firstName: string;
    lastName: string;
};

type Reservation = {
    id: string;
    profileId: string;
    createdAt: string;
    updatedAt: string;
    date: string;
    time: string;
    profile: Profile;
};

export default function ReservationsAdminPage() {
    const [query, setQuery] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [results, setResults] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await fetchSearchResults({ query, date, time });
            console.log('Search results:', data);
            // Map data to include a dummy profile if missing
            const mappedResults: Reservation[] = data.map((item: any) => ({
                ...item,
                profile: item.profile ?? {
                    id: item.profileId ?? '',
                    firstName: 'Unknown',
                    lastName: 'Unknown',
                },
                createdAt: typeof item.createdAt === 'string' ? item.createdAt : item.createdAt?.toISOString() ?? '',
                updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : item.updatedAt?.toISOString() ?? '',
                date: typeof item.date === 'string' ? item.date : item.date?.toISOString() ?? '',
            }));
            setResults(mappedResults);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>Search Reservations</h1>
            <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search by first name...'
                className='border p-2 mb-4 w-full'
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2"
            />

            <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border p-2"
            />
            <button
                onClick={handleSearch}
                className='bg-blue-500 text-white px-4 py-2 rounded mb-4'
            >
                Search
            </button>

            {loading && <p>Loading...</p>}
            <p className='mt-4'>Found {results.length} reservations.</p>

            {results.map((r) => (
                <div key={r.id} className='border p-2 my-2'>
                    <p>
                        <strong>
                            {r.profile.firstName} {r.profile.lastName}
                        </strong>
                    </p>
                    <p>Time: {r.time}</p>
                    <p>Date: {new Date(r.date).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
}
