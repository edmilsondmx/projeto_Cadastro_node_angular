import { Request, Response, NextFunction } from 'express';
import Endereco from '../entidades/Endereco';
import validacaoCamposIncluirEndereço from './ValidacaoCamposIncluirEndereco';
import ValidacaoErro from '@compartilhada/erros/ValidacaoErro';

interface IBody {
  nome: string;
  sobrenome: string;
  idade: number;
  login: string;
  senha: string;
  status: number;
  enderecos: Endereco[];
}

export default function validacaoCamposIncluirPessoa(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { nome, sobrenome, idade, login, senha, status, enderecos }: IBody =
    request.body;

  if (!nome) {
    throw new ValidacaoErro(
      'O Campo nome é obrigatório! Por favor, preencha o campo!',
      400,
      'nome',
    );
  }
  if (!sobrenome) {
    throw new ValidacaoErro(
      'O Campo sobrenome é obrigatório! Por favor, preencha o campo!',
      400,
      'sobrenome',
    );
  }
  if (!idade) {
    throw new ValidacaoErro(
      'O Campo idade é obrigatório! Por favor, preencha o campo!',
      400,
      'idade',
    );
  }
  if (!login) {
    throw new ValidacaoErro(
      'O Campo login é obrigatório! Por favor, preencha o campo!',
      400,
      'login',
    );
  }
  if (!senha) {
    throw new ValidacaoErro(
      'O Campo senha é obrigatório! Por favor, preencha o campo!',
      400,
      'senha',
    );
  }
  if (!status) {
    throw new ValidacaoErro(
      'O Campo status é obrigatório! Por favor, preencha o campo!',
      400,
      'status',
    );
  }

  if (enderecos.length === 0) {
    throw new ValidacaoErro(
      'Cadastre pelo menos um endereço para a pessoa!',
      400,
      'enderecos',
    );
  }

  if (typeof nome !== 'string') {
    throw new ValidacaoErro(
      'O campo nome deve ser preenchido corretamente! (texto)',
      400,
      'nome',
    );
  }

  if (typeof sobrenome !== 'string') {
    throw new ValidacaoErro(
      'O campo sobrenome deve ser preenchido corretamente! (texto)',
      400,
      'sobrenome',
    );
  }

  if (typeof idade !== 'number' || idade <= 0) {
    throw new ValidacaoErro(
      'O campo idade deve ser um número inteiro positivo!',
      400,
      'idade',
    );
  }

  if (typeof login !== 'string') {
    throw new ValidacaoErro(
      'O campo login deve ser preenchido corretamente! (email)',
      400,
      'login',
    );
  }

  if (typeof senha !== 'string' || senha.length > 50) {
    throw new ValidacaoErro(
      'O campo senha deve ser preenchido corretamente! (texto - max 50 caracteres)',
      400,
      'senha',
    );
  }

  if (typeof status !== 'number' || status <= 0 || status > 2) {
    throw new ValidacaoErro(
      'O campo status deve ser preenchido corretamente! (1-ativo ou 2-inativo)',
      400,
      'status',
    );
  }

  const emailRegex = /\S+@\S+\.\S+/;

  if (!emailRegex.test(login)) {
    throw new ValidacaoErro(
      'O campo login deve ser preenchido corretamente com um email válido!',
      400,
      'login',
    );
  }

  validacaoCamposIncluirEndereço(enderecos);

  next();
}
