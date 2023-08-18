import { Request, Response } from 'express';
import LoginServico from '../servicos/LoginServico';

export default class LoginController {
  public async gerarToken(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { login, senha } = request.body;

    const loginServico = new LoginServico();

    const token = await loginServico.gerarToken({
      login,
      senha,
    });

    return response.status(200).json(token);
  }
}
