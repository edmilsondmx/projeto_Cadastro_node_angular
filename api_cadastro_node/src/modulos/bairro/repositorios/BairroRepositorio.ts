/* eslint-disable @typescript-eslint/no-explicit-any */
import Bairro from '../entidades/Bairro';
import IBairroRepositorio from '../interfaces/IBairroRepositorio';
import Conexao from '@compartilhada/banco/conexao';
import BancoDadosErro from '@compartilhada/erros/BancoDadosErro';

const conexao = new Conexao();

export default class BairroRepositorio implements IBairroRepositorio {
  public async incluirBairro(bairro: Bairro): Promise<Bairro[]> {
    try {
      const sql = `INSERT INTO tb_bairro (codigo_bairro, codigo_municipio, nome, status) VALUES (:codigoBairro, :codigoMunicipio, :nome, :status)`;

      await conexao.conectar();

      const sequencia: number = await conexao.gerarSequencia('SEQUENCE_BAIRRO');

      const codigo_bairro = sequencia;

      bairro.codigoBairro = codigo_bairro;
      bairro.nome = bairro.nome.toUpperCase();

      const binds: any = bairro;

      await conexao.executar(sql, binds);
      await conexao.commitar();

      const bairros = await this.listarBairros();

      return bairros;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('incluir', 'Bairro');
    } finally {
      await conexao.desconectar();
    }
  }

  public async alterarBairro(bairro: Bairro): Promise<Bairro[]> {
    try {
      const sql = `UPDATE tb_bairro SET codigo_municipio = :codigoMunicipio, nome = :nome, status = :status WHERE codigo_bairro = :codigoBairro`;

      await conexao.conectar();

      bairro.nome = bairro.nome.toUpperCase();

      const binds: any = bairro;

      await conexao.executar(sql, binds);
      await conexao.commitar();

      const bairros = await this.listarBairros();

      return bairros;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('alterar', 'Bairro');
    } finally {
      await conexao.desconectar();
    }
  }

  public async excluirBairro(bairro: Bairro): Promise<Bairro[]> {
    try {
      await conexao.conectar();

      const bind: any = { codigoBairro: bairro.codigoBairro };

      //Excluir endereços relacionados ao bairro selecionado
      const sqlDeleteEnderecos = `DELETE FROM tb_endereco WHERE codigo_bairro = :codigoBairro`;
      await conexao.executar(sqlDeleteEnderecos, bind);

      //Excluir bairro
      const sqlDeleteBairro = `DELETE FROM tb_bairro WHERE codigo_bairro = :codigoBairro`;
      await conexao.executar(sqlDeleteBairro, bind);

      await conexao.commitar();

      const bairros = await this.listarBairros();

      return bairros;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('excluir', 'Bairro');
    } finally {
      await conexao.desconectar();
    }
  }

  public async listarBairros(parametros: any = {}): Promise<Bairro[]> {
    try {
      const { codigoBairro, codigoMunicipio, nome, status } = parametros;

      let sql = `SELECT * FROM tb_bairro WHERE 1 = 1`;
      const binds: any = {};

      if (codigoBairro) {
        sql += ` AND codigo_bairro = :codigoBairro`;
        binds.codigoBairro = codigoBairro;
      }

      if (codigoMunicipio) {
        sql += ` AND codigo_municipio = :codigoMunicipio`;
        binds.codigoMunicipio = codigoMunicipio;
      }

      if (nome) {
        sql += ` AND nome = :nome`;
        binds.nome = nome.toUpperCase();
      }

      if (status) {
        sql += ` AND status = :status`;
        binds.status = status;
      }

      sql += ` ORDER BY codigo_bairro DESC`;

      await conexao.conectar();

      const result: any = await conexao.executar(sql, binds);

      const bairros: Bairro[] = result.rows.map(
        (linha: any) => new Bairro(linha[0], linha[1], linha[2], linha[3]),
      );

      return bairros;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('listar', 'Bairros');
    } finally {
      await conexao.desconectar();
    }
  }

  public async buscarPorCodigo(
    codigoBairro: number,
  ): Promise<Bairro | undefined> {
    try {
      const sql = `SELECT * FROM tb_bairro WHERE codigo_bairro = :codigoBairro`;

      await conexao.conectar();

      const binds = { codigoBairro };

      const result: any = await conexao.executar(sql, binds);

      const bairro: Bairro = result.rows.map(
        (linha: any) => new Bairro(linha[0], linha[1], linha[2], linha[3]),
      )[0];

      return bairro;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('buscar', 'Bairro pelo código');
    } finally {
      await conexao.desconectar();
    }
  }

  public async buscarPorNome(nome: string): Promise<Bairro[] | undefined> {
    try {
      const sql = `SELECT * FROM tb_bairro WHERE nome = :nome`;

      await conexao.conectar();

      const binds = { nome: nome.toUpperCase() };

      const result: any = await conexao.executar(sql, binds);

      const bairros: Bairro[] = result.rows.map(
        (linha: any) => new Bairro(linha[0], linha[1], linha[2], linha[3]),
      );

      return bairros;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('buscar', 'Bairro pelo nome');
    } finally {
      await conexao.desconectar();
    }
  }
}
