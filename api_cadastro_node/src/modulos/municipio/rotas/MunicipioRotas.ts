import { Router } from 'express';
import MunicipioController from '../controllers/MunicipioController';
import ValidacaoCamposIncluirMunicipio from '../validacoes/ValidacaoCamposIncluirMunicipio';
import validacaoCamposAlterarMunicipio from '../validacoes/ValidacaoCamposAlterarMunicipio';
import estaAutenticado from '@compartilhada/http/middlewares/estaAutenticado';
import validacaoQueryParamsMunicipio from '../validacoes/ValidacaoQueryParamsMunicipio';

const municipioRota = Router();
const municipioController = new MunicipioController();

municipioRota.get(
  '/',
  validacaoQueryParamsMunicipio,
  municipioController.listarMunicipios,
);
municipioRota.post(
  '/',
  ValidacaoCamposIncluirMunicipio,
  municipioController.incluirMunicipio,
);
municipioRota.put(
  '/',
  validacaoCamposAlterarMunicipio,
  municipioController.alterarMunicipio,
);
municipioRota.delete(
  '/:codigoMunicipio',
  estaAutenticado,
  municipioController.excluirMunicipio,
);

export default municipioRota;
