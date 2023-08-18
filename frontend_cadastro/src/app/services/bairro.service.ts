import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertasService } from './alertas.service';
import { Observable } from 'rxjs';
import { AppConstantes } from '../app-constantes';
import { IBairro } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class BairroService {
  constructor(
    private http: HttpClient,
    private alertaService: AlertasService
  ) {}

  devolverBairros(): Observable<IBairro[]> {
    return this.http.get<IBairro[]>(AppConstantes.API_ENDPOINT_BAIRRO);
  }

  cadastrarBairro(bairro: IBairro): Observable<IBairro[]> {
    return this.http.post<IBairro[]>(AppConstantes.API_ENDPOINT_BAIRRO, bairro);
  }

  editarBairro(bairro: IBairro): Observable<IBairro[]> {
    return this.http.put<IBairro[]>(AppConstantes.API_ENDPOINT_BAIRRO, bairro);
  }

  excluirBairro(id: number): Observable<IBairro[]> {
    let token: string | null = localStorage.getItem('token');
    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    if (token === null) {
      headers = new HttpHeaders();
    }
    return this.http.delete<IBairro[]>(
      AppConstantes.API_ENDPOINT_BAIRRO + '/' + id,
      {
        headers: headers,
      }
    );
  }

  pesquisarBairro(
    campo: string,
    valor: string
  ): Observable<IBairro[] | IBairro> {
    return this.http.get<IBairro[] | IBairro>(
      AppConstantes.API_ENDPOINT_BAIRRO + '?' + campo + '=' + valor
    );
  }
}
