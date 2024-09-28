import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Make sure it starts from 1
    const booksPerPage = 10; // Number of books per page

    // Fetch the data
    useEffect(() => {
        fetch('http://localhost:5000/')
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Filter the data based on search query
    const filteredData = data.filter(item => {
        const title = item.Title ? item.Title.toLowerCase() : "";
        const author = item.Author ? item.Author.toLowerCase() : "";
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
        <div className="App">
            <header className="App-header">
                <h1>Bookstore</h1>
                <div className="search-bar">
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
                            alt={item.Title || "No title"} 
                            className="book-image" 
                        />
                        <h2>{item.Title || "No title available"}</h2>
                        <p><strong>Author:</strong> {item.Author || "Unknown"}</p>
                        <p><strong>ISBN:</strong> {item.ISBN || "N/A"}</p>
                        <p><strong>Format:</strong> {item.Format || "N/A"}</p>
                        <p><strong>Language:</strong> {item.Language || "N/A"}</p>
                        <p><strong>Price:</strong> ${item.Price || "N/A"}</p>
                        <p><strong>Publisher:</strong> {item.Publisher || "Unknown"}</p>
                        <a 
                            href={item.Url || "#"}  // Use the Url field if available
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

function Pagination({ booksPerPage, totalBooks, paginate, currentPage }) {
    const pageNumbers = [];

    // Ensure pagination starts from 1
    for (let i = 1; i <= Math.ceil(totalBooks / booksPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="pagination">
            <ul className="pagination-list">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <a 
                            onClick={() => paginate(number)} 
                            href="!#" 
                            className={`page-link ${number === currentPage ? 'active' : ''}`}
                        >
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default App;
