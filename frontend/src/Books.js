import React, { useEffect, useState } from 'react';
import './App.css';

function Books() {
    const [books, setBooks] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Make sure it starts from 1
    const booksPerPage = 10; // Number of books per page

    // Fetch books
    useEffect(() => {
        fetch('http://localhost:5000/books')
            .then(response => response.json())
            .then(data => {setBooks(data);})
            .catch(error => console.error('Error fetching books:', error));
    }, []);

    // Filter the data based on search query
    const filteredData = books.filter(item => {
        const title = item.title ? item.title.toLowerCase() : "";
        const author = item.author ? item.author.toLowerCase() : "";
        const ISBN = item.ISBN ? item.ISBN : "";

        return (
            title.includes(searchQuery.toLowerCase()) || // Search by title
            author.includes(searchQuery.toLowerCase()) || // Search by author
            ISBN.includes(searchQuery) // Search by ISBN
        );
    });

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
    const maxPageNumbersToShow = 10; // Maximum number of page numbers to show
    const totalPageCount = Math.ceil(totalBooks / booksPerPage);

    // Ensure pagination starts from 1
    for (let i = 1; i <= totalPageCount; i++) {
        pageNumbers.push(i);
    }

    // Calculate the range of page numbers to display
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
                        style={{ visibility: currentPage === 1 ? 'hidden' : 'visible' }} // Hide if on first page
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
                        style={{ visibility: currentPage === totalPageCount ? 'hidden' : 'visible' }} // Hide if on last page
                    >
                        Next
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Books;