import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

const Signup = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [entity, setEntity] = useState('');
    const [showRolInput, setShowRolInput] = useState(false);
    const [rol, setRol] = useState('');
    const [carreras, setCarreras] = useState([]); // Declarar el estado carreras
    const [selectedCarrera, setSelectedCarrera] = useState(''); // Estado para la carrera seleccionada
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleNameChange = (e) => setName(e.target.value);
    const handlePhoneChange = (e) => setPhone(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleEntitySelect = (selectedEntity) => {
        setEntity(selectedEntity);
        if (selectedEntity === 'Estudiante') {
            setShowRolInput(true);
        } else {
            setShowRolInput(false);
            setRol('');
            setSelectedCarrera(''); // Resetear la carrera seleccionada cuando no sea estudiante
        }
    };

    const handleCarreraSelect = (selectedCarrera) => {
        setSelectedCarrera(selectedCarrera);
    };

    const handleRolChange = (e) => setRol(e.target.value);

    // Fetch carreras
    useEffect(() => {
        axios.get('http://localhost:3001/carreras')
            .then(response => setCarreras(response.data))
            .catch(error => console.error('Error fetching carreras:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/register", {
            name: name,
            phone: phone,
            email: email,
            password: password,
            entity: entity,
            rol: entity === 'Estudiante' ? rol : undefined,
            carrera: entity === 'Estudiante' ? selectedCarrera : undefined // Enviar la carrera seleccionada
        })
        .then(response => {
            // console.log(response);
            if (response.data.mensaje === 'El correo ya existe') {
                setErrorMessage('El correo ya está registrado');
            } else {
                navigate('/login');
            }
        })
        .catch(error => {
            console.log(error);
            setErrorMessage('Ocurrió un error durante el registro');
        });
    };

    return (
        <div className="background-gradient d-flex justify-content-center align-items-center">
            <div className="form-container">
                <h2 style={{ padding: '20px' }}>Crear cuenta </h2>
                <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                    <div className="form-group mb-3">
                        <label>Nombre:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={name} 
                            onChange={handleNameChange} 
                            placeholder="Ingresa tu nombre"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Teléfono:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={phone} 
                            onChange={handlePhoneChange} 
                            placeholder="Ingresa tu teléfono"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Correo:</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            value={email} 
                            onChange={handleEmailChange} 
                            placeholder="Ingresa tu correo"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Contraseña:</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password} 
                            onChange={handlePasswordChange} 
                            placeholder="Ingresa tu contraseña"
                        />
                    </div>
        
                    {/* Dropdown para seleccionar entidad */}
                    <div className="form-group mb-3">
                        <Dropdown onSelect={handleEntitySelect}>
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                {entity || 'Selecciona una entidad'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="Estudiante">Estudiante</Dropdown.Item>
                                <Dropdown.Item eventKey="Organizacion">Organización</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
        
                    {/* Input y dropdown condicional para rol y carrera */}
                    {showRolInput && (
                        <>
                            <div className="form-group mb-3">
                                <label>Rol:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={rol} 
                                    onChange={handleRolChange} 
                                    placeholder="Ingresa tu rol"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <Dropdown onSelect={handleCarreraSelect}>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        {selectedCarrera || 'Selecciona una carrera'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {carreras.map(carrera => (
                                            <Dropdown.Item key={carrera._id} eventKey={carrera.carrera}>
                                                {carrera.carrera}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </>
                    )}
        
                    {errorMessage && <div className="text-danger">{errorMessage}</div>}
        
                    {/* Botones alineados horizontalmente */}
                    <div className="d-flex justify-content-between mt-3">
                        <button type="submit" className="primary-button">Crear cuenta</button>
                        <Link to="/login" className="gradient-button">Iniciar sesión</Link>
                    </div>
                </form>
            </div>
        </div>
    );
    
    
};

export default Signup;
