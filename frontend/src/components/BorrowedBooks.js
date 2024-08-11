import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles.css';

const BorrowedBooks = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/borrowed');
                setBorrowedBooks(response.data);
            } catch (error) {
                setMessage('Failed to load borrowed books: ' + error.message);
            }
        };
        fetchBorrowedBooks();
    }, []);

    const checkWarning = (dueDate) => {
        const currentDate = new Date();
        const due = new Date(dueDate);
        return currentDate > due ? 'Overdue' : 'On time';
    };

    return (
        <div>
            <h2>Borrowed Books</h2>
            {message && <p>{message}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Student</th>
                        <th>Borrow Date</th>
                        <th>Due Date</th>
                        <th>Warning</th>
                    </tr>
                </thead>
                <tbody>
                    {borrowedBooks.map((borrowedBook, index) => (
                        <tr key={index}>
                            <td>{borrowedBook.title}</td>
                            <td>{borrowedBook.first_name} {borrowedBook.last_name}</td>
                            <td>{new Date(borrowedBook.borrow_date).toLocaleDateString()}</td>
                            <td>{new Date(borrowedBook.due_date).toLocaleDateString()}</td>
                            <td>{checkWarning(borrowedBook.due_date)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BorrowedBooks;
