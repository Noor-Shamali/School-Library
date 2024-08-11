import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles.css';

const LendBook = () => {
    const [books, setBooks] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedBook, setSelectedBook] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const booksResponse = await axios.get('http://localhost:5000/api/books');
                setBooks(booksResponse.data);
            } catch (error) {
                setMessage('Failed to fetch books: ' + error.message);
            }
        };

        const fetchStudents = async () => {
            try {
                const studentsResponse = await axios.get('http://localhost:5000/api/students');
                setStudents(studentsResponse.data);
            } catch (error) {
                setMessage('Failed to fetch students: ' + error.message);
            }
        };

        fetchBooks();
        fetchStudents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(`Lending book ID ${selectedBook} to student ID ${selectedStudent}`);
            const response = await axios.post('http://localhost:5000/api/lend', {
                book_id: selectedBook,
                student_id: selectedStudent
            });
            console.log('Response from server:', response.data);
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error from server:', error.response ? error.response.data : error.message);
            setMessage('Failed to lend book: ' + (error.response ? error.response.data.error : error.message));
        }
    };

    return (
        <div>
            <h2>Lend a Book</h2>
            <form onSubmit={handleSubmit}>
                <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} required>
                    <option value="" disabled>Select a book</option>
                    {books.map((book) => (
                        <option key={book.id} value={book.id}>
                            {book.title}
                        </option>
                    ))}
                </select>
                <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
                    <option value="" disabled>Select a student</option>
                    {students.map((student) => (
                        <option key={student.id} value={student.id}>
                            {student.first_name} {student.last_name}
                        </option>
                    ))}
                </select>
                <button type="submit">Lend Book</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LendBook;
