import React, { useState } from 'react';
import axios from 'axios';

const AddBook = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/books', {
                title,
                author,
                category_id: categoryId
            });
            setMessage('Book added successfully!');
        } catch (error) {
            setMessage('Failed to add book: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Add a New Book</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                />
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author"
                />
                <input
                    type="text"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    placeholder="Category ID"
                    required
                />
                <button type="submit">Add Book</button>
            </form>
            {message && <p className={message.includes('failed') ? 'error' : 'message'}>{message}</p>}
        </div>
    );
};

export default AddBook;
