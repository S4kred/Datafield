import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactHandler from './api/contact.js';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Ruta para la API de contacto
app.post('/api/contact', (req, res) => {
  contactHandler(req, res);
});

app.listen(PORT, () => {
  console.log(`Servidor API ejecutándose en http://localhost:${PORT}`);
});