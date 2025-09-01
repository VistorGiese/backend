import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import UserRoutes from "./routes/UserRoutes";



import UserModel from "./models/UserModel";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

app.use(UserRoutes);


// Simulating database connection
import sequelize from './config/database'; // Assuming a database configuration file exists

sequelize
  .authenticate()
  .then(() => {
    console.log("Banco de dados conectado com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });

// Rota básica
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;