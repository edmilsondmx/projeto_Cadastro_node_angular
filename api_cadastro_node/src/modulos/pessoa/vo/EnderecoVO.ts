import BairroVO from '@modulos/bairro/entidades/BairroVO';

export default class EnderecoVO {
  codigoEndereco: number;
  codigoPessoa: number;
  codigoBairro: number;
  nomeRua: string;
  numero: string;
  complemento: string;
  cep: string;
  bairro: BairroVO;

  constructor(
    codigoEndereco: number,
    codigoPessoa: number,
    codigoBairro: number,
    nomeRua: string,
    numero: string,
    complemento: string,
    cep: string,
    bairro: BairroVO,
  ) {
    this.codigoEndereco = codigoEndereco;
    this.codigoPessoa = codigoPessoa;
    this.codigoBairro = codigoBairro;
    this.nomeRua = nomeRua;
    this.numero = numero;
    this.complemento = complemento;
    this.cep = cep;
    this.bairro = bairro;
  }
}
