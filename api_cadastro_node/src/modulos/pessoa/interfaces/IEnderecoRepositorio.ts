import Conexao from '@compartilhada/banco/conexao';
import Endereco from '../entidades/Endereco';
import EnderecoVO from '../vo/EnderecoVO';

export default interface IEnderecoRepositorio {
  incluirEndereco(
    endereco: Endereco,
    codigoPessoa: number,
    conexao: Conexao,
  ): Promise<void>;
  alterarEndereco(endereco: Endereco, conexao: Conexao): Promise<void>;
  listarEnderecos(
    codigoPessoa: number,
    conexao: Conexao,
  ): Promise<EnderecoVO[]>;
  excluirEndereco(codigoEndereco: number, conexao: Conexao): Promise<void>;
}
