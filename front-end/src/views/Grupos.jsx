import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import { Table, Container, Alert } from 'react-bootstrap';

const CrearGrupo = () => {
    const [desafios, setDesafios] = useState([]); // Lista de desafíos
    const [selectedDesafio, setSelectedDesafio] = useState(null); // Desafío seleccionado (almacenar el objeto completo)
    const [estudiantes, setEstudiantes] = useState([]); // Lista de estudiantes
    const [grupoEstudiantes, setGrupoEstudiantes] = useState([]); // Estudiantes del grupo
    const [grupoCreado, setGrupoCreado] = useState(null); // Mensaje de éxito o error
    const [errorMessage, setErrorMessage] = useState('');
    const [grupos, setGrupos] = useState([]); // Lista de grupos creados

    // Fetch desafíos
    useEffect(() => {
        axios.get('http://localhost:3001/desafios')
            .then(response => setDesafios(response.data))
            .catch(error => console.error('Error fetching desafios:', error));
    }, []);

    // Fetch estudiantes cuando se selecciona un desafío
    useEffect(() => {
        if (selectedDesafio) {
            axios.get('http://localhost:3001/estudiantes')
                .then(response => setEstudiantes(response.data))
                .catch(error => console.error('Error fetching estudiantes:', error));
        }
    }, [selectedDesafio]);

    // Fetch grupos creados
    useEffect(() => {
        axios.get('http://localhost:3001/grupos')
            .then(response => setGrupos(response.data))
            .catch(error => console.error('Error fetching grupos:', error));
    }, []);

    const handleDesafioSelect = (desafioId) => {
        const desafio = desafios.find(d => d._id === desafioId);
        setSelectedDesafio(desafio); // Almacena el desafío completo
    };

    const handleEstudianteToggle = (estudianteId) => {
        if (grupoEstudiantes.includes(estudianteId)) {
            // Eliminar estudiante del grupo
            setGrupoEstudiantes(grupoEstudiantes.filter(id => id !== estudianteId));
        } else {
            // Agregar estudiante al grupo
            setGrupoEstudiantes([...grupoEstudiantes, estudianteId]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos enviados:', { estudiantes: grupoEstudiantes });
        console.log('Desafío seleccionado:', selectedDesafio);
        axios.post(`http://localhost:3001/crear-grupo/${selectedDesafio._id}`, { estudiantes: grupoEstudiantes })
            .then(response => {
                setGrupoCreado(response.data.grupo);
                setErrorMessage('');
                setGrupos([...grupos, response.data.grupo]); // Actualiza la lista de grupos creados
            })
            .catch(error => {
                console.error('Error creating group:', error);
                setErrorMessage('Ocurrió un error al crear el grupo');
            });
    };

    // Filtrar desafíos que ya están asignados a un grupo
    const filtrarDesafiosAsignados = () => {
        const desafiosAsignados = new Set(grupos.map(grupo => grupo.id));
        return desafios.filter(desafio => !desafiosAsignados.has(desafio._id));
    };

    // Filtrar estudiantes que ya pertenecen a otros grupos
    const filtrarEstudiantesAsignados = () => {
        const estudiantesAsignados = new Set(grupos.flatMap(grupo => grupo.estudiantes));
        return estudiantes.filter(estudiante => !estudiantesAsignados.has(estudiante.rol));
    };

    return (
        <div className="background-gradient d-flex-column">
            <div className="form-container">
                <h2>Crear Grupo</h2>
                <br />
                <form onSubmit={handleSubmit}>
                    {/* Dropdown para seleccionar desafío */}
                    <Dropdown onSelect={handleDesafioSelect}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {selectedDesafio ? selectedDesafio.title : 'Selecciona un desafío'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {filtrarDesafiosAsignados().map(desafio => (
                                <Dropdown.Item key={desafio._id} eventKey={desafio._id}>
                                    {desafio.title}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    {/* Mostrar lista de estudiantes */}
                    {selectedDesafio && (
                        <div>
                            <br />
                            <h3>Estudiantes para asociar al desafío:</h3>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Rol</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtrarEstudiantesAsignados().map(estudiante => (
                                        <tr key={estudiante.rol}>
                                            <td>{estudiante.name}</td>
                                            <td>{estudiante.rol}</td>
                                            <td>
                                                <button 
                                                    type="button" 
                                                    className={`btn ${grupoEstudiantes.includes(estudiante.rol) ? 'btn-danger' : 'btn-primary'}`} 
                                                    onClick={() => handleEstudianteToggle(estudiante.rol)}
                                                >
                                                    {grupoEstudiantes.includes(estudiante.rol) ? 'Eliminar' : 'Agregar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Mostrar estudiantes del grupo */}
                    {grupoEstudiantes.length > 0 && (
                        <div>
                            <h3>Estudiantes en el grupo:</h3>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Rol</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grupoEstudiantes.map(estudianteId => {
                                        const estudiante = estudiantes.find(e => e.rol === estudianteId);
                                        return estudiante ? (
                                            <tr key={estudiante.rol}>
                                                <td>{estudiante.name}</td>
                                                <td>{estudiante.rol}</td>
                                            </tr>
                                        ) : null;
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                    {grupoCreado && <div style={{ color: 'green' }}>Grupo creado exitosamente</div>}

                    {selectedDesafio && grupoEstudiantes.length > 0 && (
                        <button type="submit" className="btn btn-success">Crear Grupo</button>
                    )}

                </form>
                <br />
                <br />
            </div>
            <div className="form-container">
                {/* Mostrar tabla de grupos creados */}
                {grupos.length > 0 && (
                    <div>
                        <h3>Grupos Creados</h3>
                        <br />
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Desafío</th>
                                    <th>Rol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grupos.map((grupo, index) => (
                                    grupo.estudiantes.map((estudiante, estudianteIndex) => (
                                        <tr key={`${grupo.id}-${estudianteIndex}`}>
                                            {estudianteIndex === 0 && (
                                                <td rowSpan={grupo.estudiantes.length}>{grupo.nombre}</td>
                                            )}
                                            <td>{estudiante}</td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CrearGrupo;
