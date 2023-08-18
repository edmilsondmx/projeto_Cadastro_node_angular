/* eslint-disable @typescript-eslint/no-explicit-any */
import Pessoa from '../entidades/Pessoa';
import IPessoaRepositorio from '../interfaces/IPessoaRepositorio';
import Conexao from '@compartilhada/banco/conexao';
import EnderecoRepositorio from './EnderecoRepositorio';
import BancoDadosErro from '@compartilhada/erros/BancoDadosErro';

const conexao = new Conexao();
const enderecoRepositoio = new EnderecoRepositorio();

export default class PessoaRepositorio implements IPessoaRepositorio {
  public async incluirPessoa(pessoa: Pessoa): Promise<Pessoa[]> {
    try {
      const sqlPessoa = `INSERT INTO tb_pessoa (codigo_pessoa, nome, sobrenome, idade, login, senha, status) VALUES (:codigoPessoa, :nome, :sobrenome, :idade, :login, :senha, :status)`;

      await conexao.conectar();

      const sequenciaPessoa: number = await conexao.gerarSequencia(
        'SEQUENCE_PESSOA',
      );

      const codigoPessoa = sequenciaPessoa;

      pessoa.codigoPessoa = codigoPessoa;
      pessoa.nome = pessoa.nome.toUpperCase();
      pessoa.sobrenome = pessoa.sobrenome.toUpperCase();

      const bindsPessoa: any = {
        codigoPessoa: pessoa.codigoPessoa,
        nome: pessoa.nome,
        sobrenome: pessoa.sobrenome,
        idade: pessoa.idade,
        login: pessoa.login,
        senha: pessoa.senha,
        status: pessoa.status,
      };

      await conexao.executar(sqlPessoa, bindsPessoa);

      for (const endereco of pessoa.enderecos) {
        await enderecoRepositoio.incluirEndereco(
          endereco,
          pessoa.codigoPessoa,
          conexao,
        );
      }

      await conexao.commitar();

      const pessoas = await this.listarPessoas();

      return pessoas;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('incluir', 'Pessoa');
    } finally {
      await conexao.desconectar();
    }
  }

  public async alterarPessoa(pessoa: Pessoa): Promise<Pessoa[]> {
    try {
      const sqlPessoa = `UPDATE tb_pessoa SET nome = :nome, sobrenome = :sobrenome, idade = :idade, login = :login, senha = :senha, status = :status WHERE codigo_pessoa = :codigoPessoa`;

      await conexao.conectar();

      const enderecosExistentesPorPessoa =
        await enderecoRepositoio.listarEnderecos(pessoa.codigoPessoa, conexao);

      pessoa.nome = pessoa.nome.toUpperCase();
      pessoa.sobrenome = pessoa.sobrenome.toUpperCase();

      const binds: any = {
        nome: pessoa.nome,
        sobrenome: pessoa.sobrenome,
        idade: pessoa.idade,
        login: pessoa.login,
        senha: pessoa.senha,
        status: pessoa.status,
        codigoPessoa: pessoa.codigoPessoa,
      };

      await conexao.executar(sqlPessoa, binds);

      for (const endereco of pessoa.enderecos) {
        if (
          enderecosExistentesPorPessoa.some(
            ender => ender.codigoEndereco === endereco.codigoEndereco,
          )
        ) {
          await enderecoRepositoio.alterarEndereco(endereco, conexao);
        } else {
          await enderecoRepositoio.incluirEndereco(
            endereco,
            pessoa.codigoPessoa,
            conexao,
          );
        }
      }

      for (const enderecoExistente of enderecosExistentesPorPessoa) {
        if (
          !pessoa.enderecos.some(
            ender => ender.codigoEndereco === enderecoExistente.codigoEndereco,
          )
        ) {
          await enderecoRepositoio.excluirEndereco(
            enderecoExistente.codigoEndereco,
            conexao,
          );
        }
      }

      await conexao.commitar();

      const pessoas = await this.listarPessoas();

      return pessoas;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('alterar', 'Pessoa');
    } finally {
      await conexao.desconectar();
    }
  }

  public async listarPessoas(parametros: any = {}): Promise<Pessoa[]> {
    try {
      const { codigoPessoa, login, status, nome, codigoUF } = parametros;

      let sqlPessoa = `SELECT * FROM tb_pessoa WHERE 1 = 1`;
      const binds: any = {};

      if (codigoPessoa) {
        sqlPessoa += ` AND codigo_pessoa = :codigoPessoa`;
        binds.codigoPessoa = codigoPessoa;
      }

      if (login) {
        sqlPessoa += ` AND login = :login`;
        binds.login = login;
      }

      if (status) {
        sqlPessoa += ` AND status = :status`;
        binds.status = status;
      }

      if (nome) {
        sqlPessoa += ` AND nome = :nome`;
        binds.nome = nome.toUpperCase();
      }

      if (codigoUF) {
        sqlPessoa += ` AND codigo_pessoa IN (SELECT codigo_pessoa FROM tb_endereco WHERE codigo_bairro IN ( SELECT codigo_bairro FROM tb_bairro WHERE codigo_municipio IN ( SELECT codigo_municipio FROM tb_municipio WHERE codigo_uf = :codigoUF ) ) )`;
        binds.codigoUF = codigoUF;
      }

      sqlPessoa += ` ORDER BY codigo_pessoa DESC`;

      await conexao.conectar();

      const result: any = await conexao.executar(sqlPessoa, binds);

      const pessoas = result.rows.map(
        (linha: any) =>
          new Pessoa(
            linha[0],
            linha[1],
            linha[2],
            linha[3],
            linha[4],
            linha[5],
            linha[6],
            [],
          ),
      );

      if (codigoPessoa) {
        for (const pessoa of pessoas) {
          const enderecos = await enderecoRepositoio.listarEnderecos(
            pessoa.codigoPessoa,
            conexao,
          );
          pessoa.enderecos = enderecos;
        }
      }

      return pessoas;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('listar', 'Pessoas');
    } finally {
      await conexao.desconectar();
    }
  }

  public async excluirPessoa(codigoPessoa: number): Promise<Pessoa[]> {
    try {
      await conexao.conectar();

      const bind: any = { codigoPessoa };

      //Excluir endereços relacionados a pessoa selecionada
      await enderecoRepositoio.excluirEnderecoPeloCodigoPessoa(
        codigoPessoa,
        conexao,
      );

      //Excluir pessoa selecionada
      const sqlPessoa = `DELETE FROM tb_pessoa WHERE codigo_pessoa = :codigoPessoa`;
      await conexao.executar(sqlPessoa, bind);

      await conexao.commitar();

      const pessoas = await this.listarPessoas();

      return pessoas;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('excluir', 'Pessoa');
    } finally {
      await conexao.desconectar();
    }
  }

  public async buscarPorCodigo(
    codigoPessoa: number,
  ): Promise<Pessoa | undefined> {
    try {
      const sql = `SELECT * FROM tb_pessoa WHERE codigo_pessoa = :codigoPessoa`;

      await conexao.conectar();

      const binds = { codigoPessoa };

      const result: any = await conexao.executar(sql, binds);

      const pessoa: Pessoa = result.rows.map(
        (linha: any) =>
          new Pessoa(
            linha[0],
            linha[1],
            linha[2],
            linha[3],
            linha[4],
            linha[5],
            linha[6],
            linha[7],
          ),
      )[0];

      return pessoa;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('buscar', 'Pessoa por código');
    } finally {
      await conexao.desconectar();
    }
  }

  public async buscarPorNome(nome: string): Promise<Pessoa[]> {
    try {
      const sql = `SELECT * FROM tb_pessoa WHERE nome = :nome`;

      await conexao.conectar();

      const binds = { nome: nome.toUpperCase() };

      const result: any = await conexao.executar(sql, binds);

      const pessoas: Pessoa[] = result.rows.map(
        (linha: any) =>
          new Pessoa(
            linha[0],
            linha[1],
            linha[2],
            linha[3],
            linha[4],
            linha[5],
            linha[6],
            linha[7],
          ),
      );

      return pessoas;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('buscar', 'Pessoa por nome');
    } finally {
      await conexao.desconectar();
    }
  }
  public async buscarPorLogin(login: string): Promise<Pessoa | undefined> {
    try {
      const sql = `SELECT * FROM tb_pessoa WHERE login = :login`;

      await conexao.conectar();

      const binds = { login };

      const result: any = await conexao.executar(sql, binds);

      const pessoa: Pessoa = result.rows.map(
        (linha: any) =>
          new Pessoa(
            linha[0],
            linha[1],
            linha[2],
            linha[3],
            linha[4],
            linha[5],
            linha[6],
            linha[7],
          ),
      )[0];

      return pessoa;
    } catch (error) {
      console.log(error);
      await conexao.reverter();
      throw new BancoDadosErro('buscar', 'Pessoa por login');
    } finally {
      await conexao.desconectar();
    }
  }
}
