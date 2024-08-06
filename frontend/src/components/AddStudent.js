import React, { useState } from 'react';
import axios from 'axios';

const AddStudent = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/students', {
                first_name: firstName,
                last_name: lastName,
                email
            });
            setMessage('Student added successfully!');
        } catch (error) {
            setMessage('Failed to add student: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Add a New Student</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <button type="submit">Add Student</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddStudent;
