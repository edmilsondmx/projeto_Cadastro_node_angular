import { Component, OnInit } from '@angular/core';
import { IBairro } from 'src/app/models/interfaces';
import * as bootstrap from 'bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MOCK_BAIRROS } from 'src/app/mock/mock_bairros';
import { BairroService } from 'src/app/services/bairro.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { ErrorsService } from 'src/app/errors/errors.service';

@Component({
  selector: 'app-bairro',
  templateUrl: './bairro.component.html',
  styleUrls: ['./bairro.component.scss'],
})
export class BairroComponent implements OnInit {
  tituloModal: any = null;

  titles: string[] = ['Id', 'Código Municipio', 'Município', 'Nome'];
  campos: string[] = ['codigoBairro', 'codigoMunicipio', 'municipio', 'nome'];
  public dadosBairros: IBairro[] = [];

  public search = new FormGroup({
    campo: new FormControl('-1'),
    valor: new FormControl(''),
  });

  novoBairroForm = new FormGroup({
    codigoBairro: new FormControl(0),
    codigoMunicipio: new FormControl(0, [Validators.required]),
    nome: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    status: new FormControl(1, [
      Validators.required,
      Validators.max(2),
      Validators.min(1),
    ]),
  });

  constructor(
    private bairroService: BairroService,
    private alertaService: AlertasService,
    private errorsService: ErrorsService
  ) {}

  ngOnInit(): void {
    this.buscarBairros();
  }

  buscarBairros(): void {
    this.bairroService.devolverBairros().subscribe({
      next: (bairros) => {
        this.dadosBairros = bairros;
      },
      error: (error) => {
        this.errorsService.handleError(error);
      },
    });
  }

  adicionarBairro(): void {
    this.tituloModal = 'Cadastrar Bairro';
    this.novoBairroForm.reset();
    this.novoBairroForm.patchValue({ codigoMunicipio: -1, status: 1 });
  }

  editarBairro(bairro: IBairro): void {
    this.tituloModal = 'Editar Bairro';
    this.novoBairroForm.patchValue(bairro);

    this.abrirModalEditar();
  }

  salvarBairro(): void {
    this.tituloModal = null;
    if (
      this.novoBairroForm.value.codigoBairro === 0 ||
      this.novoBairroForm.value.codigoBairro === null
    ) {
      this.salvarNovoBairro();
    } else {
      this.salvarEdicaoBairro();
    }
  }

  excluirBairro(id: number): void {
    let mensagem =
      'Os dados de endereços relacionados à esse Bairro serão apagados!';
    this.alertaService.confirmacaoRemocao(mensagem).then((result) => {
      if (result.isConfirmed) {
        this.bairroService.excluirBairro(id).subscribe({
          next: (bairros) => {
            this.alertaService.mostrarSucesso('Bairro excluído com sucesso!');
            this.dadosBairros = bairros;
          },
          error: (error) => {
            this.errorsService.handleError(error);
            this.buscarBairros();
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

  salvarEdicaoBairro(): void {
    this.bairroService
      .editarBairro(this.novoBairroForm.value as IBairro)
      .subscribe({
        next: (bairros) => {
          this.alertaService.mostrarSucesso('Bairro editado com sucesso!');
          this.dadosBairros = bairros;
        },
        error: (error) => {
          this.errorsService.handleError(error);
          this.buscarBairros();
        },
      });
  }

  salvarNovoBairro(): void {
    this.bairroService
      .cadastrarBairro(this.novoBairroForm.value as IBairro)
      .subscribe({
        next: (bairros) => {
          this.alertaService.mostrarSucesso('Bairro cadastrado com sucesso!');
          this.dadosBairros = bairros;
        },
        error: (error) => {
          this.errorsService.handleError(error);
          this.buscarBairros();
        },
      });
  }

  pesquisarBairro(): void {
    let campo = this.search.value.campo;
    let valor = this.search.value.valor;
    if (campo && valor) {
      this.bairroService.pesquisarBairro(campo, valor).subscribe({
        next: (bairros) => {
          if (Array.isArray(bairros)) {
            this.dadosBairros = bairros;
          } else {
            this.dadosBairros = [bairros];
          }
        },
        error: (error) => {
          this.errorsService.handleError(error);
          this.buscarBairros();
        },
      });
    } else {
      this.buscarBairros();
    }
  }

  limparPesquisa(): void {
    this.search.reset();
    this.search.patchValue({ campo: '-1' });
    this.buscarBairros();
  }
}
