import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import AddBook from './components/AddBook';
import ShowBooks from './components/ShowBooks';
import AddStudent from './components/AddStudent';
import ShowStudents from './components/ShowStudents';
import BorrowedBooks from './components/BorrowedBooks';
import LendBook from './components/LendBook';
import ManageFees from './components/ManageFees';
import AllFees from './components/AllFees';
import './styles.css';

function App() {
    return (
        <Router>
            <div className="App">
                <header>
                    <h1>School Library System</h1>
                    <nav>
                        <Link to="/register">Register</Link> | 
                        <Link to="/login">Login</Link> | 
                        <Link to="/user/:id">User Profile</Link> | 
                        <Link to="/add-book">Add Book</Link> | 
                        <Link to="/show-books">Show Books</Link> | 
                        <Link to="/add-student">Add Student</Link> | 
                        <Link to="/show-students">Show Students</Link> | 
                        <Link to="/lend-book">Lend Book</Link> | 
                        <Link to="/borrowed-books">Borrowed Books</Link> | 
                        <Link to="/manage-fees">Manage Fees</Link> | 
                        <Link to="/all-fees">All Fees</Link>
                    </nav>
                </header>
                <div className="container">
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/user/:id" element={<UserProfile />} />
                        <Route path="/add-book" element={<AddBook />} />
                        <Route path="/show-books" element={<ShowBooks />} />
                        <Route path="/add-student" element={<AddStudent />} />
                        <Route path="/show-students" element={<ShowStudents />} />
                        <Route path="/lend-book" element={<LendBook />} />
                        <Route path="/borrowed-books" element={<BorrowedBooks />} />
                        <Route path="/manage-fees" element={<ManageFees />} />
                        <Route path="/all-fees" element={<AllFees />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
