import { Component, OnInit } from '@angular/core';
import { IMunicipio } from 'src/app/models/interfaces';
import * as bootstrap from 'bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MOCK_MUNICIPIOS } from 'src/app/mock/mock_municipios';
import { MunicipioService } from 'src/app/services/municipio.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { ErrorsService } from 'src/app/errors/errors.service';

@Component({
  selector: 'app-municipio',
  templateUrl: './municipio.component.html',
  styleUrls: ['./municipio.component.scss'],
})
export class MunicipioComponent implements OnInit {
  tituloModal: any = null;

  titles: string[] = ['Id', 'Código UF', 'UF', 'Nome'];
  campos: string[] = ['codigoMunicipio', 'codigoUF', 'uf', 'nome'];
  public dadosMunicipios: IMunicipio[] = [];

  public search = new FormGroup({
    campo: new FormControl('-1'),
    valor: new FormControl(''),
  });

  public novoMunicipioForm = new FormGroup({
    codigoMunicipio: new FormControl(0),
    codigoUF: new FormControl(0, [Validators.required]),
    nome: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    status: new FormControl(1, [
      Validators.required,
      Validators.max(2),
      Validators.min(1),
    ]),
  });

  constructor(
    private municipioService: MunicipioService,
    private alertaService: AlertasService,
    private errorsService: ErrorsService
  ) {}

  ngOnInit(): void {
    this.buscarMUncipios();
  }

  buscarMUncipios(): void {
    this.municipioService.devolverMunicipios().subscribe({
      next: (municipios) => {
        this.dadosMunicipios = municipios;
      },
      error: (error) => {
        this.errorsService.handleError(error);
      },
    });
  }

  adicionarMunicipio(): void {
    this.tituloModal = 'Cadastrar Municipio';
    this.novoMunicipioForm.reset();
    this.novoMunicipioForm.patchValue({ codigoUF: -1, status: 1 });
  }

  editarMunicipio(municipio: IMunicipio): void {
    this.tituloModal = 'Editar Municipio';
    this.novoMunicipioForm.patchValue(municipio as IMunicipio);

    this.abrirModalEditar();
  }

  salvarMunicipio(): void {
    this.tituloModal = null;
    if (
      this.novoMunicipioForm.value.codigoMunicipio === null ||
      this.novoMunicipioForm.value.codigoMunicipio === 0
    ) {
      this.salvarNovoMunicipio();
    } else {
      this.salvarEdicaoMunicipio();
    }
  }

  excluirMunicipio(id: number): void {
    let mensagem =
      'Os dados de bairros e endereços relacionados à esse Município serão apagados!';
    this.alertaService.confirmacaoRemocao(mensagem).then((result) => {
      if (result.isConfirmed) {
        this.municipioService.excluirMunicipio(id).subscribe({
          next: (municipios) => {
            this.alertaService.mostrarSucesso(
              'Município excluído com sucesso!'
            );
            this.dadosMunicipios = municipios;
          },
          error: (error) => {
            this.errorsService.handleError(error);
            this.buscarMUncipios();
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

  salvarEdicaoMunicipio(): void {
    this.municipioService
      .editarMunicipio(this.novoMunicipioForm.value as IMunicipio)
      .subscribe({
        next: (municipios) => {
          this.alertaService.mostrarSucesso('Município editado com sucesso!');
          this.dadosMunicipios = municipios;
        },
        error: (error) => {
          this.errorsService.handleError(error);
          this.buscarMUncipios();
        },
      });
  }

  salvarNovoMunicipio(): void {
    this.municipioService
      .cadastrarMunicipio(this.novoMunicipioForm.value as IMunicipio)
      .subscribe({
        next: (municipios) => {
          this.alertaService.mostrarSucesso(
            'Município cadastrado com sucesso!'
          );
          this.dadosMunicipios = municipios;
        },
        error: (error) => {
          this.errorsService.handleError(error);
          this.buscarMUncipios();
        },
      });
  }

  pesquisarMunicipio(): void {
    let campo = this.search.value.campo;
    let valor = this.search.value.valor;

    if (campo && valor) {
      this.municipioService.pesquisarMunicipio(campo, valor).subscribe({
        next: (municipios) => {
          if (Array.isArray(municipios)) {
            this.dadosMunicipios = municipios;
          } else {
            this.dadosMunicipios = [municipios];
          }
        },
        error: (error) => {
          this.errorsService.handleError(error);
          this.buscarMUncipios();
        },
      });
    } else {
      this.buscarMUncipios();
    }
  }

  limparPesquisa(): void {
    this.search.reset();
    this.search.patchValue({ campo: '-1' });
    this.buscarMUncipios();
  }
}
