import React, { useState, useEffect } from 'react';

function AdminLoans({ user }) {
    const [loans, setLoans] = useState([]);

    // Fetch all loans from the backend
    useEffect(() => {
        if (user && user.userprivilege === 'ADMIN') {  // Ensure only admin can access
            fetch('http://localhost:5000/admin/loans')
                .then(response => response.json())
                .then(data => setLoans(data))
                .catch(error => console.error('Error fetching loans:', error));
        }
    }, [user]);

    return (
        <div>
            <h1>All Loans</h1>
            {loans.length === 0 ? (
                <p>No loans found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Loan ID</th>
                            <th>User</th>
                            <th>Book</th>
                            <th>Borrow Date</th>
                            <th>Due Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan, index) => (
                            <tr key={index}>
                                <td>{loan.loanID}</td>
                                <td>{loan.username}</td>
                                <td>{loan.booktitle}</td>
                                <td>{new Date(loan.borrowdate).toLocaleDateString()}</td>
                                <td>{new Date(loan.duedate).toLocaleDateString()}</td>
                                <td>{loan.loanstat}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminLoans;
