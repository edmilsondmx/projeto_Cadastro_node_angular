/* eslint-disable @typescript-eslint/no-explicit-any */
import PessoaRepositorio from '../repositorios/PessoaRepositorio';
import AppError from '@compartilhada/erros/AppError';
import Pessoa from '../entidades/Pessoa';
import IPessoaServico from '../interfaces/IPessoaServico';
import BairroRepositorio from '@modulos/bairro/repositorios/BairroRepositorio';
import EnderecoRepositorio from '../repositorios/EnderecoRepositorio';

export default class PessoaServico implements IPessoaServico {
  private pessoaRepositorio: PessoaRepositorio;
  private bairroRepositorio: BairroRepositorio;
  private enderecoRepositorio: EnderecoRepositorio;

  constructor() {
    this.pessoaRepositorio = new PessoaRepositorio();
    this.bairroRepositorio = new BairroRepositorio();
    this.enderecoRepositorio = new EnderecoRepositorio();
    this.incluirPessoa = this.incluirPessoa.bind(this);
    this.listarPessoas = this.listarPessoas.bind(this);
    this.alterarPessoa = this.alterarPessoa.bind(this);
    this.excluirPessoa = this.excluirPessoa.bind(this);
  }

  public async incluirPessoa(pessoa: Pessoa): Promise<Pessoa[]> {
    await this.validarPessoa(pessoa, 'incluir');

    const listaPessoas = await this.pessoaRepositorio.incluirPessoa(pessoa);

    return listaPessoas;
  }

  public async listarPessoas(parametros: any): Promise<Pessoa | Pessoa[]> {
    const pessoas = await this.pessoaRepositorio.listarPessoas(parametros);

    const listaPesoas = this.definirRetorno(parametros, pessoas);

    return listaPesoas;
  }

  public async alterarPessoa(pessoa: Pessoa): Promise<Pessoa[]> {
    await this.validarPessoa(pessoa, 'alterar');

    const listaPessoas = await this.pessoaRepositorio.alterarPessoa(pessoa);

    return listaPessoas;
  }

  public async excluirPessoa(codigoPessoa: number): Promise<Pessoa[]> {
    if (isNaN(codigoPessoa) || codigoPessoa <= 0) {
      throw new AppError(
        'O código do bairro deve ser um número inteiro positivo!',
        400,
      );
    }

    const pessoaExistente = await this.pessoaRepositorio.buscarPorCodigo(
      codigoPessoa,
    );
    if (!pessoaExistente) {
      throw new AppError(
        'Não foi possível excluir. Pessoa não encontrada',
        404,
      );
    }

    const listaPessoas = await this.pessoaRepositorio.excluirPessoa(
      codigoPessoa,
    );

    return listaPessoas;
  }

  private async validarPessoa(pessoa: Pessoa, acao: string): Promise<void> {
    if (acao === 'incluir') {
      const pessoaExistente = await this.pessoaRepositorio.buscarPorLogin(
        pessoa.login,
      );
      if (pessoaExistente) {
        throw new AppError(
          `Não foi possível cadastrar a Pessoa: ${pessoa.nome.toUpperCase()} ${pessoa.sobrenome.toUpperCase()}. Já existe um registro cadastrado com o login: ${
            pessoa.login
          }!`,
          400,
        );
      }
    }

    if (acao === 'alterar') {
      const pessoaExistente = await this.pessoaRepositorio.buscarPorCodigo(
        pessoa.codigoPessoa,
      );
      if (!pessoaExistente) {
        throw new AppError(
          `Não foi possível alterar a Pessoa: ${pessoa.nome.toUpperCase()} ${pessoa.sobrenome.toUpperCase()}. Não existe um registro com esse código!`,
          404,
        );
      }

      const pessoaExistenteLogin = await this.pessoaRepositorio.buscarPorLogin(
        pessoa.login,
      );
      if (
        pessoaExistenteLogin &&
        pessoaExistenteLogin.codigoPessoa !== pessoa.codigoPessoa
      ) {
        throw new AppError(
          `Não foi possível alterar a Pessoa: ${pessoa.nome.toUpperCase()} ${pessoa.sobrenome.toUpperCase()}. Já existe um registro cadastrado com esse login!`,
          400,
        );
      }

      for (const endereco of pessoa.enderecos) {
        if (endereco.codigoPessoa !== pessoa.codigoPessoa) {
          throw new AppError(
            `Não foi possível ${acao} a Pessoa: ${pessoa.nome.toUpperCase()} ${pessoa.sobrenome.toUpperCase()}. O endereço informado não pertence a essa pessoa! Verifique o campo codigoPessoa do endereço!`,
            400,
          );
        }
      }
    }

    for (const endereco of pessoa.enderecos) {
      const bairroExistente = await this.bairroRepositorio.buscarPorCodigo(
        endereco.codigoBairro,
      );
      if (!bairroExistente) {
        throw new AppError(
          `Não foi possível ${acao} a Pessoa: ${pessoa.nome.toUpperCase()} ${pessoa.sobrenome.toUpperCase()}. Não existe um registro de Bairro com o código: ${
            endereco.codigoBairro
          }!`,
          404,
        );
      }

      if (bairroExistente && bairroExistente.status === 2) {
        throw new AppError(
          `Não foi possível ${acao} a Pessoa: ${pessoa.nome.toUpperCase()} ${pessoa.sobrenome.toUpperCase()}. Não é possível ${acao} um endereço para um bairro inativo!`,
          400,
        );
      }
    }
  }

  private definirRetorno(
    parametros: any,
    pessoas: Pessoa[],
  ): Pessoa | Pessoa[] {
    if (parametros?.codigoPessoa) {
      return pessoas[0] || [];
    }

    return pessoas;
  }
}
