import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemList from './pages/ItemList';
import ItemCadastro from './pages/ItemCadastro'; // Importando a nova tela

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/itens" element={<ItemList />} />
        <Route path="/itens/new" element={<ItemCadastro />} /> {/* Nova rota para cadastro */}
      </Routes>
    </Router>
  );
};

export default App;
