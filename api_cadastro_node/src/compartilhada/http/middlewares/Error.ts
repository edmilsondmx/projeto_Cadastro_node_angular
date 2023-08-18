/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import AppError from '@compartilhada/erros/AppError';
import ValidacaoErro from '@compartilhada/erros/ValidacaoErro';
import BancoDadosErro from '@compartilhada/erros/BancoDadosErro';

export default function error(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
): Response {
  if (error instanceof AppError) {
    return response
      .status(error.statusCode)
      .json({ mensagem: error.message, status: error.statusCode });
  }
  if (error instanceof ValidacaoErro) {
    return response.status(error.statusCode).json({
      mensagem: error.mensagem,
      status: error.statusCode,
      campo: error.campo,
    });
  }
  if (error instanceof BancoDadosErro) {
    return response.status(error.statusCode).json({
      mensagem: error.message(),
      status: error.statusCode,
    });
  }
  return response.status(500).json({
    mensagem: 'Erro interno do servidor!',
    status: 500,
  });
}
