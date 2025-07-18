'use client';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

type btnSize = 'default' | 'lg' | 'sm';

export type SubmitButtonProps = {
    className?: string;
    text?: string;
    size?: btnSize;
    isPending?: boolean;      // ← already in your TS type
};

export function SubmitButton({
    className = '',
    text = 'submit',
    size = 'lg',
    isPending,                // ← pull this in
}: SubmitButtonProps) {
    const { pending: hookPending } = useFormStatus();

    // use the override if present; otherwise fall back to hook
    const loading = isPending ?? hookPending;

    return (
        <Button
            type="submit"
            disabled={loading}
            className={`capitalize bg-amber-900 ${className}`}
            size={size}
        >
            {loading ? (
                <>

                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin  " />

                    {/* <ReloadIcon className="mr-2 h-4 w-4 animate-spin hover:drop-shadow-md" /> */}
                    Please wait o ...
                </>
            ) : (
                text
            )}
        </Button>





    );
}
