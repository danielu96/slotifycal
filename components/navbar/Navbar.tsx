import React from 'react'
function Navbar() {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 text-center shadow-md '>
            <div>LOGO</div>
            <div className='grid grid-cols-2'></div>
            <div >   menu      </div>
        </div>
    );
}
export default Navbar;