import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertasService } from './alertas.service';
import { Observable } from 'rxjs';
import { IMunicipio } from '../models/interfaces';
import { AppConstantes } from '../app-constantes';

@Injectable({
  providedIn: 'root',
})
export class MunicipioService {
  constructor(
    private http: HttpClient,
    private alertaService: AlertasService
  ) {}

  devolverMunicipios(): Observable<IMunicipio[]> {
    return this.http.get<IMunicipio[]>(AppConstantes.API_ENDPOINT_MUNICIPIO);
  }

  cadastrarMunicipio(municipio: IMunicipio): Observable<IMunicipio[]> {
    return this.http.post<IMunicipio[]>(
      AppConstantes.API_ENDPOINT_MUNICIPIO,
      municipio
    );
  }

  editarMunicipio(municipio: IMunicipio): Observable<IMunicipio[]> {
    return this.http.put<IMunicipio[]>(
      AppConstantes.API_ENDPOINT_MUNICIPIO,
      municipio
    );
  }

  excluirMunicipio(id: number): Observable<IMunicipio[]> {
    let token: string | null = localStorage.getItem('token');
    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    if (token === null) {
      headers = new HttpHeaders();
    }
    return this.http.delete<IMunicipio[]>(
      AppConstantes.API_ENDPOINT_MUNICIPIO + '/' + id,
      {
        headers: headers,
      }
    );
  }

  pesquisarMunicipio(
    campo: string,
    valor: string
  ): Observable<IMunicipio[] | IMunicipio> {
    return this.http.get<IMunicipio[] | IMunicipio>(
      AppConstantes.API_ENDPOINT_MUNICIPIO + '?' + campo + '=' + valor
    );
  }
}
