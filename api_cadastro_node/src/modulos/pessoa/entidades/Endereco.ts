export default class Endereco {
  codigoEndereco: number;
  codigoPessoa: number;
  codigoBairro: number;
  nomeRua: string;
  numero: string;
  complemento: string;
  cep: string;

  constructor(
    codigoEndereco: number,
    codigoPessoa: number,
    codigoBairro: number,
    nomeRua: string,
    numero: string,
    complemento: string,
    cep: string,
  ) {
    this.codigoEndereco = codigoEndereco;
    this.codigoPessoa = codigoPessoa;
    this.codigoBairro = codigoBairro;
    this.nomeRua = nomeRua;
    this.numero = numero;
    this.complemento = complemento;
    this.cep = cep;
  }
}
