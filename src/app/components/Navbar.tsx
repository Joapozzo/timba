import React from 'react'

const Navbar = () => {
    return (
        <nav
            className="flex items-center justify-center w-full py-7 font-bold text-2xl text-center"
            style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--foreground)',
            }}
        >
            Bienvenidos a Timba.
        </nav>
    );
};


export default Navbar