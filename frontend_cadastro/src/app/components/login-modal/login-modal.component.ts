import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertasService } from 'src/app/services/alertas.service';
import { LoginService } from 'src/app/services/login.service';
import * as bootstrap from 'bootstrap';
import { ErrorsService } from 'src/app/errors/errors.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent {
  visualizar_senha: boolean = false;

  public usuarioForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private loginService: LoginService,
    private alertaService: AlertasService,
    private errorsService: ErrorsService,
    private router: Router
  ) {}

  entrar(): void {
    if (this.usuarioForm.invalid) {
      this.alertaService.mostrarAlerta('Preencha os campos corretamente!');
    }
    let login = this.usuarioForm.get('login')?.value;
    let senha = this.usuarioForm.get('senha')?.value;

    if (login && senha) {
      this.loginService.verificarLogin(login, senha).subscribe({
        next: (res) => {
          let token = JSON.parse(res).token;
          this.loginService.saveLocalStorage(token);

          this.fecharModal();
          this.usuarioForm.reset();

          this.loginService.userAuthorizedSource.next(true);
          this.alertaService.mostrarSucesso('Login realizado com sucesso!');
        },
        error: (error) => {
          this.loginService.handleError(error);
        },
      });
    }
  }

  fecharModal(): void {
    let close = document.getElementById('close');
    close?.click();
  }

  visualizarSenha() {
    const senha = document.querySelector('#password') as HTMLInputElement;
    senha.type = this.visualizar_senha ? 'password' : 'text';
    this.visualizar_senha = !this.visualizar_senha;
  }
}
