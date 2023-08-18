/* eslint-disable @typescript-eslint/no-explicit-any */
import UFRepositorio from '@modulos/uf/repositorios/UFRepositorio';
import Municipio from '../entidades/Municipio';
import IMunicipioServico from '../interfaces/IMunicipioServico';
import MunicipioRepositorio from '../repositorios/MunicipioRepositorio';
import AppError from '@compartilhada/erros/AppError';

export default class MunicipioServico implements IMunicipioServico {
  private municipioRepositorio: MunicipioRepositorio;
  private ufRepositorio: UFRepositorio;

  constructor() {
    this.municipioRepositorio = new MunicipioRepositorio();
    this.ufRepositorio = new UFRepositorio();
    this.incluirMunicipio = this.incluirMunicipio.bind(this);
    this.listarMunicipios = this.listarMunicipios.bind(this);
    this.alterarMunicipio = this.alterarMunicipio.bind(this);
    this.excluirMunicipio = this.excluirMunicipio.bind(this);
  }

  public async incluirMunicipio(municipio: Municipio): Promise<Municipio[]> {
    await this.validarMunicipio(municipio, 'incluir');

    const listaMunicipios = await this.municipioRepositorio.incluirMunicipio(
      municipio,
    );

    return listaMunicipios;
  }

  public async listarMunicipios(
    parametros: any,
  ): Promise<Municipio[] | Municipio> {
    const municipios = await this.municipioRepositorio.listarMunicipios(
      parametros,
    );

    const listaMunicipios = this.definirRetorno(parametros, municipios);

    return listaMunicipios;
  }

  public async alterarMunicipio(municipio: Municipio): Promise<Municipio[]> {
    await this.validarMunicipio(municipio, 'alterar');

    const municipios = await this.municipioRepositorio.alterarMunicipio(
      municipio,
    );

    return municipios;
  }

  public async excluirMunicipio(codigoMunicipio: number): Promise<Municipio[]> {
    if (isNaN(codigoMunicipio) || codigoMunicipio <= 0) {
      throw new AppError(
        'O código do bairro deve ser um número inteiro positivo!',
        400,
      );
    }

    const municipioExistente = await this.municipioRepositorio.buscarPorCodigo(
      codigoMunicipio,
    );
    if (!municipioExistente) {
      throw new AppError(
        'Não foi possível excluir. Município não encontrado',
        404,
      );
    }

    const listaMunicipios = await this.municipioRepositorio.excluirMunicipio(
      municipioExistente,
    );

    return listaMunicipios;
  }

  private async validarMunicipio(
    municipio: Municipio,
    acao: string,
  ): Promise<void> {
    if (acao === 'incluir') {
      const municipioExistenteNome =
        await this.municipioRepositorio.buscarPorNome(municipio.nome);
      if (
        municipioExistenteNome &&
        municipioExistenteNome.codigoUF === municipio.codigoUF
      ) {
        throw new AppError(
          `Não foi possível cadastrar o Municipio: ${municipio.nome.toUpperCase()}. Já existe um registro cadastrado com esse nome no estado!`,
          400,
        );
      }
    }
    if (acao === 'alterar') {
      const municipioExistenteCodigo =
        await this.municipioRepositorio.buscarPorCodigo(
          municipio.codigoMunicipio,
        );
      if (!municipioExistenteCodigo) {
        throw new AppError(
          `Não foi possível alterar o Municipio: ${municipio.nome.toUpperCase()}. Não existe um registro cadastrado com esse código!`,
          404,
        );
      }

      const municipioExistenteNome =
        await this.municipioRepositorio.buscarPorNome(municipio.nome);
      if (
        municipioExistenteNome &&
        municipioExistenteNome.codigoMunicipio !== municipio.codigoMunicipio
      ) {
        throw new AppError(
          `Não foi possível alterar o Municipio: ${municipio.nome.toUpperCase()}. Já existe um registro cadastrado com esse nome no estado!`,
          400,
        );
      }
    }
    const ufExistente = await this.ufRepositorio.buscarPorCodigo(
      municipio.codigoUF,
    );
    if (!ufExistente) {
      throw new AppError(
        `Não foi possível ${acao} o Municipio: ${municipio.nome.toUpperCase()}. Não existe um registro de UF cadastrado com esse código!`,
        404,
      );
    }
    if (ufExistente && ufExistente.status === 2) {
      throw new AppError(
        `Não foi possível ${acao} o Municipio: ${municipio.nome.toUpperCase()}. Não é possível cadastrar um Municipio para um estado inativo!`,
        400,
      );
    }
  }

  private definirRetorno(
    parametros: any,
    municipios: Municipio[],
  ): Municipio[] | Municipio {
    if (parametros?.codigoMunicipio) {
      return municipios[0] || [];
    }

    return municipios;
  }
}
