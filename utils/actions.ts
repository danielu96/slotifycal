'use server';
import db from './db';
import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { validateWithZodSchema, imageSchema, profileSchema } from './schemas';
import { uploadImage } from './supabase';
import type { Reservation } from '@prisma/client';

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

    // 1. Rozbijamy string na liczby
    const [year, month, day] = date.split("-").map(Number);

    // 2. Tworzymy lokalną datę (monthIndex = month - 1)
    const reservationDate = new Date(year, month - 1, day);

    const reservation = await db.reservation.create({
        data: {
            date: reservationDate,
            time,
            profileId: user.id,
        },
    });

    return reservation;
};
export const fetchReservations = async () => {
    const user = await getAuthUser();
    const reservations = await db.reservation.findMany({
        where: {
            profileId: user.id,
        },

        select: {
            id: true,
            profileId: true,
            createdAt: true,
            updatedAt: true,
            date: true,
            time: true,
            profile: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
        orderBy: {
            date: "desc",
        },
    });

    return reservations;
};


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
        return { message: 'Reservation deleted successfully ok' }
    } catch (error) {
        return { message: "Wystąpił błąd podczas usuwania" };
        // return renderError(error);
    }
};