import React, { useEffect, useState } from 'react';
//import './App.css';
function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/customers')
            .then(res => res.json())
            .then(data => setData(data.results));
    }, []);

    return (
        <div>
            {data.map((customer, index) => (
                <div key={index}>
                    <h2>{customer.name}</h2>
                    <p>{customer.age}</p>
                    <p>{customer.phone}</p>
                    <p>{customer.location}</p>
                </div>
            ))}
        </div>
    );
}

export default App;
