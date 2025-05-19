
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Login() {

    // State hooks
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // GET request to find the user 
            const res = await axios.get(`http://localhost:3000/users?username=${username}`);
            const user = res.data[0];

            if (user && user.website === password) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                // Redirect to the home page
                navigate('/home');
            } else {
                setError("Incorrect username or password")
            }

        } catch (err) {
            setError("Server error");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    );
}

export default Login;