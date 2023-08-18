import ValidacaoErro from '@compartilhada/erros/ValidacaoErro';
import { Request, Response, NextFunction } from 'express';

interface IQuery {
  codigoUF?: number;
  nome?: string;
  sigla?: string;
  status?: number;
}

export default function validacaoQueryParamsUF(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { codigoUF, nome, sigla, status }: IQuery = request.query;

  if ((codigoUF && isNaN(Number(codigoUF))) || (codigoUF && codigoUF <= 0)) {
    throw new ValidacaoErro(
      'O Campo codigoUF deve ser um número inteiro positivo!',
      400,
      'codigoUF',
    );
  }

  if (nome && !isNaN(Number(nome))) {
    throw new ValidacaoErro(
      'O campo nome deve ser preenchido corretamente! (texto)',
      400,
      'nome',
    );
  }

  if (
    (sigla && !Number.isNaN(Number(sigla))) ||
    (sigla && sigla.length !== 2)
  ) {
    throw new ValidacaoErro(
      'O campo sigla deve ser preenchido corretamente! (XX)',
      400,
      'sigla',
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

  next();
}
