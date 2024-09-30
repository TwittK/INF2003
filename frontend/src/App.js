import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './Navbar';
import Books from './Books'; 
import Locations from './Locations';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Books />} />
                    <Route path="/locations" element={<Locations />} />
                </Routes>
            </div>
        </Router>
    );
}


export default App;
