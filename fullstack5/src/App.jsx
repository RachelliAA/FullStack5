
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import RegisterDetails from './components/RegisterDetails';
import Home from './components/Home';
import Todos from "./components/ToDos";
import Posts from "./components/Posts";
import Albums from './components/Albums';
import Comments from './components/Comments';
import Photos from './components/Photos';


function App() {
  return (
    <Router>
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
    </Router>
  )
}

export default App;





//HOW TO RUN:
//npx json-server --watch db.json --port 3000
//C:\Users\rache\Desktop\FullStack\unit5\fullstack5>npm run dev

