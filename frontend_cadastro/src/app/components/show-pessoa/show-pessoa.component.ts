import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-show-pessoa',
  templateUrl: './show-pessoa.component.html',
  styleUrls: ['./show-pessoa.component.scss'],
})
export class ShowPessoaComponent implements OnChanges {
  @Input() pessoaSelecionada!: any;

  @Output() editarItem = new EventEmitter<any>();

  pessoa!: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pessoaSelecionada'] && this.pessoaSelecionada) {
      this.pessoa = { ...this.pessoaSelecionada };
    }
  }

  emitirEditarItem() {
    this.editarItem.emit(this.pessoaSelecionada);
  }
}
