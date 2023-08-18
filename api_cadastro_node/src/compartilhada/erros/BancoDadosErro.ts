class BancoDadosErro {
  public readonly acao: string;
  public readonly modulo: string;
  public readonly statusCode = 400;

  constructor(acao: string, modulo: string) {
    this.acao = acao;
    this.modulo = modulo;
  }

  public message(): string {
    return `Não foi possível ${this.acao} ${this.modulo} no banco de dados!`;
  }
}

export default BancoDadosErro;
