import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import classes from './registerDetails.module.css';

function RegisterDetails() {

    // State hooks
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [street, setStreet] = useState('');
    const [suite, setSuite] = useState('');
    const [city, setCity] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [catchPhrase, setCatchPhrase] = useState('');
    const [bs, setBs] = useState('');

    const navigate = useNavigate();
    const [baseUser, setBaseUser] = useState(null); // holds the partial user (username and password) from registor

    // Load the basic user info from localStorage 
    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('newUser'));
        if (!savedUser) {
            alert("No base user data");
            navigate('/register'); // redirect back to register 
        } else {
            setBaseUser(savedUser);
        }
    }, [navigate]);

    // Called when user submits the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!baseUser) return;

        try {
            // Fetch existing users
            const response = await axios.get('http://localhost:3000/users');
            const users = response.data;

            // Calculate next ID
            const maxId = users.reduce((max, user) => Math.max(max, user.id || 0), 0);
            const nextId = maxId + 1;

            // Combine baseUser with all the extra fields and assign ID
            const newUser = {
                id: nextId,
                ...baseUser,
                name,
                email,
                address: {
                    street,
                    suite,
                    city,
                    zipcode,
                    geo: {
                        lat,
                        lng
                    }
                },
                phone,
                website,
                company: {
                    name: companyName,
                    catchPhrase,
                    bs
                }
            };

            // Post the new user
            await axios.post('http://localhost:3000/users', newUser);

            // Save user to localStorage as logged in
            localStorage.removeItem('newUser'); // remove temporary data
            localStorage.setItem('loggedInUser', JSON.stringify(newUser));

            navigate('/home');

        } catch (err) {
            alert('Failed to register user');
            console.error(err);
        }
    };

    // Form for entering detailed user information
    return (


        <form onSubmit={handleSubmit} className={classes.container}>
            <div className={classes.text}>Complete Your Profile</div>

            <div className={classes.sectionTitle}>Basic Information</div>
            <div className={classes.grid}>
                <div className={classes.inputGroup}>
                    <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className={classes.inputGroup}>
                    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
            </div>

            <div className={classes.sectionTitle}>Address</div>
            <div className={classes.grid}>
                <div className={classes.inputGroup}>
                    <input placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)} />
                </div>
                <div className={classes.inputGroup}>
                    <input placeholder="Suite" value={suite} onChange={(e) => setSuite(e.target.value)} />
                </div>
                <div className={classes.inputGroup}>
                    <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className={classes.inputGroup}>
                    <input placeholder="Zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
                </div>
                <div className={classes.inputGroup}>
                    <input placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} />
                </div>
                <div className={classes.inputGroup}>
                    <input placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} />
                </div>
            </div>

            <div className={classes.sectionTitle}>Contact Info</div>
            <div className={classes.grid}>
                <div className={classes.inputGroup}>
                    <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className={classes.inputGroup}>
                    <input placeholder="Website (used as password)" value={website} onChange={(e) => setWebsite(e.target.value)} required />
                </div>
            </div>

            <div className={classes.sectionTitle}>Company Info</div>
            <div className={classes.grid}>
                <div className={classes.inputGroup}>
                    <input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className={classes.inputGroup}>
                    <input placeholder="Catch Phrase" value={catchPhrase} onChange={(e) => setCatchPhrase(e.target.value)} />
                </div>
                <div className={classes.inputGroup}>
                    <input placeholder="Business (bs)" value={bs} onChange={(e) => setBs(e.target.value)} />
                </div>
            </div>

            <div className={classes.grid}>
                <button type="submit">Finish Registration</button>
            </div>
        </form>

    );
}

export default RegisterDetails;
