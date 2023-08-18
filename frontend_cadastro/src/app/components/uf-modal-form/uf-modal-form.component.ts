import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUf } from 'src/app/models/interfaces';

@Component({
  selector: 'app-uf-modal-form',
  templateUrl: './uf-modal-form.component.html',
  styleUrls: ['./uf-modal-form.component.scss'],
})
export class UfModalFormComponent {
  @Input() titulo!: string;
  @Input() ufForm!: any;

  @Output() salvarItem = new EventEmitter<any>();

  salvar(): void {
    this.salvarItem.emit(this.ufForm);
  }
}
