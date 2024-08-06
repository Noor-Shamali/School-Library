import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import AddBook from './components/AddBook';
import ShowBooks from './components/ShowBooks';
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
                        <Link to="/show-books">Show Books</Link>
                    </nav>
                </header>
                <div className="container">
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/user/:id" element={<UserProfile />} />
                        <Route path="/add-book" element={<AddBook />} />
                        <Route path="/show-books" element={<ShowBooks />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
