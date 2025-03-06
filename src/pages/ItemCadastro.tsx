import React, { useState } from 'react';
import { Container, Row, Col, Button, Input, Form, FormGroup, Label, FormText, Alert } from 'reactstrap';
import axios from 'axios';

const ItemCadastro: React.FC = () => {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagemUrl, setImagemUrl] = useState<File | null>(null);
  const [localizacao, setLocalizacao] = useState('');
  const [status, setStatus] = useState<'Perdido' | 'Encontrado'>('Perdido');
  const [contato, setContato] = useState('');
  const [mensagem, setMensagem] = useState<string | null>(null);

  const categorias = ['Chaves', 'Celular', 'Carteira', 'Mochila', 'Outros'];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!nome || !categoria || !descricao || !localizacao || !status || !contato || !imagemUrl) {
      setMensagem('Todos os campos são obrigatórios!');
      return;
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('categoria', categoria);
    formData.append('descricao', descricao);
    formData.append('localizacao', localizacao);
    formData.append('status', status);
    formData.append('contato', contato);
    formData.append('imagem_url', imagemUrl); // Enviando a imagem

    try {
      await axios.post('http://localhost:5000/api/itens', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMensagem('Item cadastrado com sucesso!');
      // Limpando os campos após o envio
      setNome('');
      setCategoria('');
      setDescricao('');
      setImagemUrl(null);
      setLocalizacao('');
      setStatus('Perdido');
      setContato('');
    } catch (error) {
      setMensagem('Erro ao cadastrar o item. Tente novamente.');
      console.error('Erro ao cadastrar item:', error);
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <h2>Cadastro de Item</h2>
          {mensagem && (
            <Alert color={mensagem.includes('sucesso') ? 'success' : 'danger'}>{mensagem}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="nome">Nome do Item:</Label>
              <Input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </FormGroup>

            <FormGroup>
              <Label for="categoria">Categoria:</Label>
              <Input type="select" id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="descricao">Descrição do Item:</Label>
              <Input type="textarea" id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
            </FormGroup>

            <FormGroup>
              <Label for="localizacao">Localização:</Label>
              <Input type="text" id="localizacao" value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} required />
            </FormGroup>

            <FormGroup>
              <Label for="status">Status:</Label>
              <Input type="select" id="status" value={status} onChange={(e) => setStatus(e.target.value as 'Perdido' | 'Encontrado')} required>
                <option value="Perdido">Perdido</option>
                <option value="Encontrado">Encontrado</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="contato">Contato:</Label>
              <Input type="text" id="contato" value={contato} onChange={(e) => setContato(e.target.value)} required />
            </FormGroup>

            <FormGroup>
              <Label for="imagem_url">Imagem do Item:</Label>
              <Input type="file" id="imagem_url" onChange={(e) => setImagemUrl(e.target.files ? e.target.files[0] : null)} required />
              <FormText>Selecione uma imagem do item.</FormText>
            </FormGroup>

            <Button color="primary" type="submit">Cadastrar Item</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ItemCadastro;
