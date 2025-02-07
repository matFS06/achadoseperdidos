import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_STRING,
});

const app = express();
app.use(express.json());
app.use(cors());

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
  console.log('📩 Dados recebidos:', { username, email, password });

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, password]
    );

    console.log('✅ Usuário cadastrado com sucesso! ID:', result.rows[0].id);
    res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: result.rows[0].id });

  } catch (error) {
    console.error('❌ Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar o usuário.', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
