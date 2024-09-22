import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EstudiantesList = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch name from backend
        const fetchName = async () => {
            try {
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

        // Fetch estudiantes
        axios.get('http://localhost:3001/estudiantes')
            .then(response => setEstudiantes(response.data))
            .catch(error => {
                console.error('Error fetching estudiantes:', error);
                setErrorMessage('Error al obtener la lista de estudiantes');
            });

        // Fetch grupos
        axios.get('http://localhost:3001/grupos')
            .then(response => setGrupos(response.data))
            .catch(error => {
                console.error('Error fetching grupos:', error);
                setErrorMessage('Error al obtener la lista de grupos');
            });
    }, []);

    // Función para obtener el nombre del desafío asociado a un estudiante
    const getGrupoNombre = (estudianteRol) => {
        const grupo = grupos.find(grupo => grupo.estudiantes.includes(estudianteRol));
        return grupo ? grupo.nombre : 'Sin grupo';
    };

    return (
        <div className="background-gradient d-flex-column">
            <div className="form-container">
                <h2>Lista de Estudiantes</h2>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                {estudiantes.length > 0 ? (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Rol</th>
                                <th>Carrera</th>
                                <th>Grupo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {estudiantes.map(estudiante => (
                                <tr key={estudiante._id}>
                                    <td>{estudiante.name}</td>
                                    <td>{estudiante.rol}</td>
                                    <td>{estudiante.carrera}</td>
                                    <td>{getGrupoNombre(estudiante.rol)}</td> {/* Aquí se obtiene el nombre del grupo */}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <Alert variant="info">No hay estudiantes disponibles</Alert>
                )}
            </div>
        </div>
    );
};

export default EstudiantesList;
