import React, { useState, useEffect } from 'react';

function Loans({ user }) {
    const [loans, setLoans] = useState([]);

    // Fetch the loans for the logged-in user
    useEffect(() => {
        if (user && user.userID) {
            fetch(`http://localhost:5000/loans/${user.userID}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Loans data:", data);  // Log the entire data returned from the backend
                    setLoans(data);
                })
                .catch(error => console.error('Error fetching loans:', error));
        }
    }, [user]);

    // Function to format date into a readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const returnBook = (loanId, bookId) => {
        console.log("Returning book with the following details:");
        console.log("Loan ID:", loanId);  // Ensure this is not undefined
        console.log("Book ID:", bookId);
        console.log("User ID:", user.userID);
    
        fetch(`http://localhost:5000/return`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                loan_id: loanId,  // Ensure loanId is passed correctly
                book_id: bookId,  // Ensure bookId is passed correctly
                user_id: user.userID,  // Ensure userId is passed correctly
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Book returned successfully!');
                // Refresh loans after returning the book
                setLoans(loans.filter(loan => loan.loanID !== loanId));
            } else {
                alert('Error returning book: ' + data.error);
            }
        })
        .catch(error => console.error('Error returning book:', error));
    };
    
    

    return (
        <div>
            <h1>Your Loans</h1>
            {loans.length === 0 ? (
                <p>You have no loans at the moment.</p>
            ) : (
                <div className="loan-list">
                    {loans.map((loan, index) => {
                        console.log("Loan object:", loan); // Log the individual loan object
                        return (
                            <div key={index} className="loan-card">
                                <h3>{loan.title}</h3>
                                <p><strong>Loan Date:</strong> {formatDate(loan.borrowdate)}</p>
                                <p><strong>Due Date:</strong> {formatDate(loan.duedate)}</p>
                                <p><strong>Status:</strong> {loan.loanstat}</p>
                                {/* Return Button */}
                                <button onClick={() => {
                                    console.log("Loan ID being passed:", loan.loanID);  // Log loanID here
                                    console.log("Book ID being passed:", loan.bookID);  // Log bookID here
                                    returnBook(loan.loanID, loan.bookID);  // Ensure loan.loanID is passed correctly
                                }}>
                                    Return Book
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Loans;
