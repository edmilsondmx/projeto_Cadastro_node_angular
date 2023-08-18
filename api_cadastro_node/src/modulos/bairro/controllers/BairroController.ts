import { Request, Response } from 'express';
import Bairro from '../entidades/Bairro';
import BairroServico from '../servicos/BairroServico';

export default class BairroController {
  private bairroServico: BairroServico;

  constructor() {
    this.bairroServico = new BairroServico();
    this.incluirBairro = this.incluirBairro.bind(this);
    this.listarBairros = this.listarBairros.bind(this);
    this.alterarBairro = this.alterarBairro.bind(this);
    this.excluirBairro = this.excluirBairro.bind(this);
  }

  public async incluirBairro(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { codigoMunicipio, nome, status } = request.body;

    const listaBairros = await this.bairroServico.incluirBairro(
      new Bairro(0, codigoMunicipio, nome, status),
    );

    return response.status(200).json(listaBairros);
  }

  public async listarBairros(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const parametros = request.query;

    const bairros = await this.bairroServico.listarBairros(parametros);

    return response.status(200).json(bairros);
  }

  public async alterarBairro(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { codigoBairro, codigoMunicipio, nome, status } = request.body;

    const listaBairros = await this.bairroServico.alterarBairro(
      new Bairro(codigoBairro, codigoMunicipio, nome, status),
    );

    return response.status(200).json(listaBairros);
  }

  public async excluirBairro(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { codigoBairro } = request.params;

    const listaBairros = await this.bairroServico.excluirBairro(
      Number(codigoBairro),
    );

    return response.status(200).json(listaBairros);
  }
}
