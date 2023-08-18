export interface IPessoa {
  codigoPessoa: number;
  nome: string;
  sobrenome: string;
  idade: number;
  login: string;
  senha: string;
  status: number;
  enderecos: IEndereco[];
}

export interface IBairro {
  codigoBairro: number;
  codigoMunicipio: number;
  nome: string;
  status: number;
}

export interface IMunicipio {
  codigoMunicipio: number;
  codigoUF: number;
  nome: string;
  status: number;
}

export interface IUf {
  codigoUF: number;
  nome: string;
  sigla: string;
  status: number;
}

export interface IEndereco {
  codigoEndereco: number;
  codigoPessoa: number;
  codigoBairro: number;
  nomeRua: string;
  numero: string;
  complemento: string;
  cep: string;
}

export interface IModalUFInitialState {
  novaUF: IUf;
}
