import React from 'react'
import Logo from './Logo';
import DarkMode from './DarkMode';
import LinksDropdown from './LinksDropdown';
function Navbar() {
    return (
        <>
            <nav className=' mx-0 px-2 top-0 z-50  transition-colors hover:text-foreground/80 text-foreground/55 shadow-md'>
                <div className='navcontainer flex gap-4 py-3 justify-between '>
                    <Logo />
                    <div className='flex gap-2'>
                        <DarkMode />
                        <LinksDropdown />
                    </div>
                </div>
            </nav>

        </>
    );
}
export default Navbar;