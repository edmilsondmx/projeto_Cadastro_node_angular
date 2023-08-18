/* eslint-disable @typescript-eslint/no-explicit-any */
import * as oracle from 'oracledb';
import AppError from '@compartilhada/erros/AppError';

class Conexao {
  public conexao: any = null;

  public async conectar(): Promise<oracle.Connection> {
    try {
      console.log('Criando conexão');
      if (this.conexao === null) {
        this.conexao = await oracle.getConnection({
          user: 'C##NODE',
          password: 'node',
          connectString: 'localhost:1521/XE',
        });
      }
      console.log('Conectado com sucesso');
      return this.conexao;
    } catch (error) {
      console.log(error);
      throw new AppError('Erro ao conectar com o banco de dados', 400);
    }
  }

  public async desconectar(): Promise<void> {
    try {
      console.log('Desconectando');
      if (this.conexao !== null) {
        await this.conexao.close();
        this.conexao = null;
      }
      console.log('Desconectado com sucesso');
    } catch (error) {
      console.log(error);
      throw new AppError('Erro ao desconectar do banco de dados', 404);
    }
  }

  public async commitar(): Promise<void> {
    try {
      console.log('Commitando');
      if (this.conexao !== null) {
        await this.conexao.commit();
      }
      console.log('Commitado com sucesso');
    } catch (error) {
      console.log(error);
      throw new AppError('Erro ao commitar', 404);
    }
  }

  public async reverter(): Promise<void> {
    try {
      console.log('Revertendo');
      if (this.conexao !== null) {
        await this.conexao.rollback();
      }
      console.log('Revertido com sucesso');
    } catch (error) {
      console.log(error);
      throw new AppError('Erro ao reverter!', 404);
    }
  }

  public async executar(
    sql: string,
    binds: any = {},
    options: any = {},
  ): Promise<oracle.Result<any>> {
    try {
      console.log('Executando query');
      const result = await this.conexao.execute(sql, binds, options);
      console.log('Query executada com sucesso!');
      return result;
    } catch (error) {
      console.log(error);
      throw new AppError('Erro ao executar query', 400);
    }
  }

  public async gerarSequencia(nomeSequencia: string): Promise<number> {
    try {
      console.log('Gerando sequência');
      const sequencia: any = await this.conexao.execute(
        `SELECT ${nomeSequencia}.NEXTVAL AS NEXT_CODIGO FROM DUAL`,
      );
      const codigo = sequencia.rows[0][0];
      console.log('Sequência gerada com sucesso');
      return codigo;
    } catch (error) {
      console.log(error);
      throw new AppError('Erro ao gerar sequência', 400);
    }
  }
}

export default Conexao;
