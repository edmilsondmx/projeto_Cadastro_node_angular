class ValidacaoErro {
  public readonly mensagem: string;
  public readonly statusCode: number;
  public readonly campo: string;

  constructor(mensagem: string, statusCode = 400, campo: string) {
    this.mensagem = mensagem;
    this.statusCode = statusCode;
    this.campo = campo;
  }
}

export default ValidacaoErro;
