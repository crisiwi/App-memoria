import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Alert } from 'react-bootstrap';

const CarrerasList = () => {
  const [carreras, setCarreras] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/carreras')
    .then(carreras => {setCarreras(carreras.data)})
    .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <Container>
        <br />
        <h2>Lista de Carreras</h2>
        <ul>
          {carreras.map(carrera => <li key={carrera._id}>{carrera.carrera}</li>)}
        </ul>
      </Container>
    </div>
  );
};

export default CarrerasList;
