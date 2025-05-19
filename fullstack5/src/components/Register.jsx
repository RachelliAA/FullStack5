import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {

    // State hooks
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Check password match
        if (password !== verifyPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // Check if username already exists
            const res = await axios.get(`http://localhost:3000/users?username=${username}`);
            if (res.data.length > 0) {
                setError("Username already exists");
                return;
            }

            // Store username & password in localStorage
            localStorage.setItem('newUser', JSON.stringify({ username, website: password }));
            // Navigate to additional details form
            navigate('/register-details');

        } catch (err) {
            setError("Server error");
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Register</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="Verify Password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                required
            />

            <button type="submit">Continue</button>
            {error && <p>{error}</p>}
        </form>
    );
}


export default Register;
