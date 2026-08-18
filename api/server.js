const express = require('express');
const cors = require('cors');
const dns = require ("node:dns");
require('dotenv').config();

dns.setDefaultResultOrder("ipv4first");
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de prueba (health check)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor API funcionando correctamente' });
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor API ejecutándose en el puerto ${PORT}`);
});