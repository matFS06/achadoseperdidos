import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Row, Col, FormText } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    const user = { username, email, password };

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Cadastro realizado com sucesso!');
        navigate('/login');
      } else {
        alert(`Erro: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao fazer o cadastro:', error);
      alert('Erro ao fazer o cadastro. Tente novamente.');
    }
  };

  return (
    <div className="container mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4} sm={8}>
          <h2 className="text-center mb-4">Cadastro</h2>
          <Form onSubmit={handleRegister}>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Escolha seu nome de usuário"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
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
                placeholder="Escolha uma senha"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Confirmar Senha</Label>
              <Input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                required
              />
            </FormGroup>
            <Button color="primary" className="w-100">Cadastrar</Button>
          </Form>
          <FormText className="text-center mt-3">
            <Link to="/login">Já tem uma conta? Faça login!</Link>
          </FormText>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
