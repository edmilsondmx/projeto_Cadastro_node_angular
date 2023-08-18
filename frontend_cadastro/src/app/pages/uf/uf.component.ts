import { Component, OnInit } from '@angular/core';
import { IUf } from 'src/app/models/interfaces';
import * as bootstrap from 'bootstrap';
import { MOCK_UFS } from 'src/app/mock/mock_ufs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UfService } from 'src/app/services/uf.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { ErrorsService } from 'src/app/errors/errors.service';

@Component({
  selector: 'app-uf',
  templateUrl: './uf.component.html',
  styleUrls: ['./uf.component.scss'],
})
export class UfComponent implements OnInit {
  tituloModal: any = null;

  titles: string[] = ['Id', 'Sigla', 'Nome'];
  campos: string[] = ['codigoUF', 'sigla', 'nome'];
  public dadosUf: IUf[] = [];

  public search = new FormGroup({
    campo: new FormControl('-1'),
    valor: new FormControl('', [Validators.required]),
  });

  public novaUFForm = new FormGroup({
    codigoUF: new FormControl(0),
    sigla: new FormControl('', [Validators.required, Validators.maxLength(2)]),
    nome: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    status: new FormControl(1, [
      Validators.required,
      Validators.max(2),
      Validators.min(1),
    ]),
  });

  constructor(
    private ufService: UfService,
    private alertaService: AlertasService,
    private errorsService: ErrorsService
  ) {}

  ngOnInit(): void {
    this.buscarUfs();
  }

  buscarUfs(): void {
    this.ufService.devolverUfs().subscribe({
      next: (ufs) => {
        this.dadosUf = ufs;
      },
      error: (error) => {
        this.errorsService.handleError(error);
      },
    });
  }

  adicionarUf(): void {
    this.tituloModal = 'Cadastrar UF';
    this.novaUFForm.reset();
    this.novaUFForm.patchValue({ status: 1 });
  }

  editarUF(uf: IUf): void {
    this.tituloModal = 'Editar UF';
    this.novaUFForm.patchValue(uf);

    this.abrirModalEditar();
  }

  salvarUF(): void {
    this.tituloModal = null;
    if (
      this.novaUFForm.value.codigoUF === null ||
      this.novaUFForm.value.codigoUF === 0
    ) {
      this.salvarNovaUf();
    } else {
      this.salvarEdicaoUf();
    }
  }

  excluirUF(id: number): void {
    let mensagem =
      'Os dados de Municípios, bairros e endereços relacionados à essa UF serão apagados!';
    this.alertaService.confirmacaoRemocao(mensagem).then((result) => {
      if (result.isConfirmed) {
        this.ufService.excluirUf(id).subscribe({
          next: (ufs) => {
            this.alertaService.mostrarSucesso('UF excluída com sucesso!');
            this.dadosUf = ufs;
          },
          error: (error) => {
            this.errorsService.handleError(error);
            this.buscarUfs();
          },
        });
      }
    });
  }

  abrirModalEditar(): void {
    if (this.tituloModal) {
      const modalElement = document.getElementById('staticBackdrop');
      if (modalElement) {
        modalElement.setAttribute('data-bs-backdrop', 'static');
        modalElement.setAttribute('data-bs-keyboard', 'false');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  }

  salvarEdicaoUf(): void {
    this.ufService.editarUf(this.novaUFForm.value as IUf).subscribe({
      next: (ufs) => {
        this.alertaService.mostrarSucesso('UF editada com sucesso!');
        this.dadosUf = ufs;
      },
      error: (error) => {
        this.errorsService.handleError(error);
        this.buscarUfs();
      },
    });
  }

  salvarNovaUf(): void {
    this.ufService.cadastrarUf(this.novaUFForm.value as IUf).subscribe({
      next: (ufs) => {
        this.alertaService.mostrarSucesso('UF cadastrada com sucesso!');
        this.dadosUf = ufs;
      },
      error: (error) => {
        this.errorsService.handleError(error);
        this.buscarUfs();
      },
    });
  }

  pesquisarUF(): void {
    let campo = this.search.value.campo;
    let valor = this.search.value.valor;

    if (campo && valor) {
      this.ufService.pesquisarUf(campo, valor).subscribe({
        next: (ufs) => {
          if (Array.isArray(ufs)) {
            this.dadosUf = ufs;
          } else {
            this.dadosUf = [ufs];
          }
        },
        error: (error) => {
          this.errorsService.handleError(error);
          this.buscarUfs();
        },
      });
    } else {
      this.buscarUfs();
    }
  }

  limparPesquisa(): void {
    this.search.reset();
    this.search.patchValue({ campo: '-1' });
    this.buscarUfs();
  }
}
