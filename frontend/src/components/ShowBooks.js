import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShowBooks = () => {
    const [books, setBooks] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/books');
                setBooks(response.data);
            } catch (error) {
                setMessage('Failed to load books data: ' + error.message);
            }
        };
        fetchBooks();
    }, []);

    return (
        <div>
            <h2>All Books</h2>
            {message && <p className="message">{message}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category ID</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.category_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowBooks;
