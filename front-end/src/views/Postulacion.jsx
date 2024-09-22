import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

const PostulacionesList = () => {
  const [postulaciones, setPostulaciones] = useState([]);

  useEffect(() => {
    // Hacer una solicitud GET para obtener las postulaciones
    axios.get('http://localhost:3001/postulaciones')
      .then(response => {
        setPostulaciones(response.data);
      })
      .catch(error => {
        console.error('Error fetching postulaciones:', error);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2>Lista de Postulaciones</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Prioridad</th>
          </tr>
        </thead>
        <tbody>
          {postulaciones.map((postulacion, index) => (
            <tr key={index}>
              <td>{postulacion.estudiante}</td>
              <td>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID Desafío</th>
                      <th>Prioridad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postulacion.Prioridades.map((prioridad, idx) => (
                      <tr key={idx}>
                        <td>{prioridad.idDesafio}</td>
                        <td>{prioridad.prioridad !== null ? prioridad.prioridad : 'Sin Prioridad'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PostulacionesList;
