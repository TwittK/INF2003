import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/locations">Locations</Link></li>
                <li><Link to="/loans">Loans</Link></li>
                <li><Link to="/favourites">Favourites</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
