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
            <header className="App-header">
                <h2>Your Favourite Books</h2>
            </header>

            <div className="book-grid">
                {favouriteBooks.length === 0 ? (
                    <p>You have no favourite books yet.</p>
                ) : (
                    favouriteBooks.map((book, index) => (
                        <div key={index} className="book-card">
                            <img 
                                src={"https://via.placeholder.com/150"}  // Placeholder image if none available
                                alt={book.title || "No title"} 
                                className="book-image" 
                            />
                            <h2>{book.title || "No title available"}</h2>
                            <p><strong>Author:</strong> {book.author || "Unknown"}</p>
                            <p><strong>ISBN:</strong> {book.ISBN || "N/A"}</p>
                            <p><strong>Format:</strong> {book.format || "N/A"}</p>
                            <p><strong>Language:</strong> {book.language || "N/A"}</p>
                            <p><strong>Price:</strong> ${book.price || "N/A"}</p>
                            <p><strong>Publisher:</strong> {book.publisher || "Unknown"}</p>
                            <a 
                                href={book.url || "#"}  // Use the Url field if available
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="App-link">
                                View Details
                            </a>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Favourites;
