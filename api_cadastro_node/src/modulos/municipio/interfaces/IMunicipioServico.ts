/* eslint-disable @typescript-eslint/no-explicit-any */
import Municipio from '../entidades/Municipio';

export default interface IMunicipioServico {
  incluirMunicipio(municipio: Municipio): Promise<Municipio[]>;
  listarMunicipios(parametros: any): Promise<Municipio[] | Municipio>;
  alterarMunicipio(municipio: Municipio): Promise<Municipio[]>;
}
