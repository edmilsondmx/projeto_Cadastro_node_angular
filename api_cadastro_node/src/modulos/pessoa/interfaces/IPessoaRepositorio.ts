/* eslint-disable @typescript-eslint/no-explicit-any */
import Pessoa from '../entidades/Pessoa';

export default interface IPessoaRepositorio {
  incluirPessoa(pessoa: Pessoa): Promise<Pessoa[]>;
  alterarPessoa(pessoa: Pessoa): Promise<Pessoa[]>;
  listarPessoas(parametros: any): Promise<Pessoa[]>;
  buscarPorCodigo(codigoPessoa: number): Promise<Pessoa | undefined>;
  buscarPorNome(nome: string): Promise<Pessoa[]>;
  buscarPorLogin(login: string): Promise<Pessoa | undefined>;
}
