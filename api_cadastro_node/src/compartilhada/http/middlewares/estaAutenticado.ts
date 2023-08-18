import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import AppError from '@compartilhada/erros/AppError';
import authConfig from '@config/auth';

export default function estaAutenticado(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new AppError('Token não informado. Faça Login para continuar!', 401);
  }

  const [, token] = authorization.split(' ');

  try {
    verify(token, authConfig.jwt.secret);

    return next();
  } catch {
    throw new AppError('Token inválido. Forneça um token válido!', 401);
  }
}
