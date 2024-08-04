import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = ({ match }) => {
    const [user, setUser] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/students/${match.params.id}`);
                setUser(response.data);
            } catch (error) {
                setMessage('Failed to load user data: ' + error.message);
            }
        };
        fetchUser();
    }, [match.params.id]);

    const resendConfirmation = async () => {
        try {
            await axios.post(`http://localhost:5000/api/resend-confirmation/${match.params.id}`);
            setMessage('Confirmation email resent.');
        } catch (error) {
            setMessage('Failed to resend confirmation email: ' + error.message);
        }
    };

    return (
        <div>
            <h2>User Profile</h2>
            <p>First Name: {user.first_name}</p>
            <p>Last Name: {user.last_name}</p>
            <p>Email: {user.email}</p>
            <p>
                Subscription Status: {user.subscription_status === 'Confirmed' ? 'Confirmed' : 'Unconfirmed'}
                {user.subscription_status === 'Unconfirmed' && (
                    <button onClick={resendConfirmation}>Resend Confirmation</button>
                )}
            </p>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UserProfile;
