import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebaseConfig'; // Asegúrate de tener configurada Firebase correctamente.
import { getDoc, doc } from 'firebase/firestore';
import './Navbar.css'; // Agregaremos los estilos luego
import { Link } from 'react-router-dom'; // Necesario cuando configures rutas

function Navbar({ isPeluquero }) {
  const [user] = useAuthState(auth); // Verificamos si el usuario está autenticado
  const [isOpen, setIsOpen] = React.useState(false);  // Estado para manejar el menú desplegable

  // Función para alternar el estado del menú
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Función para verificar si el usuario es peluquero
  const checkIfPeluquero = async (user) => {
    if (user) {
      const userRef = doc(db, 'users', user.uid); // Asegúrate de que los usuarios estén guardados en 'users' collection
      const userDoc = await getDoc(userRef);
      if (userDoc.exists() && userDoc.data().rol === 'peluquero') {
        setIsPeluquero(true);
      }
    }
  };

  useEffect(() => {
    if (user) {
      checkIfPeluquero(user);
    }
  }, [user]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Logo</h1>
      </div>
      <div className="navbar">
      <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/reservar-turno">Reservar Turno</Link></li>
          <li><Link to="/estado">Estado</Link></li>
          <li><Link to="/productos">Productos</Link></li>
                  {/* Mostrar la opción del Panel Peluquero solo si el usuario es peluquero */}
        {isPeluquero && (
          <li><a href="/panelpeluquero">Panel Peluquero</a></li>
        )}

        {user ? (
          <>
            
            <li><a onClick={() => auth.signOut()}>Cerrar Sesión</a></li>
          </>
        ) : (
          <li><a href="/login">Iniciar Sesión</a></li>
        )}
        </ul>
      </div>
      <div className="navbar-hamburguer" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
