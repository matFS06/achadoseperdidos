import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Input, Form, FormGroup, Label } from 'reactstrap';
import axios from 'axios';

interface Item {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
}

const ItemList: React.FC = () => {
  const [itens, setItens] = useState<Item[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('');
  const [termoBusca, setTermoBusca] = useState<string>('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/itens')
      .then(response => setItens(response.data))
      .catch(error => console.error('Erro ao buscar itens:', error));
  }, []);

  const categorias = ['Todos', 'Chaves', 'Celular', 'Carteira', 'Mochila'];

  const itensFiltrados = itens.filter(item =>
    (categoriaSelecionada === '' || categoriaSelecionada === 'Todos' || item.categoria === categoriaSelecionada) &&
    (termoBusca === '' || item.nome.toLowerCase().includes(termoBusca.toLowerCase()))
  );

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h2>Itens Perdidos & Encontrados</h2>
        </Col>
        <Col className="text-end">
          <Button color="primary">+ Novo Item</Button>
        </Col>
      </Row>

      <Form className="mb-3">
        <FormGroup>
          <Label for="pesquisa">Buscar Item:</Label>
          <Input
            type="text"
            id="pesquisa"
            placeholder="Digite o nome do item..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </FormGroup>
      </Form>

      <Row className="mb-3">
        <Col>
          <Label for="filtro">Filtrar por Categoria:</Label>
          <Input
            type="select"
            id="filtro"
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
          >
            {categorias.map((categoria, index) => (
              <option key={index} value={categoria}>
                {categoria}
              </option>
            ))}
          </Input>
        </Col>
      </Row>

      <Row>
        {itensFiltrados.map(item => (
          <Col md={4} key={item.id} className="mb-4">
            <div className="p-3 border rounded shadow-sm">
              <h5>{item.nome}</h5>
              <p><strong>Categoria:</strong> {item.categoria}</p>
              <p>{item.descricao}</p>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ItemList;
