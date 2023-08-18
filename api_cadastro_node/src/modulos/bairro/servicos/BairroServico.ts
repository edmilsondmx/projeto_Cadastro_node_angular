/* eslint-disable @typescript-eslint/no-explicit-any */
import MunicipioRepositorio from '@modulos/municipio/repositorios/MunicipioRepositorio';
import Bairro from '../entidades/Bairro';
import IBairroServico from '../interfaces/IBairroServico';
import BairroRepositorio from '../repositorios/BairroRepositorio';
import AppError from '@compartilhada/erros/AppError';

export default class BairroServico implements IBairroServico {
  private bairroRepositorio: BairroRepositorio;
  private municipioRepositorio: MunicipioRepositorio;

  constructor() {
    this.bairroRepositorio = new BairroRepositorio();
    this.municipioRepositorio = new MunicipioRepositorio();
    this.incluirBairro = this.incluirBairro.bind(this);
    this.listarBairros = this.listarBairros.bind(this);
    this.alterarBairro = this.alterarBairro.bind(this);
    this.excluirBairro = this.excluirBairro.bind(this);
  }

  public async incluirBairro(bairro: Bairro): Promise<Bairro[]> {
    await this.validarBairro(bairro, 'incluir');

    const listaBairros = await this.bairroRepositorio.incluirBairro(bairro);

    return listaBairros;
  }

  public async listarBairros(parametros: any): Promise<Bairro | Bairro[]> {
    const bairros = await this.bairroRepositorio.listarBairros(parametros);

    const listaBairros = this.definirRetorno(parametros, bairros);

    return listaBairros;
  }

  public async alterarBairro(bairro: Bairro): Promise<Bairro[]> {
    await this.validarBairro(bairro, 'alterar');

    const listaBairros = await this.bairroRepositorio.alterarBairro(bairro);

    return listaBairros;
  }

  public async excluirBairro(codigoBairro: number): Promise<Bairro[]> {
    if (isNaN(codigoBairro) || codigoBairro <= 0) {
      throw new AppError(
        'O código do bairro deve ser um número inteiro positivo!',
        400,
      );
    }

    const bairroExistente = await this.bairroRepositorio.buscarPorCodigo(
      codigoBairro,
    );
    if (!bairroExistente) {
      throw new AppError(
        'Não foi possível excluir. Bairro não encontrado',
        404,
      );
    }

    const listaBairros = await this.bairroRepositorio.excluirBairro(
      bairroExistente,
    );

    return listaBairros;
  }

  private async validarBairro(bairro: Bairro, acao: string): Promise<void> {
    if (acao === 'incluir') {
      const bairroExistenteNome = await this.bairroRepositorio.buscarPorNome(
        bairro.nome,
      );
      if (bairroExistenteNome) {
        bairroExistenteNome.forEach(bair => {
          if (bair.codigoMunicipio === bairro.codigoMunicipio) {
            throw new AppError(
              `Não foi possível cadastrar o Bairro: ${bairro.nome.toUpperCase()}. Já existe um registro cadastrado com esse nome no município!`,
              400,
            );
          }
        });
      }
    }

    if (acao === 'alterar') {
      const bairroExistenteCodigo =
        await this.bairroRepositorio.buscarPorCodigo(bairro.codigoBairro);
      if (!bairroExistenteCodigo) {
        throw new AppError(
          `Não foi possível alterar o Bairro: ${bairro.nome.toUpperCase()}. Não existe um registro cadastrado com esse código!`,
          404,
        );
      }

      const bairroExistenteNome = await this.bairroRepositorio.buscarPorNome(
        bairro.nome,
      );
      if (bairroExistenteNome) {
        bairroExistenteNome.forEach(bair => {
          if (
            bair.codigoMunicipio === bairro.codigoMunicipio &&
            bair.codigoBairro !== bairro.codigoBairro
          ) {
            throw new AppError(
              `Não foi possível alterar o Bairro: ${bairro.nome.toUpperCase()}. Já existe um registro cadastrado com esse nome no município!`,
              400,
            );
          }
        });
      }
    }

    const municipioExistenteCodigo =
      await this.municipioRepositorio.buscarPorCodigo(bairro.codigoMunicipio);
    if (!municipioExistenteCodigo) {
      throw new AppError(
        `Não foi possível ${acao} o Bairro: ${bairro.nome.toUpperCase()}. Não existe um registro de Município com esse código!`,
        404,
      );
    }

    if (municipioExistenteCodigo && municipioExistenteCodigo.status === 2) {
      throw new AppError(
        `Não foi possível ${acao} o Bairro: ${bairro.nome.toUpperCase()}. Não é possível cadastrar um Bairro para um município inativo!`,
        400,
      );
    }
  }

  private definirRetorno(
    parametros: any,
    bairros: Bairro[],
  ): Bairro | Bairro[] {
    if (parametros?.codigoBairro) {
      return bairros[0] || [];
    }

    if (parametros?.codigoMunicipio && parametros?.nome) {
      return bairros[0] || [];
    }

    return bairros;
  }
}
