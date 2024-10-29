import React, { useState, useEffect } from 'react';

function Loans({ user }) {
    const [loans, setLoans] = useState([]);
    const [loanHistory, setLoanHistory] = useState([]);

    // Fetch both current loans and loan history for the logged-in user
    useEffect(() => {
        if (user && user.userID) {
            fetch(`http://localhost:5000/loan_history/${user.userID}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Loan data:", data);
                    
                    // Separate current loans (on loan) and loan history (returned)
                    const currentLoans = data.filter(loan => loan.loanstat === 'on loan');
                    const historyLoans = data.filter(loan => loan.loanstat === 'returned');

                    setLoans(currentLoans);
                    setLoanHistory(historyLoans);
                })
                .catch(error => console.error('Error fetching loan data:', error));
        }
    }, [user]);

    // Function to format date into a readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC'
            });
        }
        return "Invalid Date";
    };

    // Function to format date and time into a readable format
    const formatDatetime = (dateString) => {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'Asia/Singapore',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
            });
        }
        return "Invalid Date";
    };

    // Function to return the loaned book
    const returnBook = (loanId, bookId) => {
        console.log("Returning book with the following details:", { loanId, bookId, userID: user.userID });

        fetch(`http://localhost:5000/return`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                loan_id: loanId,
                book_id: bookId,
                user_id: user.userID,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Book returned successfully!');
                // Remove the returned book from current loans
                setLoans(loans.filter(loan => loan._id !== loanId));
            } else {
                alert('Error returning book: ' + data.error);
            }
        })
        .catch(error => console.error('Error returning book:', error));
    };

    return (
        <div>
            <h1>Your Loans</h1>
            
            {/* Current Loans Section */}
            <h2>Current Loans</h2>
            {loans.length === 0 ? (
                <p>You have no active loans at the moment.</p>
            ) : (
                <div className="loan-list">
                    {loans.map((loan, index) => (
                        <div key={index} className="loan-card">
                            <h3>{loan.title}</h3>
                            <p><strong>Loan Date:</strong> {formatDate(loan.borrowdate)}</p>
                            <p><strong>Due Date:</strong> {formatDate(loan.duedate)}</p>
                            <p><strong>Status:</strong> {loan.loanstat}</p>
                            {/* Return Button */}
                            <button onClick={() => returnBook(loan._id, loan.bookID)}>
                                Return Book
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Loan History Section */}
            <h2>Loan History</h2>
            {loanHistory.length === 0 ? (
                <p>You have no loan history at the moment.</p>
            ) : (
                <div className="loan-history-list">
                    {loanHistory.map((loan, index) => (
                        <div key={index} className="loan-card">
                            <h3>{loan.title}</h3>
                            <p><strong>Loan Date:</strong> {formatDate(loan.borrowdate)}</p>
                            <p><strong>Due Date:</strong> {formatDate(loan.duedate)}</p>
                            <p><strong>Status:</strong> {loan.loanstat}</p>
                            {loan.loanstat === 'returned' && (
                                <p><strong>Return Date:</strong> {loan.returndate ? formatDatetime(loan.returndate) : "N/A"}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Loans;
