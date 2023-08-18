/* eslint-disable @typescript-eslint/no-explicit-any */
import UF from '../entidades/UF';

export default interface IUfRepositorio {
  incluirUF(uf: UF): Promise<UF[]>;
  alterarUF(uf: UF): Promise<UF[]>;
  excluirUF(uf: UF): Promise<UF[]>;
  listarUFs(parametros?: any): Promise<UF[]>;
  buscarPorCodigo(codigoUf: number): Promise<UF | undefined>;
  buscarPorNome(nome: string, sigla: string): Promise<UF | undefined>;
}
