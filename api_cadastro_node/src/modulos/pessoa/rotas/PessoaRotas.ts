import { Router } from 'express';
import PessoaController from '../controllers/PessoaController';
import ValidacaoCamposIncluirPessoa from '../validacoes/ValidacaoCamposIncluirPessoa';
import validacaoCamposAlterarPessoa from '../validacoes/ValidacaoCamposAlterarPessoa';
import validacaoQueryParamsPessoa from '../validacoes/ValidacaoQueryParamsPessoa';
import estaAutenticado from '@compartilhada/http/middlewares/estaAutenticado';

const pessoaRota = Router();
const pessoaController = new PessoaController();

pessoaRota.get('/', validacaoQueryParamsPessoa, pessoaController.listarPessoas);
pessoaRota.post(
  '/',
  ValidacaoCamposIncluirPessoa,
  pessoaController.incluirPessoa,
);
pessoaRota.put(
  '/',
  validacaoCamposAlterarPessoa,
  pessoaController.alterarPessoa,
);
pessoaRota.delete(
  '/:codigoPessoa',
  estaAutenticado,
  pessoaController.excluirPessoa,
);

export default pessoaRota;
