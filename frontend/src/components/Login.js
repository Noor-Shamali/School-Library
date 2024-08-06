import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email });
            setMessage(response.data.message);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/show-books'); // Navigate to Show Books page on successful login
        } catch (error) {
            setMessage('Login failed: ' + (error.response && error.response.data.message ? error.response.data.message : 'undefined'));
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && <p className="error">{message}</p>}
        </div>
    );
};

export default Login;
