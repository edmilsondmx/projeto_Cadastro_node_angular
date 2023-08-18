/* eslint-disable @typescript-eslint/no-explicit-any */
import Bairro from '../entidades/Bairro';

export default interface IBairroRepositorio {
  incluirBairro(bairro: Bairro): Promise<Bairro[]>;
  alterarBairro(bairro: Bairro): Promise<Bairro[]>;
  listarBairros(parametros: any): Promise<Bairro[]>;
  buscarPorCodigo(codigoBairro: number): Promise<Bairro | undefined>;
  buscarPorNome(nome: string): Promise<Bairro[] | undefined>;
}
