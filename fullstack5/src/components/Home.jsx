
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './Home.module.css';

function Home() {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('loggedInUser');
            if (!storedUser) {
                setError('No user logged in. Redirecting to login...');
                setTimeout(() => navigate('/'), 2000);
                return;
            }
            setUser(JSON.parse(storedUser));
        } catch (err) {
            setError('Failed to load user data');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        navigate('/');
    };

    const handleNavigate = (section) => {
        if (!user?.id) {
            setError('Invalid user ID. Cannot navigate.');
            return;
        }
        navigate(`/users/${user.id}/${section}`);

    };

    return (
        <>
            {error && <div className={classes.error}>{error}</div>}
    
            {user && (
                <>
                    <div className={classes.header}>
                        <div className={classes.text}>Welcome, {user.name}</div>
                        <div className={classes.underLine}></div>
                    </div>
    
                    <div className={classes.nav}>
                        <button className={classes.navButton} onClick={() => setShowInfo((prev) => !prev)}>Info</button>
                        <button className={classes.navButton} onClick={() => handleNavigate('todos')}>Todos</button>
                        <button className={classes.navButton} onClick={() => handleNavigate('posts')}>Posts</button>
                        <button className={classes.navButton} onClick={() => handleNavigate('albums')}>Albums</button>
                        <button className={classes.navButton} onClick={handleLogout}>Logout</button>
                    </div>
    
                    {showInfo && (
                        <div className={classes.infoCard}>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone:</strong> {user.phone}</p>
                            <p><strong>Website:</strong> {user.website}</p>
                            <p><strong>Address:</strong> {user.address?.street}, {user.address?.city}, {user.address?.zipcode}</p>
                            <p><strong>Company:</strong> {user.company?.name} - {user.company?.catchPhrase}</p>
                        </div>
                    )}
                </>
            )}
        </>
    );
    
}



export default Home;