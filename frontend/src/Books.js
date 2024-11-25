import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './Books.css';

function Books({ user }) {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFormat, setSelectedFormat] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const booksPerPage = 10;
    const navigate = useNavigate();

    // Fetch books from backend with pagination
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const queryParams = new URLSearchParams({
                    search: searchQuery || '',
                    format: selectedFormat || '',
                    language: selectedLanguage || '',
                    available: onlyAvailable ? 'true' : 'false',
                    page: currentPage,
                    limit: booksPerPage,
                });
    
                const response = await fetch(`http://localhost:5000/books?${queryParams.toString()}`);
                const data = await response.json();
    
                // Ensure data is an array before setting it
                if (Array.isArray(data)) {
                    setBooks(data);
                } else {
                    console.error('Expected an array, got:', data);
                    setBooks([]);
                }
            } catch (error) {
                console.error('Error fetching books:', error);
                setBooks([]); // Set an empty array on error
            }
        };
    
        fetchBooks();
    }, [searchQuery, selectedFormat, selectedLanguage, onlyAvailable, currentPage]);
    

    // Navigate to the BookReviews page
    const viewReviews = (bookId) => {
        navigate(`/reviews/${bookId}`);
    };

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

    // Loan book function
    const loanBook = (bookId) => {
        if (!user || !user.userID) {
            alert('You need to be logged in to loan books.');
            return;
        }

        fetch('http://localhost:5000/loan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                book_id: bookId,
                user_id: user.userID,  // Ensure userID exists and is passed correctly
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Book loaned successfully!');
            } else {
                alert('Error loaning book: ' + data.error);
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
                <div className="text-section">
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
                    {/* Filter UI */}
                    <div className="filters">
                        <div className="filter-row">
                            <div className="filter-item">
                                <label>Format:</label>
                                <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
                                    <option value="">All</option>
                                    <option value="Paperback">Paperback</option>
                                    <option value="Hardcover">Hardcover</option>
                                    <option value="eBook">eBook</option>
                                </select>
                            </div>

                            <div className="filter-item">
                                <label>Language:</label>
                                <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                                    <option value="">All</option>
                                    <option value="English">English</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                </select>
                            </div>
                        </div>

                        <div className="filter-row">
                            <div className="filter-checkbox">
                                <label>Only Show Available Books:</label>
                                <input
                                    type="checkbox"
                                    checked={onlyAvailable}
                                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="image-section">
                    <img src="book.jpg" alt="Books" className="banner-image" />
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

                        {/* Availability Section */}
                        {user && user.userprivilege === 'ADMIN' ? (
                            <p><strong>Available:</strong> 
                                {item.available > 0 ? (
                                    <span>{item.available} Available</span>
                                ) : (
                                    <span style={{ color: 'red' }}>Not Available</span>
                                )}
                            </p>
                        ) : (
                            <p><strong>Available:</strong> 
                                {item.available > 0 ? (
                                    <span>Available</span>
                                ) : (
                                    <span style={{ color: 'red' }}>Not Available</span>
                                )}
                            </p>
                        )}
                    <div className='button-group'>
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
                        {/* Loan Button */}
                        <button 
                            onClick={() => loanBook(item.bookID)} 
                            disabled={item.available <= 0}
                        >
                            Loan Book
                        </button>
                        <button 
                            onClick={() => viewReviews(item.bookID)} 
                            disabled={item.available <= 0}
                        >
                            View Reviews
                        </button>
                    </div>
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
    const totalPageCount = Math.ceil(totalBooks / booksPerPage);
    const maxPageNumbersToShow = 5; // Number of page numbers to display around the current page
    const pageNumbers = [];

    // Calculate the range of visible pages
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    const endPage = Math.min(totalPageCount, startPage + maxPageNumbersToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

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
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className="page-link"
                    >
                        Previous
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <button
                            onClick={() => paginate(number)}
                            className={`page-link ${number === currentPage ? 'active' : ''}`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
                <li className="page-item">
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPageCount}
                        className="page-link"
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Books;

