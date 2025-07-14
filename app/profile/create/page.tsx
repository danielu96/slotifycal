'use client';
import { useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function CreateProfilePage() {
    const { isSignedIn } = useUser();
    const router = useRouter();

    // Po zalogowaniu przekieruj na stronę główną
    useEffect(() => {
        if (isSignedIn) {
            router.replace('/');
        }
    }, [isSignedIn, router]);

    return (
        <div className='flex flex-col items-center justify-center mt-20 gap-6'>
            <h1 className='text-2xl'>Please log in to continue</h1>
            <SignInButton mode='modal'>
                <button className="w-max border-2 p-3 rounded-xl bg-white hover:bg-sky-600 text-black hover:text-white">
                    Login
                </button>
            </SignInButton>
        </div>
    );
}
