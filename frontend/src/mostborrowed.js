import React, { useState, useEffect } from 'react';
import './AdminLoans.css';

function MostBorrowed({ user }) {
    const [books, setBooks] = useState([]);

    // Fetch the most borrowed books data from the backend
    useEffect(() => {
        if (user && user.userprivilege === 'ADMIN') { // Ensure only admin can access
            fetch('http://localhost:5000/admin/most_borrowed')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setBooks(data.data);
                    } else {
                        console.error('Error fetching most borrowed books:', data.error);
                    }
                })
                .catch(error => console.error('Error fetching most borrowed books:', error));
        }
    }, [user]);

    return (
        <div>
            <h1>Top 10 Most Borrowed Books</h1>
            {books.length === 0 ? (
                <p>No data available.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>ISBN</th>
                            <th>Times Borrowed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{book.title || "Unknown"}</td>
                                <td>{book.author || "Unknown"}</td>
                                <td>{book.ISBN || "N/A"}</td>
                                <td>{book.borrow_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MostBorrowed;
