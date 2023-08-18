export class AppConstantes {
  public static get API_ENDPOINT() {
    return 'http://localhost:3333/';
  }

  public static get API_ENDPOINT_PESSOA() {
    return AppConstantes.API_ENDPOINT + 'pessoa';
  }

  public static get API_ENDPOINT_BAIRRO() {
    return AppConstantes.API_ENDPOINT + 'bairro';
  }

  public static get API_ENDPOINT_MUNICIPIO() {
    return AppConstantes.API_ENDPOINT + 'municipio';
  }

  public static get API_ENDPOINT_UF() {
    return AppConstantes.API_ENDPOINT + 'uf';
  }

  public static get API_ENDPOINT_LOGIN() {
    return AppConstantes.API_ENDPOINT + 'login';
  }
}
