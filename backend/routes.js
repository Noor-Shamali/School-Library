const express = require('express');
const db = require('./db');
const nodemailer = require('nodemailer');
const router = express.Router();

// Load environment variables
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
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
        const [result] = await db.execute('INSERT INTO students (first_name, last_name, email, subscription_status) VALUES (?, ?, ?, ?)', [first_name, last_name, email, 'Unconfirmed']);
        // Send confirmation email
        const confirmationUrl = `http://localhost:3000/confirm/${result.insertId}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
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


// Route to lend a book to a student

router.post('/lend', async (req, res) => {
    const { book_id, student_id } = req.body;
    const due_date = new Date();
    due_date.setDate(due_date.getDate() + 7); // Set due date to one week from now

    try {
        console.log(`Lending book ID ${book_id} to student ID ${student_id} with due date ${due_date}`);

        // Ensure the book and student exist before proceeding
        const [bookExists] = await db.execute('SELECT * FROM books WHERE id = ?', [book_id]);
        const [studentExists] = await db.execute('SELECT * FROM students WHERE id = ?', [student_id]);

        if (bookExists.length === 0) {
            console.log('Book does not exist:', book_id);
            return res.status(400).json({ error: 'Invalid book ID' });
        }
        
        if (studentExists.length === 0) {
            console.log('Student does not exist:', student_id);
            return res.status(400).json({ error: 'Invalid student ID' });
        }

        // Check if the book is already borrowed
        const [bookBorrowed] = await db.execute('SELECT * FROM borrowed_books WHERE book_id = ?', [book_id]);
        if (bookBorrowed.length > 0) {
            console.log('Book is already borrowed:', book_id);
            return res.status(400).json({ error: 'Book is already borrowed' });
        }

        // Insert into borrowed_books table
        const [result] = await db.execute('INSERT INTO borrowed_books (book_id, student_id, due_date) VALUES (?, ?, ?)', [book_id, student_id, due_date]);
        console.log(`Inserted into borrowed_books: ${result}`);

        res.status(200).json({ message: 'Book borrowed successfully' });
    } catch (error) {
        console.error('Error lending book:', error);  // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
});


// Get all borrowed books
router.get('/borrowed', async (req, res) => {
    try {
        const [borrowedBooks] = await db.execute(`
            SELECT b.title, s.first_name, s.last_name, bb.borrow_date, bb.due_date
            FROM borrowed_books bb
            JOIN books b ON bb.book_id = b.id
            JOIN students s ON bb.student_id = s.id
        `);
        res.status(200).json(borrowedBooks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Manage subscription fee for a student
router.post('/fees', async (req, res) => {
    const { student_id, amount } = req.body;

    try {
        // Get the latest payment date for the student
        const [latestPayment] = await db.execute(
            'SELECT * FROM subscription_fees WHERE student_id = ? ORDER BY payment_date DESC LIMIT 1',
            [student_id]
        );

        // Check if the latest payment was made in the current month
        if (latestPayment.length > 0) {
            const lastPaymentDate = new Date(latestPayment[0].payment_date);
            const currentDate = new Date();

            if (
                lastPaymentDate.getFullYear() === currentDate.getFullYear() &&
                lastPaymentDate.getMonth() === currentDate.getMonth()
            ) {
                return res.status(400).json({ error: 'Subscription fee already paid for this month.' });
            }
        }

        // Record the new payment
        const [result] = await db.execute(
            'INSERT INTO subscription_fees (student_id, amount) VALUES (?, ?)',
            [student_id, amount]
        );

        res.status(201).json({ message: 'Subscription fee recorded successfully.', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get all fees
router.get('/fees', async (req, res) => {
    try {
        const [fees] = await db.execute('SELECT * FROM subscription_fees');
        res.status(200).json(fees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email } = req.body;
    console.log('Received login request for email:', email);  // Add this line
    try {
        const [users] = await db.execute('SELECT * FROM students WHERE email = ?', [email]);
        if (users.length > 0) {
            res.status(200).json({ message: 'Login successful', user: users[0] });
        } else {
            res.status(401).json({ message: 'Invalid email' });
        }
    } catch (error) {
        console.error('Error during login:', error);  // Add this line
        res.status(500).json({ error: error.message });
    }
});
// Get a specific student by ID
router.get('/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [students] = await db.execute('SELECT * FROM students WHERE id = ?', [id]);
        if (students.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(students[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get subscription fees for a specific student
router.get('/fees/:student_id', async (req, res) => {
    const { student_id } = req.params;
    try {
        const [fees] = await db.execute('SELECT * FROM subscription_fees WHERE student_id = ?', [student_id]);
        res.status(200).json(fees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all subscription fees with student details
router.get('/fees', async (req, res) => {
    try {
        const query = `
            SELECT subscription_fees.id, subscription_fees.payment_date, subscription_fees.amount, 
                   students.first_name, students.last_name, students.email 
            FROM subscription_fees 
            JOIN students ON subscription_fees.student_id = students.id
        `;
        const [fees] = await db.execute(query);
        res.status(200).json(fees);
    } catch (error) {
        console.error('Error fetching subscription fees:', error);
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
