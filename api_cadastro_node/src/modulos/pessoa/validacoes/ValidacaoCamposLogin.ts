import ValidacaoErro from '@compartilhada/erros/ValidacaoErro';
import { Request, Response, NextFunction } from 'express';

interface ILogin {
  login: string;
  senha: string;
}

export default function validacaoCamposLogin(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { login, senha }: ILogin = request.body;

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

  if (typeof login !== 'string') {
    throw new ValidacaoErro(
      'O campo login deve ser preenchido corretamente! (email)',
      400,
      'login',
    );
  }

  if (typeof senha !== 'string') {
    throw new ValidacaoErro(
      'O campo senha deve ser preenchido corretamente! (texto)',
      400,
      'senha',
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

  return next();
}
