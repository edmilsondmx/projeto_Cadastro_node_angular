/* eslint-disable @typescript-eslint/no-explicit-any */
import Endereco from '../entidades/Endereco';
import IEnderecoRepositorio from '../interfaces/IEnderecoRepositorio';
import Conexao from '@compartilhada/banco/conexao';
import UF from '@modulos/uf/entidades/UF';
import EnderecoVO from '../vo/EnderecoVO';
import BairroVO from '@modulos/bairro/entidades/BairroVO';
import MunicipioVO from '@modulos/municipio/entidades/MunicipioVO';
import BancoDadosErro from '@compartilhada/erros/BancoDadosErro';

const conexao = new Conexao();

export default class EnderecoRepositorio implements IEnderecoRepositorio {
  public async listarEnderecos(
    codigoPessoa: number,
    conexao: Conexao,
  ): Promise<EnderecoVO[]> {
    try {
      const sql = `SELECT
        e.*,
        b.codigo_bairro,
        b.codigo_municipio,
        b.nome,
        b.status,
        m.codigo_municipio,
        m.codigo_uf,
        m.nome,
        m.status,
        u.codigo_uf,
        u.sigla,
        u.nome,
        u.status
      FROM
        tb_endereco e
      INNER JOIN
        tb_bairro b ON e.codigo_bairro = b.codigo_bairro
      INNER JOIN
        tb_municipio m ON b.codigo_municipio = m.codigo_municipio
      INNER JOIN
        tb_uf u ON m.codigo_uf = u.codigo_uf
      WHERE
        e.codigo_pessoa = :codigoPessoa ORDER BY e.codigo_endereco DESC`;

      const binds = { codigoPessoa };

      const result: any = await conexao.executar(sql, binds);

      const endereco: EnderecoVO[] = result.rows.map((linha: any) => {
        const uf = new UF(linha[15], linha[16], linha[17], linha[18]);
        const municipio = new MunicipioVO(
          linha[11],
          linha[12],
          linha[13],
          linha[14],
          uf,
        );
        const bairro = new BairroVO(
          linha[7],
          linha[8],
          linha[9],
          linha[10],
          municipio,
        );

        const endereco = new EnderecoVO(
          linha[0],
          linha[1],
          linha[2],
          linha[3],
          linha[4],
          linha[5],
          linha[6],
          bairro,
        );

        return endereco;
      });

      return endereco;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('listar', 'Endereços');
    }
  }

  public async excluirEndereco(
    codigoEndereco: number,
    conexao: Conexao,
  ): Promise<void> {
    try {
      const sql = `DELETE FROM tb_endereco WHERE codigo_endereco = :codigoEndereco`;

      const binds = { codigoEndereco };

      await conexao.executar(sql, binds);
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('excluir', 'Endereço');
    }
  }

  public async excluirEnderecoPeloCodigoPessoa(
    codigoPessoa: number,
    conexao: Conexao,
  ): Promise<void> {
    try {
      const sql = `DELETE FROM tb_endereco WHERE codigo_pessoa = :codigoPessoa`;

      const binds = { codigoPessoa };

      await conexao.executar(sql, binds);
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('excluir', 'Endereço');
    }
  }

  public async alterarEndereco(
    endereco: Endereco,
    conexao: Conexao,
  ): Promise<void> {
    try {
      const sqlEndereco = `UPDATE tb_endereco SET codigo_bairro = :codigoBairro, nome_rua = :nomeRua, numero = :numero, complemento = :complemento, cep = :cep WHERE codigo_endereco = :codigoEndereco`;

      const binds = {
        codigoBairro: endereco.codigoBairro,
        nomeRua: endereco.nomeRua,
        numero: endereco.numero,
        complemento: endereco.complemento,
        cep: endereco.cep,
        codigoEndereco: endereco.codigoEndereco,
      };

      await conexao.executar(sqlEndereco, binds);
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('alterar', 'Endereço');
    }
  }

  public async incluirEndereco(
    endereco: Endereco,
    codigoPessoa: number,
    conexao: Conexao,
  ): Promise<void> {
    try {
      const sqlEndereco = `INSERT INTO tb_endereco (codigo_endereco, codigo_pessoa, codigo_bairro, nome_rua, numero, complemento, cep) VALUES (:codigoEndereco, :codigoPessoa, :codigoBairro, :nomeRua, :numero, :complemento, :cep)`;

      const sequenciaEndereco: number = await conexao.gerarSequencia(
        'SEQUENCE_ENDERECO',
      );

      const codigoEndereco = sequenciaEndereco;

      const bindsEndereco: any = {
        codigoEndereco: codigoEndereco,
        codigoPessoa: codigoPessoa,
        codigoBairro: endereco.codigoBairro,
        nomeRua: endereco.nomeRua,
        numero: endereco.numero,
        complemento: endereco.complemento,
        cep: endereco.cep,
      };

      await conexao.executar(sqlEndereco, bindsEndereco);
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('incluir', 'Endereço');
    }
  }

  public async buscarPorCodigo(codigoEndereco: number): Promise<Endereco> {
    try {
      const sql = `SELECT * FROM tb_endereco WHERE codigo_endereco = :codigoEndereco`;
      const binds = { codigoEndereco };

      await conexao.conectar();

      const result: any = await conexao.executar(sql, binds);

      const endereco: Endereco = result.rows.map(
        (linha: any) =>
          new Endereco(
            linha[0],
            linha[1],
            linha[2],
            linha[3],
            linha[4],
            linha[5],
            linha[6],
          ),
      )[0];

      return endereco;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('buscar', 'Endereço por código');
    } finally {
      await conexao.desconectar();
    }
  }
}
