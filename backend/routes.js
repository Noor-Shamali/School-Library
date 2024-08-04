const express = require('express');
const db = require('./db');
const nodemailer = require('nodemailer');
const router = express.Router();

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'your-email@gmail.com', // your Gmail address
        pass: 'your-email-password'   // your Gmail password
    }
});

// Add a category
router.post('/categories', async (req, res) => {
    const { name } = req.body;
    try {
        const [result] = await db.execute('INSERT INTO categories (name) VALUES (?)', [name]);
        res.status(201).json({ id: result.insertId, name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a book
router.post('/books', async (req, res) => {
    const { title, author, category_id } = req.body;
    try {
        const [result] = await db.execute('INSERT INTO books (title, author, category_id) VALUES (?, ?, ?)', [title, author, category_id]);
        res.status(201).json({ id: result.insertId, title, author, category_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all books
router.get('/books', async (req, res) => {
    try {
        const [books] = await db.execute('SELECT * FROM books');
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search for a book by title or category
router.get('/books/search', async (req, res) => {
    const { title, category } = req.query;
    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];
    if (title) {
        query += ' AND title LIKE ?';
        params.push(`%${title}%`);
    }
    if (category) {
        query += ' AND category_id = ?';
        params.push(category);
    }
    try {
        const [books] = await db.execute(query, params);
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a student
router.post('/students', async (req, res) => {
    const { first_name, last_name, email } = req.body;
    try {
        const [result] = await db.execute('INSERT INTO students (first_name, last_name, email) VALUES (?, ?, ?)', [first_name, last_name, email]);
        // Send confirmation email
        const confirmationUrl = `http://localhost:3000/confirm/${result.insertId}`;
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Email Confirmation',
            html: `<p>Click <a href="${confirmationUrl}">here</a> to confirm your email.</p>`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
        res.status(201).json({ id: result.insertId, first_name, last_name, email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Confirm student email
router.get('/confirm/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('UPDATE students SET subscription_status = "Confirmed" WHERE id = ?', [id]);
        res.status(200).send('Email confirmed!');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all students
router.get('/students', async (req, res) => {
    try {
        const [students] = await db.execute('SELECT * FROM students');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Borrow a book
router.post('/borrow', async (req, res) => {
    const { book_id, student_id } = req.body;
    try {
        await db.execute('INSERT INTO borrowed_books (book_id, student_id) VALUES (?, ?)', [book_id, student_id]);
        await db.execute('DELETE FROM books WHERE id = ?', [book_id]);
        res.status(200).json({ message: 'Book borrowed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all borrowed books
router.get('/borrowed', async (req, res) => {
    try {
        const [borrowedBooks] = await db.execute('SELECT * FROM borrowed_books');
        res.status(200).json(borrowedBooks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
