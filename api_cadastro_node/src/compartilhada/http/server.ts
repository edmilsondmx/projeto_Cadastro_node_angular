import express from 'express';
import 'express-async-errors';
import rotas from './routes';
import error from './middlewares/Error';
import interceptadorCors from './interceptadorCors';

const porta = process.env.PORT || 3333;

const app = express();

app.use(express.json());

app.use(interceptadorCors);

app.use(rotas);
app.use(error);

app.listen(porta, () => {
  console.log(`Servidor iniciado na porta ${porta}!🚀`);
});
