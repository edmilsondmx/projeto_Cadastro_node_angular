/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import UF from '../entidades/UF';
import IUfRepositorio from '../interfaces/IUfRepositorio';
import Conexao from '@compartilhada/banco/conexao';
import BancoDadosErro from '@compartilhada/erros/BancoDadosErro';

const conexao = new Conexao();

export default class UFRepositorio implements IUfRepositorio {
  public async buscarPorCodigo(codigoUf: number): Promise<UF | undefined> {
    try {
      const sql = `SELECT * FROM TB_UF WHERE CODIGO_UF = :codigoUF`;
      const binds = { codigoUf };

      await conexao.conectar();

      const resultSet: any = await conexao.executar(sql, binds);

      const ufs = resultSet.rows.map(
        (linha: any[]) => new UF(linha[0], linha[1], linha[2], linha[3]),
      );

      return ufs[0];
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('buscar', 'UF por código');
      // throw new AppError(
      //   'Não foi possível buscar UF por código no banco de dados',
      //   400,
      // );
    } finally {
      await conexao.desconectar();
    }
  }

  public async incluirUF(uf: UF): Promise<UF[]> {
    try {
      const sql = `INSERT INTO tb_uf (codigo_uf, sigla, nome, status) VALUES (:codigoUF, :sigla, :nome, :status)`;

      await conexao.conectar();

      const codigoUF: number = await conexao.gerarSequencia('SEQUENCE_UF');

      uf.codigoUF = codigoUF;
      uf.nome = uf.nome.toUpperCase();
      uf.sigla = uf.sigla.toUpperCase();

      const binds: any = uf;
      await conexao.executar(sql, binds);
      await conexao.commitar();

      const listaUFs = await this.listarUFs();

      return listaUFs;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('incluir', 'UF');
      // throw new AppError('Não foi possível incluir UF no banco de dados!', 400);
    } finally {
      await conexao.desconectar();
    }
  }

  public async alterarUF(uf: UF): Promise<UF[]> {
    try {
      await this.alterarStatusEmCascata(uf.codigoUF, uf.status);

      const sql = `UPDATE tb_uf SET sigla = :sigla, nome = :nome, status = :status WHERE codigo_uf = :codigoUF`;

      await conexao.conectar();

      uf.nome = uf.nome.toUpperCase();
      uf.sigla = uf.sigla.toUpperCase();

      const binds: any = uf;

      await conexao.executar(sql, binds);
      await conexao.commitar();

      const listaUFs = await this.listarUFs();

      return listaUFs;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('alterar', 'UF');
      // throw new AppError('Não foi possível alterar UF no banco de dados!', 400);
    } finally {
      await conexao.desconectar();
    }
  }

  public async excluirUF(uf: UF): Promise<UF[]> {
    try {
      await conexao.conectar();

      const bind: any = { codigoUF: uf.codigoUF };

      // Excluir endereços relacionados aos bairros dos municípios da UF selecionada
      const sqlDeleteEnderecos = `DELETE FROM tb_endereco WHERE codigo_bairro IN ( SELECT codigo_bairro FROM tb_bairro WHERE codigo_municipio IN ( SELECT codigo_municipio FROM tb_municipio WHERE codigo_uf = :codigoUF ) )`;
      await conexao.executar(sqlDeleteEnderecos, bind);

      // Excluir bairros dos municípios da UF selecionada
      const sqlDeleteBairros = `DELETE FROM tb_bairro WHERE codigo_municipio IN ( SELECT codigo_municipio FROM tb_municipio WHERE codigo_uf = :codigoUF)`;
      await conexao.executar(sqlDeleteBairros, bind);

      // Excluir municípios da UF selecionada
      const sqlDeleteMunicipios = `DELETE FROM tb_municipio WHERE codigo_uf = :codigoUF`;
      await conexao.executar(sqlDeleteMunicipios, bind);

      // Excluir UF selecionada
      const sqlDeleteUF = `DELETE FROM tb_uf WHERE codigo_uf = :codigoUF`;
      await conexao.executar(sqlDeleteUF, bind);

      await conexao.commitar();

      const listaUFs = await this.listarUFs();

      return listaUFs;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('excluir', 'UF');
      // throw new AppError('Não foi possível excluir UF no banco de dados!', 400);
    } finally {
      await conexao.desconectar();
    }
  }

  public async listarUFs(parametros: any = {}): Promise<UF[]> {
    try {
      const { codigoUF, sigla, nome, status } = parametros;

      let sql = `SELECT * FROM tb_uf WHERE 1 = 1`;
      const binds: any = {};

      if (codigoUF) {
        sql += ` AND CODIGO_UF = :codigoUF`;
        binds.codigoUF = codigoUF;
      }

      if (sigla) {
        sql += ` AND SIGLA = :sigla`;
        binds.sigla = sigla.toUpperCase();
      }

      if (nome) {
        sql += ` AND NOME = :nome`;
        binds.nome = nome.toUpperCase();
      }

      if (status) {
        sql += ` AND STATUS = :status`;
        binds.status = status;
      }

      sql += ` ORDER BY codigo_uf DESC`;

      await conexao.conectar();

      const result: any = await conexao.executar(sql, binds);

      const ufs: UF[] = result.rows.map(
        (linha: any[]) => new UF(linha[0], linha[1], linha[2], linha[3]),
      );

      return ufs;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('listar', 'UFs');
    } finally {
      await conexao.desconectar();
    }
  }

  public async buscarPorNome(
    nome: string,
    sigla: string,
  ): Promise<UF | undefined> {
    try {
      const sql = `SELECT * FROM TB_UF WHERE NOME = :nome OR SIGLA = :sigla`;
      const binds = {
        nome: nome.toUpperCase(),
        sigla: sigla.toUpperCase(),
      };

      await conexao.conectar();

      const result: any = await conexao.executar(sql, binds);

      const uf: UF = result.rows.map(
        (linha: any[]) => new UF(linha[0], linha[1], linha[2], linha[3]),
      )[0];

      return uf;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('buscar', 'UF por nome');
      // throw new AppError(
      //   'Não foi possível buscar UF por nome no banco de dados!',
      //   400,
      // );
    } finally {
      await conexao.desconectar();
    }
  }

  public async alterarStatusEmCascata(
    codigoUF: number,
    status: number,
  ): Promise<void> {
    try {
      await conexao.conectar();

      const bind: any = { codigoUF, status };

      // Alterar status dos bairros dos municípios da UF selecionada
      const sqlUpdateBairros = `UPDATE tb_bairro SET status = :status WHERE codigo_municipio IN ( SELECT codigo_municipio FROM tb_municipio WHERE codigo_uf = :codigoUF)`;
      await conexao.executar(sqlUpdateBairros, bind);

      // Alterar status dos municípios da UF selecionada
      const sqlUpdateMunicipios = `UPDATE tb_municipio SET status = :status WHERE codigo_uf = :codigoUF`;
      await conexao.executar(sqlUpdateMunicipios, bind);

      await conexao.commitar();
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('alterar status', 'UF');
      // throw new AppError(
      //   'Não foi possível alterar status da UF no banco de dados!',
      //   400,
      // );
    } finally {
      await conexao.desconectar();
    }
  }
}
