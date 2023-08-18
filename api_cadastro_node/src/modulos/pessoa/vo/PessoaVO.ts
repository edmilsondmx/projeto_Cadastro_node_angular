import Pessoa from '../entidades/Pessoa';
import Endereco from '../entidades/Endereco';

export default class PessoaVO {
  codigoPessoa: number;
  nome: string;
  sobrenome: string;
  idade: number;
  login: string;
  senha: string;
  status: number;
  enderecos: Endereco[];

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

  public static mapearPessoaVO(item: Pessoa | Pessoa[]): PessoaVO | PessoaVO[] {
    if (Array.isArray(item)) {
      return item.map(pessoa => {
        return new PessoaVO(
          pessoa.codigoPessoa,
          pessoa.nome,
          pessoa.sobrenome,
          pessoa.idade,
          pessoa.login,
          pessoa.senha,
          pessoa.status,
          pessoa.enderecos,
        );
      });
    } else {
      const pessoa = item as Pessoa;
      return new PessoaVO(
        pessoa.codigoPessoa,
        pessoa.nome,
        pessoa.sobrenome,
        pessoa.idade,
        pessoa.login,
        pessoa.senha,
        pessoa.status,
        pessoa.enderecos,
      );
    }
  }
}
