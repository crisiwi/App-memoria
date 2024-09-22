import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImage from '../images/logo-desafios.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post('http://localhost:3001/login', { email, password });
            if (response.status === 200) {
                navigate('/');
            } else{
                console.log('Error:', response);
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('El correo no existe. Por favor, verifica tu correo.');
            } else {
                console.log('Error:', err);
                setError('Error al iniciar sesión. Verifica tus credenciales.');
            }
        }
      };

    return (
        <div className="background-gradient d-flex justify-content-center align-items-center">
            <div class="transparent-rectangle">
                <div className="form-container d-flex">
                    <div className="col-md-6 d-flex justify-content-center align-items-center">
                        <img src={logoImage} alt="Descripción de la imagen" className="img-fluid" />
                    </div>
        
                    <div className="col-md-6 d-flex justify-content-center">
                        <div className="form-content p-4 mx-3" style={{ maxWidth: '500px' }}>
                            <h2>Iniciar sesión</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label>Correo:</label>
                                    <input 
                                        type="email" 
                                        className="form-control custom-form-control" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="Ingresa tu correo"
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Contraseña:</label>
                                    <input 
                                        type="password" 
                                        className="form-control custom-form-control" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        placeholder="Ingresa tu contraseña"
                                        required
                                    />
                                </div>
                                
                                <div className="d-flex justify-content-between mt-3">
                                    <button type="submit" className="gradient-button">Iniciar Sesión</button>
                                    <button type="button" className="primary-button" onClick={() => navigate('/register')}>
                                        Crear cuenta
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;