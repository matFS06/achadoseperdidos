// src/pages/Login.tsx
import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Row, Col, FormText } from 'reactstrap';
import { Link } from 'react-router-dom';  // Usando o Link do React Router

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login feito com sucesso!");
    // Aqui você pode adicionar a lógica de autenticação.
  };

  return (
    <div className="container mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4} sm={8}>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
