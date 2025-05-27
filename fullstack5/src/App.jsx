// src/App.js
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import RegisterDetails from './components/RegisterDetails';
import Home from './components/Home';
import Todos from "./components/ToDos";
import Posts from "./components/Posts";
import Albums from './components/Albums';
import Comments from './components/Comments';
import Photos from './components/Photos';
import { UserContext } from './context/UserContext';

function AppWrapper() {
  const location = useLocation();
  const match = location.pathname.match(/\/users\/(\d+)/);
  const userId = match ? match[1] : null;

  return (
    <UserContext.Provider value={userId}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-details" element={<RegisterDetails />} /> 
        <Route path="/users/:userId/home" element={<Home />} />
        <Route path="/users/:userId/todos" element={<Todos />} />
        <Route path="/users/:userId/posts" element={<Posts />} />
        <Route path="/users/:userId/posts/:postId/comments" element={<Comments />} />
        <Route path="/users/:userId/albums" element={<Albums />} />
        <Route path="/users/:userId/albums/:albumId/photos" element={<Photos />} />
      </Routes>
    </UserContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
