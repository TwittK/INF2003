import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Data from MySQL</h1>
                <table>
                    <thead>
                        <tr>
                            {data.length > 0 && Object.keys(data[0]).map(key => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                {Object.keys(item).map(key => (
                                    <td key={key}>{item[key]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </header>
        </div>
    );
}

export default App;
