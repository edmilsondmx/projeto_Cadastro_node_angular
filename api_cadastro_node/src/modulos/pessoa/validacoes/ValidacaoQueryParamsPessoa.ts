import ValidacaoErro from '@compartilhada/erros/ValidacaoErro';
import { Request, Response, NextFunction } from 'express';

interface IQuery {
  codigoPessoa?: number;
  login?: string;
  status?: number;
  nome?: string;
  codigoUF?: number;
}

export default function validacaoQueryParamsPessoa(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { codigoPessoa, login, status, nome, codigoUF }: IQuery = request.query;

  if (
    (codigoPessoa && isNaN(Number(codigoPessoa))) ||
    (codigoPessoa && codigoPessoa <= 0)
  ) {
    throw new ValidacaoErro(
      'O Campo codigoPessoa deve ser um número inteiro positivo!',
      400,
      'codigoPessoa',
    );
  }

  if (login && !isNaN(Number(login))) {
    throw new ValidacaoErro(
      'O campo login deve ser preenchido corretamente! (email)',
      400,
      'login',
    );
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (login && !emailRegex.test(login)) {
    throw new ValidacaoErro(
      'O campo login deve ser preenchido corretamente com um email válido!',
      400,
      'login',
    );
  }

  if (
    (status && isNaN(Number(status))) ||
    (status && status < 1) ||
    (status && status > 2)
  ) {
    throw new ValidacaoErro(
      'O campo status deve ser preenchido corretamente! (1-ativo ou 2-inativo)',
      400,
      'status',
    );
  }

  if (nome && !isNaN(Number(nome))) {
    throw new ValidacaoErro(
      'O campo nome deve ser preenchido corretamente! (texto)',
      400,
      'nome',
    );
  }

  if (codigoUF && isNaN(Number(codigoUF))) {
    throw new ValidacaoErro(
      'O campo codigoUF deve ser um número inteiro positivo!',
      400,
      'codigoUF',
    );
  }

  next();
}
