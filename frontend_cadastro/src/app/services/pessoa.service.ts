import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPessoa } from '../models/interfaces';
import { AppConstantes } from '../app-constantes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  listaPessoas: IPessoa[] = [];

  constructor(private http: HttpClient) {}

  devolverListaPessoas(): Observable<IPessoa[]> {
    return this.http.get<IPessoa[]>(AppConstantes.API_ENDPOINT_PESSOA);
  }

  devolverPessoaComEnderecos(codigoPessoa: number): Observable<any> {
    return this.http.get<any>(
      AppConstantes.API_ENDPOINT_PESSOA + '?codigoPessoa=' + codigoPessoa
    );
  }

  cadastrarPessoa(pessoa: IPessoa): Observable<IPessoa[]> {
    return this.http.post<IPessoa[]>(AppConstantes.API_ENDPOINT_PESSOA, pessoa);
  }

  editarPessoa(pessoa: IPessoa): Observable<IPessoa[]> {
    return this.http.put<IPessoa[]>(AppConstantes.API_ENDPOINT_PESSOA, pessoa);
  }

  excluirPessoa(id: number): Observable<IPessoa[]> {
    let token: string | null = localStorage.getItem('token');
    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    if (token === null) {
      headers = new HttpHeaders();
    }
    return this.http.delete<IPessoa[]>(
      AppConstantes.API_ENDPOINT_PESSOA + '/' + id,
      { headers: headers }
    );
  }

  pesquisarPessoa(
    campo: string,
    valor: string
  ): Observable<IPessoa[] | IPessoa> {
    return this.http.get<IPessoa[] | IPessoa>(
      AppConstantes.API_ENDPOINT_PESSOA + '?' + campo + '=' + valor
    );
  }
}
