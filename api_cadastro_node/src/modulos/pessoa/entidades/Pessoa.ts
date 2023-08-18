import Endereco from './Endereco';

export default class Pessoa {
  codigoPessoa: number;
  nome: string;
  sobrenome: string;
  idade: number;
  login: string;
  senha: string;
  status: number;
  enderecos: Endereco[] = [];

  constructor(
    codigoPessoa: number,
    nome: string,
    sobrenome: string,
    idade: number,
    login: string,
    senha: string,
    status: number,
    enderecos: Endereco[],
  ) {
    this.codigoPessoa = codigoPessoa;
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.idade = idade;
    this.login = login;
    this.senha = senha;
    this.status = status;
    this.enderecos = enderecos;
  }
}
