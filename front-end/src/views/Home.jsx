import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchName = async () => {
            try {
                axios.defaults.withCredentials = true;
                const response = await axios.get('http://localhost:3001/api/name');
                setName(response.data.name);
            } catch (error) {
                console.error('Error fetching name:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchName();
    }, [navigate]);

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <h2>Hi {name}</h2>
            {/* <div className="d-flex justify-content-between mt-3">
                <button type="button" className="gradient-button" onClick={() => navigate('/login')}>Iniciar Sesión</button>
                <button type="button" className="primary-button" onClick={() => navigate('/register')}>
                    Crear cuenta
                </button>
            </div> */}
        </div>
    );
};

export default Home;
