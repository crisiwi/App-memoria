import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Table, Container, Alert } from 'react-bootstrap';

const Desafios = () => {
    const [title, setTitulo] = useState('');
    const [description, setDescripcion] = useState('');
    const [carreras, setCarreras] = useState([]);
    const [selectedCarreras, setSelectedCarreras] = useState([]);
    const [desafios, setDesafios] = useState([]); // Estado para almacenar los desafíos existentes
    const navigate = useNavigate();

    // Obtener carreras desde la API
    useEffect(() => {
        axios.get('http://localhost:3001/carreras')
            .then(response => setCarreras(response.data))
            .catch(error => console.error('Error fetching carreras:', error));
    }, []);

    // Obtener desafíos desde la API
    useEffect(() => {
        axios.get('http://localhost:3001/desafios')
            .then(response => setDesafios(response.data))
            .catch(error => console.error('Error fetching desafios:', error));
    }, []);

    const handleTituloChange = (e) => setTitulo(e.target.value);
    const handleDescripcionChange = (e) => setDescripcion(e.target.value);

    const handleCarrerasChange = (e) => {
        const { value, checked } = e.target;

        if (checked) {
            // Agrega la carrera seleccionada
            setSelectedCarreras([...selectedCarreras, value]);
        } else {
            // Elimina la carrera deseleccionada
            setSelectedCarreras(selectedCarreras.filter(carrera => carrera !== value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3001/desafios', {
            title,
            description,
            carreras: selectedCarreras
        })
        .then(response => {
            console.log(response.data);
            alert('Desafío registrado exitosamente');
            navigate('/'); // Redirige al inicio o a otra página
        })
        .catch(error => {
            console.error('Hubo un error al registrar el desafío:', error);
            alert('Hubo un error al registrar el desafío');
        });
    };

    return (
        <div className="background-gradient d-flex-column">
            <br />
            <div className="form-container">
                <h2>Crear Desafío</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label>Título: </label>
                        <Form.Control type="text" value={title} onChange={handleTituloChange} />
                    </div>
                    <div className="form-group mb-3">
                        <label>Descripción: </label>
                        <Form.Control as="textarea" value={description} onChange={handleDescripcionChange} />
                    </div>
                    <div className="form-group mb-3">
                        <label>Carreras (selecciona varias): </label>
                        <div>
                            {carreras.map(carrera => (
                                <Form.Check 
                                    key={carrera._id} 
                                    type="checkbox" 
                                    label={carrera.carrera} 
                                    value={carrera.carrera} 
                                    onChange={handleCarrerasChange} 
                                    checked={selectedCarreras.includes(carrera.carrera)} 
                                />
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="primary-button">Crear Desafío</button>
                </form>
            </div>
    
            <div className="form-container">
                <h3>Lista de Desafíos</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Título</th>
                            <th>Descripción</th>
                            <th>Carreras</th>
                        </tr>
                    </thead>
                    <tbody>
                        {desafios.map((desafio, index) => (
                            <tr key={desafio._id}>
                                <td>{index + 1}</td>
                                <td>{desafio.title}</td>
                                <td>{desafio.description}</td>
                                <td>{desafio.carreras.join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
    
};

export default Desafios;
