/* eslint-disable @typescript-eslint/no-explicit-any */
import Municipio from '../entidades/Municipio';

export default interface IMunicipioRepositorio {
  incluirMunicipio(municipio: Municipio): Promise<Municipio[]>;
  alterarMunicipio(municipio: Municipio): Promise<Municipio[]>;
  listarMunicipios(parametros: any): Promise<Municipio[]>;
  buscarPorCodigo(codigoMunicipio: number): Promise<Municipio | undefined>;
  buscarPorNome(nome: string): Promise<Municipio | undefined>;
}
