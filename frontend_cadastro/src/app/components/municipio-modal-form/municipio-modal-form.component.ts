import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorsService } from 'src/app/errors/errors.service';
import { IUf } from 'src/app/models/interfaces';
import { AlertasService } from 'src/app/services/alertas.service';
import { UfService } from 'src/app/services/uf.service';

@Component({
  selector: 'app-municipio-modal-form',
  templateUrl: './municipio-modal-form.component.html',
  styleUrls: ['./municipio-modal-form.component.scss'],
})
export class MunicipioModalFormComponent implements OnInit {
  @Input() titulo!: string;
  @Input() municipioForm!: any;

  @Output() salvarItem = new EventEmitter<any>();

  listaUFs: IUf[] = [];

  constructor(
    private ufService: UfService,
    private errorsService: ErrorsService
  ) {}

  ngOnInit(): void {
    this.buscarListaUFs();
  }

  salvar(): void {
    this.salvarItem.emit(this.municipioForm);
  }

  buscarListaUFs(): void {
    this.ufService.devolverUfs().subscribe({
      next: (ufs) => {
        this.listaUFs = ufs;
      },
      error: (error) => {
        this.errorsService.handleError(error);
      },
    });
  }
}
