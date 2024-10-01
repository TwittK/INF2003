import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './Navbar';
import Books from './Books'; 
import Locations from './Locations';
import Loans from './Loans';
import Favourites from './Favourites';
import Login from './Login';
import Register from './Register'
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Books />} />
                    <Route path="/Locations" element={<Locations />} />
                    <Route path="/Loans" element={<Loans />} />
                    <Route path="/Favourites" element={<Favourites />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}


export default App;
