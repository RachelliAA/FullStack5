import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

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

    // Combine baseUser with all the extra fields
    const newUser = {
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

    try {
      // Post the new user
      await axios.post('http://localhost:3000/users', newUser);

      // Save user to localStorage as logged in
      localStorage.removeItem('newUser'); // remove temporary data
      localStorage.setItem('loggedInUser', JSON.stringify(newUser));

      navigate('/home');
    } catch (err) {
      alert('Failed to register user');
    }
  };

  // Form for entering detailed user information
  return (
    <form onSubmit={handleSubmit}>
      <h2>Complete Your Profile</h2>

      <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <h4>Address</h4>
      <input placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)} />
      <input placeholder="Suite" value={suite} onChange={(e) => setSuite(e.target.value)} />
      <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
      <input placeholder="Zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
      <input placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} />
      <input placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} />

      <h4>Contact Info</h4>
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required/>
      <input placeholder="Website (used as password)" value={website} onChange={(e) => setWebsite(e.target.value)} required />

      <h4>Company Info</h4>
      <input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
      <input placeholder="Catch Phrase" value={catchPhrase} onChange={(e) => setCatchPhrase(e.target.value)} />
      <input placeholder="Business (bs)" value={bs} onChange={(e) => setBs(e.target.value)} />

      <button type="submit">Finish Registration</button>
    </form>
  );
}

export default RegisterDetails;
