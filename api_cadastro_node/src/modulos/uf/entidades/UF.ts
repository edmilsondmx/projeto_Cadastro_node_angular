export default class UF {
  codigoUF: number;
  sigla: string;
  nome: string;
  status: number;

  constructor(codigoUF: number, sigla: string, nome: string, status: number) {
    this.codigoUF = codigoUF;
    this.sigla = sigla;
    this.nome = nome;
    this.status = status;
  }
}
