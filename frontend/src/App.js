import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Books from './Books'; 
import Locations from './Locations';
import Favourites from './Favourites';  
import Login from './Login'; 
import Register from './Register'; 
import './App.css';

function App() {
    const [user, setUser] = useState(null);  // State to track the logged-in user

    // Logout function to clear the user state
    const handleLogout = () => {
        setUser(null);
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

                    {/* Login route: Pass setUser to store logged-in user info */}
                    <Route path="/login" element={<Login setUser={setUser} />} />

                    {/* Register route */}
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
