// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Books from './Books'; 
import Locations from './Locations';
import Favourites from './Favourites';  
import Login from './Login'; 
import Register from './Register'; 
import AdminLoans from './AdminLoans';
import Loans from './Loans';   
import BookReviews from './bookreviews';
import './App.css';

function App() {
    // Initialize user from localStorage, or null if not found
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Sync user state with localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Logout function to clear the user state
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Also remove from localStorage
    };

    return (
        <Router>
            <div className="App">
                <Navbar user={user} onLogout={handleLogout} />
                <Routes>
                    {/* Always show the Books page as the default ("/") */}
                    <Route path="/" element={<Books user={user} />} />
                    
                    {/* Favourites route: Only accessible if the user is logged in */}
                    <Route path="/favourites" element={user ? <Favourites user={user} /> : <Navigate to="/login" />} />

                    {/* Locations route */}
                    <Route path="/locations" element={<Locations />} />

                    {/* Loans route: Only accessible if the user is logged in */}
                    <Route path="/loans" element={user ? <Loans user={user} /> : <Navigate to="/login" />} />

                    {/* Login route: Pass setUser to store logged-in user info */}
                    <Route path="/login" element={<Login setUser={setUser} />} />

                    {/* Register route */}
                    <Route path="/register" element={<Register />} />

                    {/* BookReviews route: Pass user to BookReviews */}
                    <Route path="/reviews/:bookId" element={<BookReviews user={user} />} />

                    {/* Admin route: Accessible only to admins */}
                    <Route path="/admin/loans" element={user && user.userprivilege === 'ADMIN' ? <AdminLoans user={user} /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
