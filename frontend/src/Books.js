import React, { useState, useEffect } from 'react';
import './App.css';

function Books({ user }) {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;

    // Fetch books from backend
    useEffect(() => {
        fetch('http://localhost:5000/books')
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => console.error('Error fetching books:', error));
        console.log("Logged-in user:", user);  // Check if user is being passed correctly
    }, [user]);

    // Filter the data based on search query
    const filteredData = books.filter(item => {
        const title = item.title ? item.title.toLowerCase() : "";
        const author = item.author ? item.author.toLowerCase() : "";
        const ISBN = item.ISBN ? item.ISBN : "";

        return (
            title.includes(searchQuery.toLowerCase()) || 
            author.includes(searchQuery.toLowerCase()) || 
            ISBN.includes(searchQuery)
        );
    });

    // Add to favourites function
    const addToFavourites = (bookId) => {
        if (!user || !user.userID) {
            alert('You need to be logged in to add favourites.');
            return;
        }

        fetch('http://localhost:5000/favourite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                book_id: bookId,
                user_id: user.userID,  // Ensure userID exists
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Book added to favourites!');
            } else {
                alert('Error adding book to favourites: ' + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    };

    // Pagination logic: Calculate the books to display based on the current page
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredData.slice(indexOfFirstBook, indexOfLastBook);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <header className="App-header">
                <h1>Bookstore</h1>
                <div className="header-content">
                    Enjoy exploring our vast collection of books!
                </div>
                <div className="search-bar-center">
                    <input
                        type="text"
                        placeholder="Search by Title, Author, or ISBN"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <div className="book-grid">
                {currentBooks.map((item, index) => (
                    <div key={index} className="book-card">
                        <img 
                            src={"https://via.placeholder.com/150"}  // Placeholder image if none available
                            alt={item.title || "No title"} 
                            className="book-image" 
                        />
                        <h2>{item.title || "No title available"}</h2>
                        <p><strong>Author:</strong> {item.author || "Unknown"}</p>
                        <p><strong>ISBN:</strong> {item.ISBN || "N/A"}</p>
                        <p><strong>Format:</strong> {item.format || "N/A"}</p>
                        <p><strong>Language:</strong> {item.language || "N/A"}</p>
                        <p><strong>Price:</strong> ${item.price || "N/A"}</p>
                        <p><strong>Publisher:</strong> {item.publisher || "Unknown"}</p>
                        <a 
                            href={item.url || "#"}  // Use the Url field if available
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="App-link">
                            View Details
                        </a>
                        {/* Add to Favourites Button */}
                        <button onClick={() => addToFavourites(item.bookID)}>
                            Add to Favourites
                        </button>
                    </div>
                ))}
            </div>

            <Pagination
                booksPerPage={booksPerPage}
                totalBooks={filteredData.length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </div>
    );
}

// Pagination Component
function Pagination({ booksPerPage, totalBooks, paginate, currentPage }) {
    const pageNumbers = [];
    const maxPageNumbersToShow = 10;
    const totalPageCount = Math.ceil(totalBooks / booksPerPage);

    for (let i = 1; i <= totalPageCount; i++) {
        pageNumbers.push(i);
    }

    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    const endPage = Math.min(totalPageCount, startPage + maxPageNumbersToShow - 1);

    const visiblePages = pageNumbers.slice(startPage - 1, endPage);

    const handlePrevious = () => {
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPageCount) {
            paginate(currentPage + 1);
        }
    };

    return (
        <nav className="pagination">
            <ul className="pagination-list">
                <li className="page-item">
                    <a
                        onClick={handlePrevious}
                        href="#!"
                        className="page-link"
                        style={{ visibility: currentPage === 1 ? 'hidden' : 'visible' }}
                    >
                        Previous
                    </a>
                </li>
                {visiblePages.map(number => (
                    <li key={number} className="page-item">
                        <a
                            onClick={() => paginate(number)}
                            href="#!"
                            className={`page-link ${number === currentPage ? 'active' : ''}`}
                        >
                            {number}
                        </a>
                    </li>
                ))}
                <li className="page-item">
                    <a
                        onClick={handleNext}
                        href="#!"
                        className="page-link"
                        style={{ visibility: currentPage === totalPageCount ? 'hidden' : 'visible' }}
                    >
                        Next
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Books;
