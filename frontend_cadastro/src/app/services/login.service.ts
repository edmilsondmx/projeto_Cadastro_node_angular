import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { AppConstantes } from '../app-constantes';
import { AlertasService } from './alertas.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  userAuthorized: boolean = false;
  userAuthorizedSource = new BehaviorSubject<boolean>(this.userAuthorized);
  userAuthorized$ = this.userAuthorizedSource.asObservable();

  constructor(
    private http: HttpClient,
    private alertaService: AlertasService
  ) {}

  verificarLogin(login: string, senha: string): Observable<any> {
    return this.http
      .post(
        AppConstantes.API_ENDPOINT_LOGIN,
        { login, senha },
        { responseType: 'text' }
      )
      .pipe();
  }

  saveLocalStorage(token: string) {
    localStorage.setItem('token', token);
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor

      let jsonError = JSON.parse(error.error);
      errorMessage = jsonError.mensagem;
    }
    console.error(errorMessage);
    this.alertaService.mostrarErroServidor(errorMessage);
    return throwError(errorMessage);
  }
}
