import React, { useState, useEffect } from 'react';
import './App.css';

function Favourites({ user }) {
    const [favouriteBooks, setFavouriteBooks] = useState([]);

    useEffect(() => {
        if (!user) {
            alert('You need to be logged in to view your favourites.');
            return;
        }
    
        // Fetch favourite books for the logged-in user
        fetch(`http://localhost:5000/favourites/${user.userID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setFavouriteBooks(data))
            .catch(error => console.error('Error fetching favourite books:', error));
    }, [user]);

    return (
        <div>
            <h2>Your Favourite Books</h2>
            {favouriteBooks.length === 0 ? (
                <p>You have no favourite books yet.</p>
            ) : (
                <ul>
                    {favouriteBooks.map(book => (
                        <li key={book.bookID}>
                            {book.title} by {book.author}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Favourites;
