import ValidacaoErro from '@compartilhada/erros/ValidacaoErro';
import { Request, Response, NextFunction } from 'express';

interface IQuery {
  codigoBairro?: number;
  codigoMunicipio?: number;
  nome?: string;
  status?: number;
}

export default function validacaoQueryParamsBairro(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { codigoBairro, codigoMunicipio, nome, status }: IQuery = request.query;

  if (
    (codigoBairro && isNaN(Number(codigoBairro))) ||
    (codigoBairro && codigoBairro <= 0)
  ) {
    throw new ValidacaoErro(
      'O Campo codigoBairro deve ser um número inteiro positivo!',
      400,
      'codigoBairro',
    );
  }

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
