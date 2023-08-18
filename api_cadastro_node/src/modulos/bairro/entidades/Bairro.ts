export default class Bairro {
  codigoBairro: number;
  codigoMunicipio: number;
  nome: string;
  status: number;

  constructor(
    codigoBairro: number,
    codigoMunicipio: number,
    nome: string,
    status: number,
  ) {
    this.codigoBairro = codigoBairro;
    this.codigoMunicipio = codigoMunicipio;
    this.nome = nome;
    this.status = status;
  }
}
