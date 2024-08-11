import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles.css';

const AllFees = () => {
    const [fees, setFees] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/fees');
                setFees(response.data);
            } catch (error) {
                setMessage('Failed to load data: ' + error.message);
            }
        };
        fetchFees();
    }, []);

    return (
        <div>
            <h2>All Subscription Fees</h2>
            {message && <p className="error">{message}</p>}
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Payment Date</th>
                        <th>Amount (ILS)</th>
                    </tr>
                </thead>
                <tbody>
                    {fees.map((fee) => (
                        <tr key={fee.id}>
                            <td>{fee.first_name}</td>
                            <td>{fee.last_name}</td>
                            <td>{fee.email}</td>
                            <td>{new Date(fee.payment_date).toLocaleDateString()}</td>
                            <td>{fee.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllFees;
