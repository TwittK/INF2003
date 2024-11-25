import React, { useEffect, useState } from 'react';
import './Locations.css';

function Locations() {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/location')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setLocations(data))
            .catch(error => console.error('Error fetching locations:', error));
    }, []);

    return (
        <div>
            <h1>Library Locations</h1>
            {locations.length > 0 ? (
                <ul className='location-list'>
                    {locations.map((location, index) => (
                        <li key={index}>
                            <p><strong>Location:</strong> {location.locname || "Unknown"}</p>
                            <p><strong>Address:</strong> {location.locaddress || "Unknown"}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No locations found.</p>
            )}
        </div>
    );
}

export default Locations;
