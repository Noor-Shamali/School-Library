import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email });
            setMessage(response.data.message);
            localStorage.setItem('user', JSON.stringify(response.data.user));
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
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Login;
