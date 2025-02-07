// src/pages/Login.tsx
import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Row, Col, FormText } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';  // Adicionado useNavigate
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Para redirecionamento

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      if (response.data.success) {
        console.log("✅ Login bem-sucedido!");
        navigate('/items');  // Redireciona para a página de itens
      }
    } catch (err: any) {
      console.error('❌ Erro ao fazer login:', err);
      setError(err.response?.data?.message || 'Erro ao autenticar.');
    }
  };

  return (
    <div className="container mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4} sm={8}>
          <h2 className="text-center mb-4">Login</h2>
          {error && <p className="text-danger text-center">{error}</p>}
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <Label for="email">E-mail</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Senha</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />{' '}
                Lembrar de mim
              </Label>
            </FormGroup>
            <Button color="primary" className="w-100">Login</Button>
          </Form>
          <FormText className="text-center mt-3">
            <Link to="/register">Ainda não tem uma conta? Cadastre-se!</Link>
          </FormText>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
