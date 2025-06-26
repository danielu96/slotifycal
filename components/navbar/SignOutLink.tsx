'use client';

import { SignOutButton } from '@clerk/nextjs';
import { useToast } from '@/components/hooks/use-toast'; // Adjust the import path as necessary

function SignOutLink() {
    const { toast } = useToast();
    const handleLogout = () => {
        toast({ description: 'You have been signed out.' });
    };
    return (
        <SignOutButton redirectUrl='/'>
            <button className='w-full text-left' onClick={handleLogout}>
                Logout
            </button>
        </SignOutButton>
    );
}
export default SignOutLink;