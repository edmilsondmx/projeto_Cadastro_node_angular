export default class UF {
  codigoMunicipio: number;
  codigoUF: number;
  nome: string;
  status: number;

  constructor(
    codigoMunicipio: number,
    codigoUF: number,
    nome: string,
    status: number,
  ) {
    this.codigoMunicipio = codigoMunicipio;
    this.codigoUF = codigoUF;
    this.nome = nome;
    this.status = status;
  }
}
