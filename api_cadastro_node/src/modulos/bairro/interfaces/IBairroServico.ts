/* eslint-disable @typescript-eslint/no-explicit-any */
import Bairro from '../entidades/Bairro';

export default interface IBairroServico {
  incluirBairro(bairro: Bairro): Promise<Bairro[]>;
  listarBairros(parametros: any): Promise<Bairro[] | Bairro>;
  alterarBairro(bairro: Bairro): Promise<Bairro[]>;
}
