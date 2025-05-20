import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { MdPerson, MdLock } from 'react-icons/md';
import classes from './login.module.css';

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
        <div className={classes.container}>
            <div className={classes.header}>
                <div className={classes.text}>Register</div>
                <div className={classes.underLine}></div>
            </div>

            <form className={classes.inputs} onSubmit={handleRegister}>
                <div className={classes.input}>
                    <MdPerson className={classes.icon} />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className={classes.input}>
                    <MdLock className={classes.icon} />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className={classes.input}>
                    <MdLock className={classes.icon} />
                    <input
                        type="password"
                        placeholder="Verify Password"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className={classes.submit}>Register Details</button>

                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            </form>

            <div className={classes.link}>
                Don't have an account?&nbsp;
                <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#34036c', fontWeight: 'bold' }}>
                    Login here
                </span>
            </div>
        </div>
    );
}


export default Register;
