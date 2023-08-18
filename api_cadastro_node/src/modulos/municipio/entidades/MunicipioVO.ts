import UF from '@modulos/uf/entidades/UF';

export default class MunicipioVO {
  codigoMunicipio: number;
  codigoUF: number;
  nome: string;
  status: number;
  uf: UF;

  constructor(
    codigoMunicipio: number,
    codigoUF: number,
    nome: string,
    status: number,
    uf: UF,
  ) {
    this.codigoMunicipio = codigoMunicipio;
    this.codigoUF = codigoUF;
    this.nome = nome;
    this.status = status;
    this.uf = uf;
  }
}
