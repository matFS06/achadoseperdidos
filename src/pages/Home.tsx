import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link para navegação

const Home = () => {
  return (
    <div style={styles.container}>
      <h1>Bem-vindo à Home</h1>
      <p>Esta é a tela inicial do seu projeto!</p>

      {/* Link para a tela de Login */}
      <Link to="/login" style={styles.button}>
        Ir para Login
      </Link>
    </div>
  );
};

// Estilos para melhorar a aparência
const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  button: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
  },
};

export default Home;
