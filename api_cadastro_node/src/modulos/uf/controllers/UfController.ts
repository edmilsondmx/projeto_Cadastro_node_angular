/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import UF from '../entidades/UF';
import UfServico from '../servicos/UfServico';

export default class UfController {
  private ufServico: UfServico;

  constructor() {
    this.ufServico = new UfServico();
    this.incluirUF = this.incluirUF.bind(this);
    this.alterarUF = this.alterarUF.bind(this);
    this.excluirUF = this.excluirUF.bind(this);
    this.listarUFs = this.listarUFs.bind(this);
  }

  public async incluirUF(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { sigla, nome, status } = request.body;

    const ufsRegistradas = await this.ufServico.incluirUF(
      new UF(0, sigla, nome, status),
    );

    return response.status(200).json(ufsRegistradas);
  }

  public async alterarUF(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { codigoUF, sigla, nome, status } = request.body;

    const listaUFs = await this.ufServico.alterarUF(
      new UF(codigoUF, sigla, nome, status),
    );

    return response.status(200).json(listaUFs);
  }

  public async excluirUF(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { codigoUF } = request.params;

    const listaUFs = await this.ufServico.excluirUF(Number(codigoUF));

    return response.status(200).json(listaUFs);
  }

  public async listarUFs(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const parametros = request.query;

    const ufs = await this.ufServico.listarUFs(parametros);

    return response.status(200).json(ufs);
  }
}
