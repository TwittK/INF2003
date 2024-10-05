import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
    return (
        <nav className="navbar">
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/locations">Locations</Link>
                <Link to="/loans">Loans</Link>
                <Link to="/favourites">Favourites</Link>
                
                {/* Show Admin Loans link only if the user is an admin */}
                {user && user.userprivilege === 'ADMIN' && (
                    <Link to="/admin/loans">Admin Loans</Link>
                )}
            </div>
            
            <div className="auth-links">
                {user ? (
                    <>
                        <span>Welcome, {user.name}</span> {/* Display user's name */}
                        <button onClick={onLogout}>Logout</button> {/* Logout button */}
                    </>
                ) : (
                    <>
                        <Link to="/login">Log in</Link> {/* Display Login link when user is not logged in */}
                        <Link to="/register">Register</Link> {/* Display Register link when user is not logged in */}
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
