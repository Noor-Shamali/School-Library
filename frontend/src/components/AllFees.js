import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

function AllFees() {
    const [fees, setFees] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/all-fees');
                setFees(response.data);
            } catch (error) {
                setError('Failed to load fees: ' + error.message);
            }
        };
        fetchFees();
    }, []);

    return (
        <div className="container">
            <h2>All Subscription Fees</h2>
            {error && <p className="error">{error}</p>}
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
                    {fees.map((fee, index) => (
                        <tr key={index}>
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
}

export default AllFees;
