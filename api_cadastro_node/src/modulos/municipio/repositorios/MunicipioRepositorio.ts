/* eslint-disable @typescript-eslint/no-explicit-any */
import Municipio from '../entidades/Municipio';
import IMunicipioRepositorio from '../interfaces/IMunicipioRepositorio';
import Conexao from '@compartilhada/banco/conexao';
import BancoDadosErro from '@compartilhada/erros/BancoDadosErro';

const conexao = new Conexao();

export default class MunicipioRepositorio implements IMunicipioRepositorio {
  public async incluirMunicipio(municipio: Municipio): Promise<Municipio[]> {
    try {
      const sql = `INSERT INTO tb_municipio (codigo_municipio, codigo_uf, nome, status) VALUES (:codigoMunicipio, :codigoUF, :nome, :status)`;

      await conexao.conectar();

      const codigo_municipio: number = await conexao.gerarSequencia(
        'SEQUENCE_MUNICIPIO',
      );

      municipio.codigoMunicipio = codigo_municipio;
      municipio.nome = municipio.nome.toUpperCase();

      const bind: any = municipio;

      await conexao.executar(sql, bind);
      await conexao.commitar();

      const municipios = await this.listarMunicipios();

      return municipios;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('incluir', 'Município');
    } finally {
      await conexao.desconectar();
    }
  }

  public async alterarMunicipio(municipio: Municipio): Promise<Municipio[]> {
    try {
      await this.alterarStatusEmCascata(
        municipio.codigoMunicipio,
        municipio.status,
      );

      const sql = `UPDATE tb_municipio SET codigo_uf = :codigoUF, nome = :nome, status = :status WHERE codigo_municipio = :codigoMunicipio`;

      await conexao.conectar();

      municipio.nome = municipio.nome.toUpperCase();

      const bind: any = municipio;

      await conexao.executar(sql, bind);
      await conexao.commitar();

      const municipios = await this.listarMunicipios();

      return municipios;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('alterar', 'Município');
    } finally {
      await conexao.desconectar();
    }
  }

  public async excluirMunicipio(municipio: Municipio): Promise<Municipio[]> {
    try {
      await conexao.conectar();

      const bind: any = { codigoMunicipio: municipio.codigoMunicipio };

      //Excluir endereços relacionados aos bairros do Municipio selecionado
      const sqlDeleteEnderecos = `DELETE FROM tb_endereco WHERE codigo_bairro IN ( SELECT codigo_bairro FROM tb_bairro WHERE codigo_municipio = :codigoMunicipio) `;
      await conexao.executar(sqlDeleteEnderecos, bind);

      //Excluir bairros do Municipio selecionado
      const sqlDeleteBairros = `DELETE FROM tb_bairro WHERE codigo_municipio = :codigoMunicipio`;
      await conexao.executar(sqlDeleteBairros, bind);

      //Excluir Municipio selecionado
      const sqlDeleteMunicipio = `DELETE FROM tb_municipio WHERE codigo_municipio = :codigoMunicipio`;
      await conexao.executar(sqlDeleteMunicipio, bind);

      await conexao.commitar();

      const municipios = await this.listarMunicipios();

      return municipios;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('excluir', 'Município');
    } finally {
      await conexao.desconectar();
    }
  }

  public async listarMunicipios(parametros: any = {}): Promise<Municipio[]> {
    try {
      const { codigoMunicipio, codigoUF, nome, status } = parametros;

      let sql = `SELECT * FROM tb_municipio WHERE 1 = 1`;
      const binds: any = {};

      if (codigoMunicipio) {
        sql += ` AND codigo_municipio = :codigoMunicipio`;
        binds.codigoMunicipio = codigoMunicipio;
      }

      if (codigoUF) {
        sql += ` AND codigo_uf = :codigoUF`;
        binds.codigoUF = codigoUF;
      }

      if (nome) {
        sql += ` AND nome = :nome`;
        binds.nome = nome.toUpperCase();
      }

      if (status) {
        sql += ` AND status = :status`;
        binds.status = status;
      }

      sql += ` ORDER BY codigo_municipio DESC`;

      await conexao.conectar();

      const result: any = await conexao.executar(sql, binds);

      const municipios: Municipio[] = result.rows.map(
        (row: any) => new Municipio(row[0], row[1], row[2], row[3]),
      );

      return municipios;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('listar', 'Municípios');
    } finally {
      await conexao.desconectar();
    }
  }

  public async buscarPorCodigo(
    codigoMunicipio: number,
  ): Promise<Municipio | undefined> {
    try {
      const sql = `SELECT * FROM tb_municipio WHERE codigo_municipio = :codigoMunicipio`;

      await conexao.conectar();

      const binds = { codigoMunicipio };

      const result: any = await conexao.executar(sql, binds);

      const municipios: Municipio = result.rows.map(
        (row: any[]) => new Municipio(row[0], row[1], row[2], row[3]),
      )[0];

      return municipios;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('buscar', 'Município pelo código');
    } finally {
      await conexao.desconectar();
    }
  }

  public async buscarPorNome(nome: string): Promise<Municipio | undefined> {
    try {
      const sql = `SELECT codigo_municipio, codigo_uf, nome, status FROM tb_municipio WHERE nome = :nome`;

      await conexao.conectar();

      const binds = { nome: nome.toUpperCase() };

      const result: any = await conexao.executar(sql, binds);

      const municipios: Municipio[] = result.rows.map(
        (row: any[]) => new Municipio(row[0], row[1], row[2], row[3]),
      );

      return municipios[0];
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('buscar', 'Município pelo nome');
    } finally {
      await conexao.desconectar();
    }
  }

  public async alterarStatusEmCascata(
    codigoMunicipio: number,
    status: number,
  ): Promise<void> {
    try {
      await conexao.conectar();

      const bind: any = { codigoMunicipio, status };

      // Alterar status dos bairros dos municípios da UF selecionada
      const sqlUpdateBairros = `UPDATE tb_bairro SET status = :status WHERE codigo_municipio = :codigoMunicipio`;

      await conexao.executar(sqlUpdateBairros, bind);

      await conexao.commitar();
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('alterar', 'Status do Município');
    } finally {
      await conexao.desconectar();
    }
  }
}
