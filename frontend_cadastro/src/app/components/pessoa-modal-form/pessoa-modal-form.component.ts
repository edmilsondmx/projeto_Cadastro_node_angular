import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { ErrorsService } from 'src/app/errors/errors.service';
import { IBairro, IEndereco, IPessoa } from 'src/app/models/interfaces';
import { BairroService } from 'src/app/services/bairro.service';

@Component({
  selector: 'app-pessoa-modal-form',
  templateUrl: './pessoa-modal-form.component.html',
  styleUrls: ['./pessoa-modal-form.component.scss'],
})
export class PessoaModalFormComponent implements OnInit {
  visualizar_senha: boolean = false;

  @Input() titulo!: string;
  @Input() pessoaForm!: any;

  @Output() salvarItem = new EventEmitter<any>();

  listaBairros: IBairro[] = [];

  constructor(
    private bairroService: BairroService,
    private errorsService: ErrorsService
  ) {}

  ngOnInit(): void {
    this.buscarListaBairros();
  }

  salvar(): void {
    this.salvarItem.emit(this.pessoaForm);
    this.visualizar_senha = false;
  }

  cloneEnderecoForm() {
    const pessoa = this.pessoaForm.value as IPessoa;
    const enderecos = this.pessoaForm.get('enderecos') as FormArray;
    enderecos.push(
      new FormGroup({
        codigoPessoa: new FormControl(pessoa.codigoPessoa),
        codigoBairro: new FormControl(-1, [Validators.required]),
        nomeRua: new FormControl(''),
        numero: new FormControl(''),
        complemento: new FormControl(''),
        cep: new FormControl(''),
      })
    );
  }

  removerEndereco(index: number) {
    const enderecos = this.pessoaForm.get('enderecos') as FormArray;
    if (enderecos.length > 1) {
      enderecos.removeAt(index);
    }
  }

  buscarListaBairros(): void {
    this.bairroService.devolverBairros().subscribe({
      next: (bairros) => {
        this.listaBairros = bairros;
      },
      error: (error) => {
        this.errorsService.handleError(error);
      },
    });
  }

  visualizarSenha() {
    const senha = document.querySelector('#senhaInput') as HTMLInputElement;
    senha.type = this.visualizar_senha ? 'password' : 'text';
    this.visualizar_senha = !this.visualizar_senha;
  }
}
