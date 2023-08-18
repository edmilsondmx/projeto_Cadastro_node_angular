import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IEndereco, IPessoa } from 'src/app/models/interfaces';
import { PessoaService } from 'src/app/services/pessoa.service';
import * as bootstrap from 'bootstrap';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MOCK_PESSOAS } from 'src/app/mock/mock_pessoas';
import { AlertasService } from 'src/app/services/alertas.service';
import { ErrorsService } from 'src/app/errors/errors.service';

@Component({
  selector: 'app-pessoa',
  templateUrl: './pessoa.component.html',
  styleUrls: ['./pessoa.component.scss'],
})
export class PessoaComponent implements OnInit {
  tituloModal: any = null;
  pessoaSelecionada: any = null;

  titles: string[] = ['Id', 'Nome', 'Sobrenome', 'Idade', 'Login', 'Senha'];
  campos: string[] = [
    'codigoPessoa',
    'nome',
    'sobrenome',
    'idade',
    'login',
    'senha',
  ];
  public dadosPessoa: IPessoa[] = [];
  public dadosEndereco: IEndereco[] = [];

  public search = new FormGroup({
    campo: new FormControl('-1'),
    valor: new FormControl(''),
  });

  novaPessoaForm = new FormGroup({
    codigoPessoa: new FormControl(0),
    nome: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    sobrenome: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    idade: new FormControl(0, [
      Validators.required,
      Validators.max(150),
      Validators.min(1),
    ]),
    login: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(50),
    ]),
    status: new FormControl(1, [
      Validators.required,
      Validators.max(2),
      Validators.min(1),
    ]),
    enderecos: new FormArray([
      new FormGroup({
        codigoEndereco: new FormControl(0),
        codigoPessoa: new FormControl(0),
        codigoBairro: new FormControl(0, [
          Validators.required,
          Validators.min(1),
        ]),
        nomeRua: new FormControl('', [
          Validators.required,
          Validators.maxLength(100),
        ]),
        numero: new FormControl('', [
          Validators.required,
          Validators.maxLength(10),
        ]),
        complemento: new FormControl('', [
          Validators.required,
          Validators.maxLength(20),
        ]),
        cep: new FormControl('', [
          Validators.required,
          Validators.maxLength(9),
          Validators.minLength(9),
        ]),
      }),
    ]),
  });

  constructor(
    private pessoaService: PessoaService,
    private alertaService: AlertasService,
    private errorsService: ErrorsService
  ) {}

  ngOnInit(): void {
    this.buscarPessoas();
  }

  buscarPessoas() {
    this.pessoaService.devolverListaPessoas().subscribe({
      next: (pessoas) => {
        this.dadosPessoa = pessoas;
      },
      error: (error) => {
        this.errorsService.handleError(error);
      },
    });
  }

  buscarEnderecos(codigoPessoa: number): Observable<any[]> {
    return this.pessoaService
      .devolverPessoaComEnderecos(codigoPessoa)
      .pipe(
        map(
          (pessoaComEnderecos: { enderecos: any }) =>
            pessoaComEnderecos.enderecos
        )
      );
  }

  adicionarPessoa(): void {
    this.tituloModal = 'Cadastrar Pessoa';
    const enderecos = this.novaPessoaForm.get('enderecos') as FormArray;
    this.novaPessoaForm.reset();
    this.novaPessoaForm.patchValue({ status: 1 });
    enderecos.patchValue([
      {
        codigoBairro: -1,
      },
    ]);
    while (enderecos.length > 1) {
      enderecos.removeAt(1);
    }
  }

  editarPessoa(pessoa: IPessoa): void {
    this.tituloModal = 'Editar Pessoa';

    this.pessoaService
      .devolverPessoaComEnderecos(pessoa.codigoPessoa)
      .subscribe({
        next: (pessoaComEndereco) => {
          this.dadosEndereco = pessoaComEndereco.enderecos;

          this.novaPessoaForm.patchValue({
            codigoPessoa: pessoaComEndereco.codigoPessoa,
            nome: pessoaComEndereco.nome,
            sobrenome: pessoaComEndereco.sobrenome,
            idade: pessoaComEndereco.idade,
            login: pessoaComEndereco.login,
            senha: pessoaComEndereco.senha,
            status: pessoaComEndereco.status,
          });

          pessoaComEndereco.enderecos = this.dadosEndereco;

          //limpa os endereços do form
          const enderecosFormArray = this.novaPessoaForm.get(
            'enderecos'
          ) as FormArray;
          while (enderecosFormArray.length) {
            enderecosFormArray.removeAt(0);
          }

          //adiciona os endereços da pessoa no form
          for (const endereco of pessoaComEndereco.enderecos) {
            enderecosFormArray.push(
              new FormGroup({
                codigoEndereco: new FormControl(endereco.codigoEndereco),
                codigoPessoa: new FormControl(endereco.codigoPessoa),
                codigoBairro: new FormControl(endereco.codigoBairro),
                nomeRua: new FormControl(endereco.nomeRua),
                numero: new FormControl(endereco.numero),
                complemento: new FormControl(endereco.complemento),
                cep: new FormControl(endereco.cep),
              })
            );

            endereco.codigoPessoa = pessoaComEndereco.codigoPessoa;
          }
          this.abrirModalEditar();
        },
        error: (error) => {
          this.errorsService.handleError(error);
        },
      });
  }

  salvarPessoa(): void {
    this.tituloModal = null;

    let codigoPessoa = this.novaPessoaForm.value.codigoPessoa;

    if (codigoPessoa === 0 || codigoPessoa === null) {
      this.salvarNovaPessoa();
    } else {
      this.salvarEdicaoPessoa();
    }
  }

  excluirPessoa(id: number): void {
    let mensagem = 'Você não será capaz de reverter isso! ';
    this.alertaService.confirmacaoRemocao(mensagem).then((result) => {
      if (result.isConfirmed) {
        this.pessoaService.excluirPessoa(id).subscribe({
          next: (pessoas) => {
            this.alertaService.mostrarSucesso('Pessoa excluída com sucesso!');
            this.dadosPessoa = pessoas;
          },
          error: (error) => {
            this.errorsService.handleError(error);
            this.buscarPessoas();
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

  salvarEdicaoPessoa(): void {
    this.pessoaService
      .editarPessoa(this.novaPessoaForm.value as IPessoa)
      .subscribe({
        next: (pessoas) => {
          this.alertaService.mostrarSucesso('Pessoa editada com sucesso!');
          this.dadosPessoa = pessoas;
        },
        error: (error) => {
          this.errorsService.handleError(error);
          this.buscarPessoas();
        },
      });
  }

  salvarNovaPessoa(): void {
    this.pessoaService
      .cadastrarPessoa(this.novaPessoaForm.value as IPessoa)
      .subscribe({
        next: (pessoas) => {
          this.alertaService.mostrarSucesso('Pessoa cadastrada com sucesso!');
          this.dadosPessoa = pessoas;
          this.novaPessoaForm.reset();
        },
        error: (error) => {
          this.errorsService.handleError(error);
          this.buscarPessoas();
        },
      });
  }

  showPessoa(codigoPessoa: number): void {
    this.pessoaService.devolverPessoaComEnderecos(codigoPessoa).subscribe({
      next: (pessoaComEnderecos) => {
        this.pessoaSelecionada = pessoaComEnderecos;
        this.abrirModalShowPessoa();
      },
      error: (error) => {
        this.errorsService.handleError(error);
      },
    });
  }

  abrirModalShowPessoa(): void {
    if (this.pessoaSelecionada !== null) {
      const modalElement2 = document.getElementById('showPessoaModal');
      if (modalElement2) {
        modalElement2.setAttribute('data-bs-backdrop', 'static');
        modalElement2.setAttribute('data-bs-keyboard', 'false');
        const modal = new bootstrap.Modal(modalElement2);
        modal.show();
      }
    }
  }

  pesquisaPessoa(): void {
    let campo = this.search.value.campo;
    let valor = this.search.value.valor;
    if (campo === 'codigoPessoa') {
      this.pessoaService.devolverPessoaComEnderecos(Number(valor)).subscribe({
        next: (pessoaComEnderecos) => {
          this.pessoaSelecionada = pessoaComEnderecos;
          this.abrirModalShowPessoa();
        },
        error: (error) => {
          this.errorsService.handleError(error);
        },
      });
    } else if (campo && valor) {
      this.pessoaService.pesquisarPessoa(campo, valor).subscribe({
        next: (pessoas) => {
          if (Array.isArray(pessoas)) {
            this.dadosPessoa = pessoas;
          } else {
            this.dadosPessoa = [pessoas];
          }
        },
        error: (error) => {
          this.errorsService.handleError(error);
          this.buscarPessoas();
        },
      });
    } else {
      this.buscarPessoas();
    }
  }

  limparPesquisa(): void {
    this.search.reset();
    this.search.patchValue({ campo: '-1' });
    this.buscarPessoas();
  }
}
