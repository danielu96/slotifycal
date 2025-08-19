'use server';
import { Prisma } from '@prisma/client';
import db from './db';
import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { validateWithZodSchema, imageSchema, profileSchema } from './schemas';
import { uploadImage } from './supabase';
import type { Reservation } from './types';
import { dayNames, monthNames, isValidDateString, parseDateFromQuery } from '@/utils/dateHelpers';


export const fetchProfileImage = async () => {
    const user = await currentUser();
    if (!user) return null;

    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id,
        },
        select: {
            profileImage: true,
        },
    });
    return profile?.profileImage;
};

const getAuthUser = async () => {
    const user = await currentUser();
    if (!user) {
        redirect('/profile/create');
    }
    if (!user.privateMetadata.hasProfile) {
        redirect('/profile/create');
    }
    return user;
};

export const fetchProfile = async () => {
    const user = await getAuthUser();

    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id,
        },
    });
    if (!profile) return redirect('/profile/create');
    return profile;
};
const renderError = (error: unknown): { message: string } => {
    console.log(error);
    return {
        message: error instanceof Error ? error.message : 'An error occurred',
    };
};
export const updateProfileAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();
    try {
        const rawData = Object.fromEntries(formData);
        const validatedFields = validateWithZodSchema(profileSchema, rawData);

        await db.profile.update({
            where: {
                clerkId: user.id,
            },
            data: validatedFields,
        });
        revalidatePath('/profile');
        return { message: 'Profile updated successfully' };
    } catch (error) {
        return renderError(error);
    }
};


export const updateProfileImageAction = async (
    prevState: any,
    formData: FormData
) => {
    const user = await getAuthUser();
    try {
        const image = formData.get('image') as File;
        const validatedFields = validateWithZodSchema(imageSchema, { image });
        const fullPath = await uploadImage(validatedFields.image);

        await db.profile.update({
            where: {
                clerkId: user.id,
            },
            data: {
                profileImage: fullPath,
            },
        });
        revalidatePath('/profile');
        return { message: 'Profile image updated successfully' };
    } catch (error) {
        return renderError(error);
    }
};
export const createDateReservation = async ({
    date,  // "YYYY-MM-DD"
    time,
}: {
    date: string;
    time: string;
}): Promise<Reservation> => {
    const user = await getAuthUser();
    if (!user) throw new Error("Brak zalogowanego użytkownika");

    // rozbijamy string → liczby
    const [year, month, day] = date.split("-").map(Number);

    // 1️⃣ TWORZYMY LOKALNĄ PÓŁNOC
    //    new Date(year,monthIndex,day) = lokalne 00:00:00
    const reservationDate = new Date(year, month - 1, day);

    console.log("→ front wybrał:", date);
    console.log("→ lokalne midnight:", reservationDate.toString());
    // powinno być np. "Thu Jul 31 2025 00:00:00 GMT+0200"

    const reservation = await db.reservation.create({
        data: {
            date: reservationDate,
            time,
            profileId: user.id,
        },
    });

    console.log("💾 zapisane w DB:", reservation.date.toISOString());


    return reservation;
};
export interface FetchReservationsProps {
    query?: string;
    page?: number;
    perPage?: number;
}
export const fetchReservations = async ({
    query,
    page = 1,
    perPage = 5,
}: {
    query?: string;
    page?: number;
    perPage?: number;
}) => {
    const user = await getAuthUser();

    const where: Prisma.ReservationWhereInput = {
        profileId: user.id,
    };

    const filters: Prisma.ReservationWhereInput[] = [];

    const safeQuery = query?.trim().toLowerCase();

    if (safeQuery) {
        filters.push({ time: { contains: safeQuery, mode: 'insensitive' } });

        // if (isValidDateString(safeQuery)) {
        //     filters.push({ date: { equals: new Date(safeQuery) } });
        // }
        const parsedDate = parseDateFromQuery(safeQuery);
        if (parsedDate) {
            filters.push({ date: { equals: parsedDate } });
        }


        filters.push({ profile: { firstName: { contains: safeQuery, mode: 'insensitive' } } });
        filters.push({ profile: { lastName: { contains: safeQuery, mode: 'insensitive' } } });

        where.OR = filters;
    }

    const skip = (page - 1) * perPage;

    const [reservations, totalCount] = await Promise.all([
        db.reservation.findMany({
            where,
            select: {
                id: true,
                date: true,
                time: true,
                profile: { select: { firstName: true, lastName: true } },
            },
            orderBy: { date: 'desc' },
            skip,
            take: perPage,
        }),
        db.reservation.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / perPage);

    return { reservations, totalCount, totalPages };
};




export const fetchAllReservations = async () => {
    return db.reservation.findMany({

        select: {
            id: true,
            profileId: true,
            createdAt: true,
            updatedAt: true,
            date: true,
            time: true,
            profile: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { date: "desc" },
    });
};
export async function fetchTests() {
    const base = process.env.NEXT_PUBLIC_NEST_URL ?? 'http://localhost:4000';
    const res = await fetch(`${base}/reservations`, {
        cache: 'no-store',
    });

    // Najpierw parsujemy odpowiedź
    const json = await res.json();

    // Rzucamy błąd, jeśli coś poszło nie tak
    if (!res.ok) {
        throw new Error(json.message ?? 'Błąd pobierania rezerwacji z NestJS');
    }

    // Zalogowanie komunikatu z NestJS po stronie serwera
    console.log('Next.js (server):', json.message);

    // Zwracamy dane do komponentu
    return json.data;
}


export const deleteReservationAction = async (prevState: { reservationId: string }) => {
    const { reservationId } = prevState;
    const user = await getAuthUser();

    try {
        const result = await db.reservation.delete({
            where: {
                id: reservationId,
                profileId: user.id,
            },
        });
        revalidatePath('/reservations');
        console.log('Reservation deletedededed');
        return { message: 'Reservation deleted successfully Nextjs' }
    } catch (error) {
        return { message: "Wystąpił błąd podczas usuwania" };
        // return renderError(error);
    }
};

export const deleteReservationAct = async ({
    reservationId,
}: {
    reservationId: string;
}) => {
    const base = process.env.NEST_API_URL ?? 'http://localhost:4000';

    // 1. Wyślij żądanie do NestJS
    const res = await fetch(`${base}/reservations/${reservationId}`, {
        method: 'DELETE',
        // jeśli korzystasz z ciasteczek do autoryzacji:
        // credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${yourJwtToken}`,
        },
        cache: 'no-store',
    });

    // 2. Odczytaj odpowiedź (zawsze parsuj JSON zanim sprawdzisz status)
    const data = await res.json();

    // 3. Obsłuż błąd z NestJS
    if (!res.ok) {
        // data.message pochodzi z kontrolera NestJS
        throw new Error(data.message ?? 'Błąd usuwania z NestJS');
    }

    // 4. Zadbaj o odświeżenie podstrony /reservations
    revalidatePath('/reservations');

    // 5. Zwrotka do frontendu (zwrócony obiekt z NestJS)
    return data; // np. { message: 'Usunięto pomyślnie' }
};
export async function fetchSearchResults({
    query,
    date,
    time,
}: {
    query?: string;
    date?: string;  // format YYYY-MM-DD
    time?: string;  // format HH:mm
}): Promise<Reservation[]> {
    // 1. Zbuduj parametry zapytania
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (date) params.set('date', date);
    if (time) params.set('time', time);

    // 2. Wyślij request
    const url = `${process.env.NEXT_PUBLIC_NEST_URL}/reservations/search?${params.toString()}`;
    console.log('🔗 Fetching URL:', url);
    const res = await fetch(url);
    console.log('📡 Response status:', res.status, res.statusText);
    if (!res.ok) throw new Error('Failed to fetch search results');

    // 3. Parsowanie odpowiedzi
    const raw: any[] = await res.json();
    return raw.map(item => ({
        id: item.id,
        profileId: item.profileId,
        createdAt: typeof item.createdAt === 'string'
            ? item.createdAt
            : item.createdAt.toISOString(),
        updatedAt: typeof item.updatedAt === 'string'
            ? item.updatedAt
            : item.updatedAt.toISOString(),
        date: typeof item.date === 'string'
            ? item.date
            : item.date.toISOString(),
        time: item.time,
        profile: {
            id: item.profile.id,
            firstName: item.profile.firstName,
            lastName: item.profile.lastName,
        },
    }));
}