/* eslint-disable @typescript-eslint/no-explicit-any */
import Pessoa from '../entidades/Pessoa';

export default interface IPessoaServico {
  incluirPessoa(pessoa: Pessoa): Promise<Pessoa[]>;
  listarPessoas(parametros: any): Promise<Pessoa[] | Pessoa>;
  alterarPessoa(pessoa: Pessoa): Promise<Pessoa[]>;
}
