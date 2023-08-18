import { Request, Response } from 'express';
import Municipio from '../entidades/Municipio';
import MunicipioServico from '../servicos/MunicipioServico';

export default class MunicipioController {
  private municipioServico: MunicipioServico;

  constructor() {
    this.municipioServico = new MunicipioServico();
    this.incluirMunicipio = this.incluirMunicipio.bind(this);
    this.listarMunicipios = this.listarMunicipios.bind(this);
    this.alterarMunicipio = this.alterarMunicipio.bind(this);
    this.excluirMunicipio = this.excluirMunicipio.bind(this);
  }

  public async incluirMunicipio(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { codigoUF, nome, status } = request.body;

    const listaMunicipios = await this.municipioServico.incluirMunicipio(
      new Municipio(0, codigoUF, nome, status),
    );

    return response.status(200).json(listaMunicipios);
  }

  public async listarMunicipios(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const parametros = request.query;

    const municipios = await this.municipioServico.listarMunicipios(parametros);

    return response.status(200).json(municipios);
  }

  public async alterarMunicipio(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { codigoMunicipio, codigoUF, nome, status } = request.body;

    const listaMunicipios = await this.municipioServico.alterarMunicipio(
      new Municipio(codigoMunicipio, codigoUF, nome, status),
    );

    return response.status(200).json(listaMunicipios);
  }

  public async excluirMunicipio(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { codigoMunicipio } = request.params;

    const listaMunicipios = await this.municipioServico.excluirMunicipio(
      Number(codigoMunicipio),
    );

    return response.status(200).json(listaMunicipios);
  }
}
