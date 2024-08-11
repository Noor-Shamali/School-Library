-- Drop the existing database if it exists
DROP DATABASE IF EXISTS school_library;

-- Create the database
CREATE DATABASE school_library;

-- Use the newly created database
USE school_library;

-- Create the categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create the books table
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Create the students table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscription_status ENUM('Unconfirmed', 'Confirmed') DEFAULT 'Unconfirmed'
);

-- Create the borrowed_books table
CREATE TABLE borrowed_books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT,
    student_id INT,
    borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME,
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Create the subscription_fees table
CREATE TABLE subscription_fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10, 2),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Insert sample data into categories
INSERT INTO categories (name) VALUES 
('Fiction'), 
('Non-Fiction'), 
('Science'), 
('Mathematics');

-- Insert sample data into books
INSERT INTO books (title, author, category_id) VALUES 
('To Kill a Mockingbird', 'Harper Lee', 1),
('A Brief History of Time', 'Stephen Hawking', 3),
('The Great Gatsby', 'F. Scott Fitzgerald', 1),
('Calculus', 'James Stewart', 4);

-- Insert sample data into students
INSERT INTO students (first_name, last_name, email, subscription_status) VALUES 
('Noor', 'Shamali', 'noor.mohammad.shamali@gmail.com', 'Unconfirmed'),
('John', 'Doe', 'john.doe@example.com', 'Confirmed');

-- Ensure book and student data is inserted before borrowing
-- Insert sample data into borrowed_books
INSERT INTO borrowed_books (book_id, student_id, due_date) VALUES 
(1, 1, DATE_ADD(NOW(), INTERVAL 7 DAY)),
(2, 2, DATE_ADD(NOW(), INTERVAL 7 DAY));

-- Insert sample data into subscription_fees
INSERT INTO subscription_fees (student_id, amount) VALUES 
(1, 50.00),
(2, 75.00);

-- Show the tables
SHOW TABLES;
