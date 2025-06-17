'use client'
export default Logo
import Link from 'next/link';
import { Button } from '../ui/button';
import { Gi3dHammer } from "react-icons/gi";
function Logo() {
    return (
        <Button className='min-w-max p-3 gap-2 ' size='icon' asChild>
            <Link className='flex' href='/'>
                <Gi3dHammer className='size-5' />
                <span>SlotifyCal</span>
            </Link>

        </Button>
    );
}