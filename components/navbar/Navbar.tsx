import React from 'react'
import Logo from './Logo';
function Navbar() {
    return (
        <div className='navcontainer flex flex-col sm:flex-row  sm:justify-between sm:items-center flex-wrap gap-4 py-8 shadow-md '>
            <Logo />
            <div className='grid grid-cols-2'></div>
            <div >   menu      </div>
        </div>
    );
}
export default Navbar;