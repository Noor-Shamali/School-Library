import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShowStudents = () => {
    const [students, setStudents] = useState([]);
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

    return (
        <div>
            <h2>All Students</h2>
            {message && <p>{message}</p>}
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Subscription Status</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.first_name}</td>
                            <td>{student.last_name}</td>
                            <td>{student.email}</td>
                            <td>{student.subscription_status === 'Confirmed' ? 'Confirmed' : 'Unconfirmed'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowStudents;
