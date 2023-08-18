import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@compartilhada/erros/AppError';
import PessoaRepositorio from '../repositorios/PessoaRepositorio';

interface IRequest {
  login: string;
  senha: string;
}

interface IResponse {
  token: string;
}

export default class LoginServico {
  public async gerarToken({ login, senha }: IRequest): Promise<IResponse> {
    const pessoaRepositorio = new PessoaRepositorio();

    const pessoa = await pessoaRepositorio.buscarPorLogin(login);

    if (!pessoa) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    const senhaCorreta: boolean = pessoa.senha === senha;

    if (!senhaCorreta) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: String(pessoa.codigoPessoa),
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { token };
  }
}
