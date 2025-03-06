import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import multer from 'multer';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_STRING,
});

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Testando conexão com o banco
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erro na conexão com o banco:', err);
  } else {
    console.log('✅ Conexão com o banco bem-sucedida!', res.rows);
  }
});

// Rota para registrar usuário
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Hash da senha antes de salvar no banco
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: result.rows[0].id });
  } catch (error) {
    console.error('❌ Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar o usuário.', error: error.message });
  }
});

// Rota de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      // Verificando a senha
      const validPassword = await bcrypt.compare(password, user.password);

      if (validPassword) {
        res.json({ success: true, message: 'Login realizado com sucesso!' });
      } else {
        res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }
  } catch (error) {
    console.error('❌ Erro ao autenticar usuário:', error);
    res.status(500).json({ message: 'Erro ao autenticar o usuário.', error: error.message });
  }
});

// Rota para cadastrar item
app.post('/api/itens', upload.single('imagem_url'), async (req, res) => {
  const { nome, categoria, descricao, localizacao, status, contato } = req.body;
  const imagem_url = req.file ? req.file.buffer : null;

  // Verificando se todos os campos obrigatórios foram preenchidos
  if (!nome || !categoria || !descricao || !localizacao || !status || !contato || !imagem_url) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Inserindo item no banco sem precisar passar o id
    const result = await pool.query(
      'INSERT INTO itens (nome, categoria, descricao, localizacao, status, contato, imagem_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [nome, categoria, descricao, localizacao, status, contato, imagem_url]
    );

    // Respondendo com o id do item inserido
    res.status(201).json({ message: 'Item cadastrado com sucesso!', itemId: result.rows[0].id });
  } catch (error) {
    console.error('❌ Erro ao cadastrar item:', error);
    res.status(500).json({ message: 'Erro ao cadastrar o item.', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
