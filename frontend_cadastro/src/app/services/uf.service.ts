import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { IUf } from '../models/interfaces';
import { Observable, catchError, throwError } from 'rxjs';
import { AppConstantes } from '../app-constantes';
import { AlertasService } from './alertas.service';

@Injectable({
  providedIn: 'root',
})
export class UfService {
  constructor(
    private http: HttpClient,
    private alertaService: AlertasService
  ) {}

  devolverUfs(): Observable<IUf[]> {
    return this.http.get<IUf[]>(AppConstantes.API_ENDPOINT_UF);
  }

  cadastrarUf(uf: IUf): Observable<IUf[]> {
    return this.http.post<IUf[]>(AppConstantes.API_ENDPOINT_UF, uf);
  }

  editarUf(uf: IUf): Observable<IUf[]> {
    return this.http.put<IUf[]>(AppConstantes.API_ENDPOINT_UF, uf);
  }

  excluirUf(id: number): Observable<IUf[]> {
    let token: string | null = localStorage.getItem('token');
    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    if (token === null) {
      headers = new HttpHeaders();
    }
    return this.http.delete<IUf[]>(AppConstantes.API_ENDPOINT_UF + '/' + id, {
      headers: headers,
    });
  }

  pesquisarUf(campo: string, valor: string): Observable<IUf[] | IUf> {
    return this.http.get<IUf[] | IUf>(
      AppConstantes.API_ENDPOINT_UF + '?' + campo + '=' + valor
    );
  }
}
