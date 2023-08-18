import { Router } from 'express';
import BairroController from '../controllers/BairroController';
import ValidacaoCamposIncluirBairro from '../validacoes/ValidacaoCamposIncluirBairro';
import validacaoCamposAlterarBairro from '../validacoes/ValidacaoCamposAlterarBairro';
import estaAutenticado from '@compartilhada/http/middlewares/estaAutenticado';
import validacaoQueryParamsBairro from '../validacoes/ValidacaoQueryParamsBairro';

const bairroRota = Router();
const bairroController = new BairroController();

bairroRota.get('/', validacaoQueryParamsBairro, bairroController.listarBairros);
bairroRota.post(
  '/',
  ValidacaoCamposIncluirBairro,
  bairroController.incluirBairro,
);
bairroRota.put(
  '/',
  validacaoCamposAlterarBairro,
  bairroController.alterarBairro,
);
bairroRota.delete(
  '/:codigoBairro',
  estaAutenticado,
  bairroController.excluirBairro,
);

export default bairroRota;
