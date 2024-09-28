import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch('http://localhost:5000/')
            .then(response => response.json())
            .then(data => {
                console.log(data[0]);  // Log the first item to inspect its structure
                setData(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

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
                    <button>Search</button>
                </div>
            </header>

            <div className="book-grid">
                {filteredData.map((item, index) => (
                    <div key={index} className="book-card">
                        <img 
                            src={"https://via.placeholder.com/150"}  // No imageUrl field available in the data
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
        </div>
    );
}

export default App;
