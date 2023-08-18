import { Router } from 'express';
import ufRotas from '@modulos/uf/rotas/UfRotas';
import municipioRotas from '@modulos/municipio/rotas/MunicipioRotas';
import bairroRotas from '@modulos/bairro/rotas/BairroRotas';
import pessoaRotas from '@modulos/pessoa/rotas/PessoaRotas';
import loginRotas from '@modulos/pessoa/rotas/LoginRotas';

const rotas = Router();

rotas.use('/uf', ufRotas);
rotas.use('/municipio', municipioRotas);
rotas.use('/bairro', bairroRotas);
rotas.use('/pessoa', pessoaRotas);
rotas.use('/login', loginRotas);

export default rotas;
