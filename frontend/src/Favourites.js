// Favourites.js
import React, { useState, useEffect } from 'react';
import './App.css';

function Favourites({ user }) {
    const [favouriteBooks, setFavouriteBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !user.userID) {
            setError('You need to be logged in to view your favourites.');
            return;
        }

        // Fetch favourite books for the logged-in user
        const userId = user.userID;  // Use the numeric userID
        console.log("Fetching favourites for User ID:", userId);
        
        fetch(`http://localhost:5000/favourites/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setFavouriteBooks(data);
                setError(null); // Clear any previous errors
            })
            .catch(error => {
                console.error('Error fetching favourite books:', error);
                setError('Failed to load favourite books. Please try again later.');
            });
    }, [user]);

    return (
        <div>
            <h2>Your Favourite Books</h2>
            {error ? (
                <p>{error}</p>
            ) : favouriteBooks.length === 0 ? (
                <p>You have no favourite books yet.</p>
            ) : (
                <ul>
                    {favouriteBooks.map(favourite => (
                        <li key={favourite._id}>
                            {favourite.book?.title || 'Unknown Title'} by {favourite.book?.author || 'Unknown Author'}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Favourites;
