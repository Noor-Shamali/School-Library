import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles.css';

const ManageFees = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/students');
                setStudents(response.data);
            } catch (error) {
                setMessage('Failed to load students: ' + error.message);
            }
        };
        fetchStudents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/fees', {
                student_id: selectedStudent,
                amount: amount
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to record fee: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div>
            <h2>Manage Subscription Fees</h2>
            <form onSubmit={handleSubmit}>
                <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
                    <option value="">Select Student</option>
                    {students.map((student) => (
                        <option key={student.id} value={student.id}>
                            {student.first_name} {student.last_name}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount (ILS)"
                    required
                />
                <button type="submit">Record Fee</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ManageFees;
