import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles.css';

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [fees, setFees] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userResponse = await axios.get(`http://localhost:5000/api/students/${id}`);
                setUser(userResponse.data);

                const feesResponse = await axios.get(`http://localhost:5000/api/fees/${id}`);
                setFees(feesResponse.data);
            } catch (error) {
                setMessage('Failed to load data: ' + error.message);
            }
        };
        fetchUser();
    }, [id]);

    return (
        <div>
            <h2>User Profile</h2>
            <p>First Name: {user.first_name}</p>
            <p>Last Name: {user.last_name}</p>
            <p>Email: {user.email}</p>
            <h3>Subscription Fees</h3>
            <table>
                <thead>
                    <tr>
                        <th>Payment Date</th>
                        <th>Amount (ILS)</th>
                    </tr>
                </thead>
                <tbody>
                    {fees.map((fee) => (
                        <tr key={fee.id}>
                            <td>{new Date(fee.payment_date).toLocaleDateString()}</td>
                            <td>{fee.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UserProfile;
