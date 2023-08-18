import { Request, Response } from 'express';
import Pessoa from '../entidades/Pessoa';
import PessoaServico from '../servicos/PessoaServico';
import PessoaVO from '../vo/PessoaVO';

export default class PessoaController {
  private pessoaServico: PessoaServico;

  constructor() {
    this.pessoaServico = new PessoaServico();
    this.incluirPessoa = this.incluirPessoa.bind(this);
    this.listarPessoas = this.listarPessoas.bind(this);
    this.alterarPessoa = this.alterarPessoa.bind(this);
    this.excluirPessoa = this.excluirPessoa.bind(this);
  }

  public async incluirPessoa(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { nome, sobrenome, idade, login, senha, status, enderecos }: Pessoa =
      request.body;

    const listaPessoas = await this.pessoaServico.incluirPessoa(
      new Pessoa(0, nome, sobrenome, idade, login, senha, status, enderecos),
    );

    const pessoasVO = listaPessoas.map((pessoa: Pessoa) => {
      return PessoaVO.mapearPessoaVO(pessoa);
    });

    return response.status(200).json(pessoasVO);
  }

  public async listarPessoas(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const parametros = request.query;

    const pessoas = PessoaVO.mapearPessoaVO(
      await this.pessoaServico.listarPessoas(parametros),
    );

    return response.status(200).json(pessoas);
  }

  public async alterarPessoa(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      codigoPessoa,
      nome,
      sobrenome,
      idade,
      login,
      senha,
      status,
      enderecos,
    } = request.body;

    const listaPessoas = await this.pessoaServico.alterarPessoa(
      new Pessoa(
        codigoPessoa,
        nome,
        sobrenome,
        idade,
        login,
        senha,
        status,
        enderecos,
      ),
    );

    const pessoasVO = listaPessoas.map((pessoa: Pessoa) => {
      return PessoaVO.mapearPessoaVO(pessoa);
    });

    return response.status(200).json(pessoasVO);
  }

  public async excluirPessoa(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { codigoPessoa } = request.params;

    const listaPessoas = await this.pessoaServico.excluirPessoa(
      Number(codigoPessoa),
    );

    const pessoasVO = listaPessoas.map((pessoa: Pessoa) => {
      return PessoaVO.mapearPessoaVO(pessoa);
    });

    return response.status(200).json(pessoasVO);
  }
}
