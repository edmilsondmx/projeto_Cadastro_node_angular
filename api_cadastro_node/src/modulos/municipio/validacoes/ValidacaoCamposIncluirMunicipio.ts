import ValidacaoErro from '@compartilhada/erros/ValidacaoErro';
import { Request, Response, NextFunction } from 'express';

interface IBody {
  codigoUF: number;
  nome: string;
  status: number;
}

export default function validacaoCamposIncluirMunicipio(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { codigoUF, nome, status }: IBody = request.body;

  if (!codigoUF) {
    throw new ValidacaoErro(
      'O Campo codigoUF é obrigatório! Por favor, preencha o campo!',
      400,
      'codigoUF',
    );
  }
  if (!nome) {
    throw new ValidacaoErro(
      'O Campo nome é obrigatório! Por favor, preencha o campo!',
      400,
      'nome',
    );
  }
  if (!status) {
    throw new ValidacaoErro(
      'O Campo status é obrigatório! Por favor, preencha o campo!',
      400,
      'status',
    );
  }

  if (typeof codigoUF !== 'number') {
    throw new ValidacaoErro(
      'O campo codigoUF deve ser um número inteiro!',
      400,
      'codigoUF',
    );
  }

  if (typeof nome !== 'string') {
    throw new ValidacaoErro(
      'O campo nome deve ser preenchido corretamente! (texto)',
      400,
      'nome',
    );
  }

  if (typeof status !== 'number' || status <= 0 || status > 2) {
    throw new ValidacaoErro(
      'O campo status deve ser preenchido corretamente! (1-ativo ou 2-inativo)',
      400,
      'status',
    );
  }

  next();
}
