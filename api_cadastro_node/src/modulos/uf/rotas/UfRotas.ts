import { Router } from 'express';
import UfController from '../controllers/UfController';
import ValidacaoCamposIncluirUF from '@modulos/uf/validacoes/ValidacaoCamposIncluirUF';
import ValidacaoCamposAlterarUF from '@modulos/uf/validacoes/ValidacaoCamposAlterarUF';
import estaAutenticado from '@compartilhada/http/middlewares/estaAutenticado';
import validacaoQueryParamsUF from '../validacoes/ValidacaoQueryParamsUF';

const ufRota = Router();
const ufController = new UfController();

ufRota.get('/', validacaoQueryParamsUF, ufController.listarUFs);
ufRota.post('/', ValidacaoCamposIncluirUF, ufController.incluirUF);
ufRota.put('/', ValidacaoCamposAlterarUF, ufController.alterarUF);
ufRota.delete('/:codigoUF', estaAutenticado, ufController.excluirUF);

export default ufRota;
