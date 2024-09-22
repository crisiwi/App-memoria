import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link, Routes, Route, useNavigate } from 'react-router-dom'; 
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios';
import logoImage from '../images/logo-usm.svg';

//Vistas
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Desafios from './Desafios';
import CarrerasList from './CarrerasList';
import Grupos from './Grupos';
import Estudiantes from './Estudiantes';
import Postulacion from './Postulacion';

function App() {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
      setName('iniciar sesión');
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  const fetchName = async () => {
    try {
        //axios.defaults.withCredentials = true;
        const response = await axios.get('http://localhost:3001/api/name');
        setName(response.data.name);
    } catch (error) {
        console.error('Error fetching name:', error);
        if (error.response && error.response.status === 401) {
          setName("iniciar sesión");
          // navigate('/login');
        }
    }
  }
  fetchName();

  return (
    <>
      <Navbar className="custom-navbar" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src= {logoImage}
              width="280"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/desafios">Desafios</Nav.Link>
            <Nav.Link as={Link} to="/carreras">Carreras</Nav.Link>
            <Nav.Link as={Link} to="/grupos">Grupos</Nav.Link>
            <Nav.Link as={Link} to="/estudiantes">Estudiantes</Nav.Link>
            <Nav.Link as={Link} to="/postulacion">Postulacion</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link>{name}</Nav.Link>
            {name !== 'iniciar sesión' && (
              <Nav.Link onClick={handleLogout}>cerrar sesión</Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/desafios" element={<Desafios />} />
        <Route path="/carreras" element={<CarrerasList />} />
        <Route path="/grupos" element={<Grupos />} />
        <Route path="/estudiantes" element={<Estudiantes />} />
        <Route path="/postulacion" element={<Postulacion />} />
      </Routes>
    </>
  );
}

export default App;
