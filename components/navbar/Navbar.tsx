import React from 'react'
import Logo from './Logo';
import DarkMode from './DarkMode';
import LinksDropdown from './LinksDropdown';
function Navbar() {
    return (
        <>
            <div className='w-full shadow-md '>
                <div className='navcontainer flex sm-flex-col sm:flex-row justify-between  sm:items-center flex-wrap gap-4 py-8 '>
                    <Logo />
                    <div className='grid grid-cols-2  justify-items-start '>
                        <DarkMode />
                        <LinksDropdown />
                    </div>
                </div>
            </div>
        </>
    );
}
export default Navbar;