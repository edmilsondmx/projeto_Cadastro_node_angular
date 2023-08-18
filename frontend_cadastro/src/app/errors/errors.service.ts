import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { AlertasService } from '../services/alertas.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorsService {
  constructor(private alertaService: AlertasService) {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor

      errorMessage = error.error.mensagem;
    }
    console.error(errorMessage);
    this.alertaService.mostrarErroServidor(errorMessage);
    return throwError(errorMessage);
  }
}
