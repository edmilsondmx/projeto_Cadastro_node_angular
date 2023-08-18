import { Router } from 'express';
import LoginController from '../controllers/LoginController';
import validacaoCamposLogin from '../validacoes/ValidacaoCamposLogin';

const loginRota = Router();
const loginController = new LoginController();

loginRota.post('/', validacaoCamposLogin, loginController.gerarToken);

export default loginRota;
