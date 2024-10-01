import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/locations">Locations</Link>
                <Link to="/loans">Loans</Link>
                <Link to="/favourites">Favourites</Link>
            </div>
            <div className="auth-links">
                <Link to="/login">Log in</Link>
                <Link to="/register">Register</Link>
            </div>
        </nav>
    );
}

export default Navbar;
