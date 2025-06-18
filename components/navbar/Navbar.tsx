import React from 'react'
import Logo from './Logo';
import DarkMode from './DarkMode';
import LinksDropdown from './LinksDropdown';
function Navbar() {
    return (
        <div className='navcontainer flex flex-col sm:flex-row  sm:justify-between sm:items-center flex-wrap gap-4 py-8 shadow-md '>
            <Logo />
            <div className='grid grid-cols-2'>
                <DarkMode />
                <div className='grid grid-cols-2'>menu
                    <LinksDropdown />
                </div>
            </div>
        </div>
    );
}
export default Navbar;