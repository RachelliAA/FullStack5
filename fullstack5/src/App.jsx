
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import RegisterDetails from './components/RegisterDetails';
import Home from './components/Home';
import Todos from "./components/ToDos";
import Posts from "./components/Posts";
import Albums from './components/Albums';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-details" element={<RegisterDetails />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/home/:id/todos" element={<Todos />} />
        <Route path="/home/:id/posts" element={<Posts />} />
        <Route path="/home/:id/albums" element={<Albums />} />


      </Routes>
    </Router>
  )
}

export default App;





//HOW TO RUN:
//npx json-server --watch db.json --port 3000
//C:\Users\rache\Desktop\FullStack\unit5\fullstack5>npm run dev

