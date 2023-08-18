import MunicipioVO from '@modulos/municipio/entidades/MunicipioVO';

export default class BairroVO {
  codigoBairro: number;
  codigoMunicipio: number;
  nome: string;
  status: number;
  municipio: MunicipioVO;

  constructor(
    codigoBairro: number,
    codigoMunicipio: number,
    nome: string,
    status: number,
    municipio: MunicipioVO,
  ) {
    this.codigoBairro = codigoBairro;
    this.codigoMunicipio = codigoMunicipio;
    this.nome = nome;
    this.status = status;
    this.municipio = municipio;
  }
}
