import ValidacaoErro from '@compartilhada/erros/ValidacaoErro';
import { Request, Response, NextFunction } from 'express';

interface IQuery {
  codigoMunicipio?: number;
  nome?: string;
  codigoUF?: number;
  status?: number;
}

export default function validacaoQueryParamsMunicipio(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { codigoMunicipio, nome, codigoUF, status }: IQuery = request.query;

  if (
    (codigoMunicipio && isNaN(Number(codigoMunicipio))) ||
    (codigoMunicipio && codigoMunicipio <= 0)
  ) {
    throw new ValidacaoErro(
      'O Campo codigoMunicipio deve ser um número inteiro positivo!',
      400,
      'codigoMunicipio',
    );
  }

  if (nome && !isNaN(Number(nome))) {
    throw new ValidacaoErro(
      'O campo nome deve ser preenchido corretamente! (texto)',
      400,
      'nome',
    );
  }

  if ((codigoUF && isNaN(Number(codigoUF))) || (codigoUF && codigoUF <= 0)) {
    throw new ValidacaoErro(
      'O Campo codigoUF deve ser um número inteiro positivo!',
      400,
      'codigoUF',
    );
  }

  if (
    (status && isNaN(Number(status))) ||
    (status && status < 1) ||
    (status && status > 2)
  ) {
    throw new ValidacaoErro(
      'O Campo status deve ser preenchido corretamente! (1-ativo ou 2-inativo)',
      400,
      'status',
    );
  }

  next();
}
