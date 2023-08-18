/* eslint-disable @typescript-eslint/no-explicit-any */
import UFRepositorio from '../repositorios/UFRepositorio';
import UF from '../entidades/UF';
import AppError from '@compartilhada/erros/AppError';
import IUfServico from '../interfaces/IUfServico';

export default class UfServico implements IUfServico {
  private ufRepositorio: UFRepositorio;

  constructor() {
    this.ufRepositorio = new UFRepositorio();
    this.incluirUF = this.incluirUF.bind(this);
    this.listarUFs = this.listarUFs.bind(this);
    this.alterarUF = this.alterarUF.bind(this);
    this.excluirUF = this.excluirUF.bind(this);
  }

  public async incluirUF(uf: UF): Promise<UF[]> {
    await this.validarUF(uf, 'incluir');

    const ufsRegistradas = await this.ufRepositorio.incluirUF(uf);

    return ufsRegistradas;
  }

  public async listarUFs(parametros: any): Promise<UF[] | UF> {
    const ufs = await this.ufRepositorio.listarUFs(parametros);

    const listaUFs = this.definirRetorno(parametros, ufs);

    return listaUFs;
  }

  public async alterarUF(uf: UF): Promise<UF[]> {
    await this.validarUF(uf, 'alterar');

    const ufsRegistradas = await this.ufRepositorio.alterarUF(uf);

    return ufsRegistradas;
  }

  public async excluirUF(codigoUF: number): Promise<UF[]> {
    if (isNaN(codigoUF) || codigoUF <= 0) {
      throw new AppError(
        'O código do bairro deve ser um número inteiro positivo!',
        400,
      );
    }

    const ufExistente = await this.ufRepositorio.buscarPorCodigo(codigoUF);
    if (!ufExistente) {
      throw new AppError('Não foi possível excluir. UF não encontrada', 404);
    }

    const listaUFs = await this.ufRepositorio.excluirUF(ufExistente);

    return listaUFs;
  }

  private async validarUF(uf: UF, acao: string): Promise<void> {
    if (acao === 'incluir') {
      const ufExistenteNome = await this.ufRepositorio.buscarPorNome(
        uf.nome,
        uf.sigla,
      );
      if (ufExistenteNome) {
        throw new AppError(
          `Não foi possível incluir UF: ${uf.sigla.toUpperCase()} - ${uf.nome.toUpperCase()}. Já existe um registro cadastrado com esse nome ou sigla!`,
          400,
        );
      }
    }

    if (acao === 'alterar') {
      const ufExistenteCodigo = await this.ufRepositorio.buscarPorCodigo(
        uf.codigoUF,
      );
      if (!ufExistenteCodigo) {
        throw new AppError(
          `Não foi possível alterar UF: ${uf.nome.toUpperCase()}. UF não encontrada!`,
          400,
        );
      }

      const ufExistentePorNome = await this.ufRepositorio.buscarPorNome(
        uf.nome,
        uf.sigla,
      );

      if (ufExistentePorNome && ufExistentePorNome.codigoUF !== uf.codigoUF) {
        throw new AppError(
          `Não foi possível alterar UF: ${uf.sigla.toUpperCase()} - ${uf.nome.toUpperCase()}. Já existe um registro cadastrado com esse nome ou sigla!`,
          400,
        );
      }
    }
  }

  private definirRetorno(parametros: any, ufs: UF[]): UF[] | UF {
    if (
      parametros?.status &&
      !parametros?.codigoUF &&
      !parametros?.sigla &&
      !parametros?.nome
    ) {
      return ufs;
    }

    if (parametros?.codigoUF || parametros?.sigla || parametros?.nome) {
      return ufs[0] || [];
    }

    return ufs;
  }
}
