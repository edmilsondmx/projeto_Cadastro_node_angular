/* eslint-disable @typescript-eslint/no-explicit-any */
import UF from '../entidades/UF';

export default interface UfServico {
  incluirUF(uf: UF): Promise<UF[]>;
  listarUFs(parametros?: any): Promise<UF[] | UF>;
  alterarUF(uf: UF): Promise<UF[]>;
  excluirUF(codigoUf: number): Promise<UF[]>;
}
