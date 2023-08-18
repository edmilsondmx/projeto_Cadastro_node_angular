import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertasService {
  constructor(private toastr: ToastrService) {}

  mostrarSucesso(mensagem: string): void {
    this.toastr.success(mensagem, 'Sucesso!');
  }

  mostrarErro(mensagem: string): void {
    this.toastr.error(mensagem, 'Erro!');
  }

  mostrarAlerta(mensagem: string): void {
    this.toastr.warning(mensagem, 'Alerta!');
  }

  mostrarInformacao(mensagem: string): void {
    this.toastr.info(mensagem, 'Informação!');
  }

  mostrarErroValidacao(mensagem: string): void {
    this.toastr.error(mensagem, 'Erro de Validação!');
  }

  mostrarErroServidor(mensagem: string): void {
    this.toastr.error(mensagem, 'Erro do Servidor!');
  }

  confirmacaoRemocao(mensagem: string) {
    return Swal.fire({
      title: 'Tem certeza?',
      text: mensagem,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8DB51B',
      cancelButtonColor: '#D82D56',
      confirmButtonText: 'Sim, exclua!',
      cancelButtonText: 'Cancelar',
    });
  }
}
