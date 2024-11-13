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

        const fetchFavourites = async () => {
            const userId = user.userID;
            try {
                const response = await fetch(`http://localhost:5000/favourites/${userId}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setFavouriteBooks(data);
                setError(null); // Clear any previous errors
            } catch (error) {
                console.error('Error fetching favourite books:', error);
                setError('Failed to load favourite books. Please try again later.');
            }
        };

        fetchFavourites();
    }, [user]);

    // Function to remove a book from favourites
    const removeFavourite = async (bookId) => {
        try {
            const response = await fetch('http://localhost:5000/favourite/remove', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.userID, book_id: bookId }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Book removed from favourites!');
                setFavouriteBooks(favouriteBooks.filter(fav => fav.bookID !== bookId));
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error('Error removing favourite:', error);
            alert('Failed to remove favourite. Please try again later.');
        }
    };

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
                            <button onClick={() => removeFavourite(favourite.bookID)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Favourites;
